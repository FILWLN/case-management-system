import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as XLSX from 'xlsx';
import { Case, CaseType, CivilCaseStatus, FreezeStatus, RepaymentMethod } from '../cases/case.entity';
import { DataCleaningService } from './data-cleaning.service';

// 案件导入记录接口
export interface CaseImportRecord {
  pinCode: string;
  customerName: string;
  customerIdcard?: string;
  customerPhone?: string;
  gender?: string;
  ethnicity?: string;
  birthDate?: Date;
  homeAddress?: string;
  address?: string;
  loanPrincipal: number;
  installments: number;
  annualInterestRate?: number;
  loanContractDate?: Date;
  loanContractExpiryDate?: Date;
  firstOverdueDate?: Date;
  firstCompensationDate?: Date;
  lastCompensationDate?: Date;
  originalClaim?: number;
  fees?: number;
  collector?: string;
  collectionAgency?: string;
}

// 列映射配置（基于实际Excel列位置）
const CASE_COLUMN_MAPPING: Record<string, string> = {
  pinCode: '京东PIN',
  customerName: '客户姓名',
  customerIdcard: '身份证号',
  customerPhone: '电话',
  gender: '性别',
  ethnicity: '民族',
  birthDate: '出生日期',
  homeAddress: '户籍住址',
  address: '通讯地址',
  loanPrincipal: '借款本金',
  installments: '分期期数',
  annualInterestRate: '年贷款利率',
  loanContractDate: '借款合同签订日期',
  loanContractExpiryDate: '借款合同到期日期',
  firstOverdueDate: '首次逾期日',
  firstCompensationDate: '首次代偿日期',
  lastCompensationDate: '最后代偿日期',
  originalClaim: '诉讼标的',
  fees: '费用',
  collector: '催收员',
  collectionAgency: '催收机构',
};

@Injectable()
export class CaseImportService {
  private readonly logger = new Logger(CaseImportService.name);

  constructor(
    @InjectRepository(Case)
    private caseRepo: Repository<Case>,
    private cleaningService: DataCleaningService,
  ) {}

  /**
   * 解析Excel文件
   */
  parseExcel(fileBuffer: Buffer): any[] {
    try {
      const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      this.logger.log(`Excel解析完成，共 ${data.length} 行数据`);
      return data;
    } catch (error) {
      this.logger.error('Excel解析失败', error);
      throw new BadRequestException('Excel文件解析失败，请检查文件格式');
    }
  }

  /**
   * 导入案件数据
   */
  async importCases(fileBuffer: Buffer, operator: string): Promise<{
    total: number;
    success: number;
    failed: number;
    skipped: number;
    errors: Array<{ row: number; message: string; data: any }>;
  }> {
    const rawData = this.parseExcel(fileBuffer);
    const result = {
      total: rawData.length,
      success: 0,
      failed: 0,
      skipped: 0,
      errors: [] as Array<{ row: number; message: string; data: any }>,
    };

    for (let i = 0; i < rawData.length; i++) {
      const row = rawData[i];
      const rowNum = i + 2;

      try {
        // 1. 数据清洗
        const cleaned = this.cleaningService.cleanRow(row, CASE_COLUMN_MAPPING);
        
        // 2. 验证必填字段
        if (!cleaned.pinCode) {
          throw new Error('京东PIN码不能为空');
        }
        if (!cleaned.customerName) {
          throw new Error('客户姓名不能为空');
        }
        if (!cleaned.loanPrincipal || cleaned.loanPrincipal <= 0) {
          throw new Error('借款本金必须大于0');
        }
        if (!cleaned.installments || cleaned.installments <= 0) {
          throw new Error('分期期数必须大于0');
        }

        // 3. 检查重复案件
        const existingCase = await this.caseRepo.findOne({
          where: {
            pinCode: cleaned.pinCode,
            caseType: CaseType.CIVIL,
          },
        });

        if (existingCase) {
          result.skipped++;
          this.logger.warn(`第${rowNum}行跳过：案件已存在 (PIN: ${cleaned.pinCode})`);
          continue;
        }

        // 4. 创建案件
        await this.createCase(cleaned, operator);

        result.success++;
        this.logger.log(`第${rowNum}行导入成功: ${cleaned.pinCode} - ${cleaned.customerName}`);
      } catch (error) {
        result.failed++;
        result.errors.push({
          row: rowNum,
          message: error.message,
          data: row,
        });
        this.logger.warn(`第${rowNum}行导入失败: ${error.message}`);
      }
    }

    return result;
  }

  /**
   * 创建案件
   */
  private async createCase(record: CaseImportRecord, operator: string): Promise<Case> {
    const originalClaim = record.originalClaim || record.loanPrincipal + (record.fees || 0);

    const caseData = this.caseRepo.create({
      pinCode: record.pinCode,
      caseType: CaseType.CIVIL,
      status: CivilCaseStatus.FILING_SUBMITTED,
      
      customerName: record.customerName,
      customerIdcard: record.customerIdcard,
      customerPhone: record.customerPhone,
      gender: record.gender,
      ethnicity: record.ethnicity,
      birthDate: record.birthDate,
      homeAddress: record.homeAddress,
      address: record.address,
      
      loanPrincipal: record.loanPrincipal,
      installments: record.installments,
      annualInterestRate: record.annualInterestRate,
      loanContractDate: record.loanContractDate,
      loanContractExpiryDate: record.loanContractExpiryDate,
      firstOverdueDate: record.firstOverdueDate,
      firstCompensationDate: record.firstCompensationDate,
      lastCompensationDate: record.lastCompensationDate,
      
      amountInfo: {
        originalClaim,
        remainingClaim: originalClaim,
        paidTotal: 0,
        executionTarget: 0,
        executionPaid: 0,
        fees: record.fees || 0,
        courtDeduction: 0,
        voluntaryRepayment: 0,
      },
      
      collector: record.collector,
      collectionAgency: record.collectionAgency,
      freezeStatus: FreezeStatus.NORMAL,
      repaymentMethod: RepaymentMethod.CUSTOM,
      
      isDeleted: false,
      createdBy: operator,
      updatedBy: operator,
    });

    return this.caseRepo.save(caseData);
  }

  /**
   * 预览导入数据
   */
  async previewImport(fileBuffer: Buffer): Promise<{
    total: number;
    preview: Array<{
      row: number;
      pinCode: string;
      customerName: string;
      loanPrincipal: number;
      exists: boolean;
      errors?: string[];
    }>;
  }> {
    const rawData = this.parseExcel(fileBuffer);
    const preview = [];

    for (let i = 0; i < Math.min(rawData.length, 10); i++) {
      const row = rawData[i];
      const rowNum = i + 2;
      const errors = [];

      try {
        const cleaned = this.cleaningService.cleanRow(row, CASE_COLUMN_MAPPING);
        
        // 验证
        if (!cleaned.pinCode) errors.push('京东PIN码不能为空');
        if (!cleaned.customerName) errors.push('客户姓名不能为空');
        if (!cleaned.loanPrincipal || cleaned.loanPrincipal <= 0) errors.push('借款本金无效');
        if (!cleaned.installments || cleaned.installments <= 0) errors.push('分期期数无效');

        const exists = !!(await this.caseRepo.findOne({
          where: { pinCode: cleaned.pinCode, caseType: CaseType.CIVIL },
        }));
        
        preview.push({
          row: rowNum,
          pinCode: cleaned.pinCode || '未知',
          customerName: cleaned.customerName || '未知',
          loanPrincipal: cleaned.loanPrincipal || 0,
          exists,
          errors: errors.length > 0 ? errors : undefined,
        });
      } catch (error) {
        preview.push({
          row: rowNum,
          pinCode: '解析失败',
          customerName: '解析失败',
          loanPrincipal: 0,
          exists: false,
          errors: [error.message],
        });
      }
    }

    return {
      total: rawData.length,
      preview,
    };
  }
}
