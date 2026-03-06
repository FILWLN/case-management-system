import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as XLSX from 'xlsx';
import { Case, CaseType, CivilCaseStatus, FreezeStatus, RepaymentMethod } from '../cases/case.entity';

// 案件导入记录接口
export interface CaseImportRecord {
  // 核心字段（必填）
  pinCode: string;               // 京东PIN码
  customerName: string;          // 客户姓名
  
  // 身份信息
  customerIdcard?: string;       // 身份证号
  customerPhone?: string;        // 电话
  gender?: string;               // 性别
  ethnicity?: string;            // 民族
  birthDate?: Date;              // 出生日期
  homeAddress?: string;          // 户籍住址
  address?: string;              // 通讯地址
  
  // 借款信息
  loanPrincipal: number;         // 借款本金
  installments: number;          // 分期期数
  annualInterestRate?: number;   // 年贷款利率
  loanContractDate?: Date;       // 借款合同签订日期
  loanContractExpiryDate?: Date; // 借款合同到期日期
  firstOverdueDate?: Date;       // 首次逾期日
  firstCompensationDate?: Date;  // 首次代偿日期
  lastCompensationDate?: Date;   // 最后代偿日期
  
  // 金额信息
  originalClaim?: number;        // 诉讼标的（借款本金+费用）
  fees?: number;                 // 费用
  
  // 其他
  collector?: string;            // 催收员
  collectionAgency?: string;     // 催收机构
}

// 导入结果
export interface CaseImportResult {
  total: number;                 // 总行数
  success: number;               // 成功导入数
  failed: number;                // 失败数
  skipped: number;               // 跳过数（重复案件）
  errors: Array<{
    row: number;
    message: string;
    data: any;
  }>;
  importedCases: CaseImportRecord[];
}

@Injectable()
export class CaseImportService {
  private readonly logger = new Logger(CaseImportService.name);

  constructor(
    @InjectRepository(Case)
    private caseRepo: Repository<Case>,
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
      return data;
    } catch (error) {
      this.logger.error('Excel解析失败', error);
      throw new BadRequestException('Excel文件解析失败，请检查文件格式');
    }
  }

  /**
   * 导入案件数据
   */
  async importCases(fileBuffer: Buffer, operator: string): Promise<CaseImportResult> {
    const rawData = this.parseExcel(fileBuffer);
    const result: CaseImportResult = {
      total: rawData.length,
      success: 0,
      failed: 0,
      skipped: 0,
      errors: [],
      importedCases: [],
    };

    for (let i = 0; i < rawData.length; i++) {
      const row = rawData[i];
      const rowNum = i + 2;

      try {
        // 1. 验证和转换数据
        const record = await this.validateAndTransform(row, rowNum);
        
        // 2. 检查重复案件（同PIN码同类型）
        const existingCase = await this.caseRepo.findOne({
          where: {
            pinCode: record.pinCode,
            caseType: CaseType.CIVIL,
          },
        });

        if (existingCase) {
          result.skipped++;
          this.logger.warn(`第${rowNum}行跳过：案件已存在 (PIN: ${record.pinCode})`);
          continue;
        }

        // 3. 创建案件
        await this.createCase(record, operator);

        result.success++;
        result.importedCases.push(record);
        
        this.logger.log(`第${rowNum}行导入成功: ${record.pinCode} - ${record.customerName}`);
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
   * 验证并转换数据
   */
  private async validateAndTransform(row: any, rowNum: number): Promise<CaseImportRecord> {
    // 提取京东PIN（支持多种列名）
    const pinCode = this.extractValue(row, ['京东PIN', 'PIN码', '客户ID', 'pinCode', 'jdPin']);
    const customerName = this.extractValue(row, ['客户姓名', '姓名', 'customerName', 'name']);
    const loanPrincipal = parseFloat(this.extractValue(row, ['借款本金', '本金', 'loanPrincipal', 'principal']) || 0);
    const installments = parseInt(this.extractValue(row, ['分期期数', '期数', 'installments']) || 0);

    // 验证必填字段
    if (!pinCode) {
      throw new Error('京东PIN码不能为空');
    }
    if (!customerName) {
      throw new Error('客户姓名不能为空');
    }
    if (!loanPrincipal || loanPrincipal <= 0) {
      throw new Error('借款本金必须大于0');
    }
    if (!installments || installments <= 0) {
      throw new Error('分期期数必须大于0');
    }

    // 提取可选字段
    const record: CaseImportRecord = {
      pinCode: String(pinCode).trim(),
      customerName: String(customerName).trim(),
      loanPrincipal,
      installments,
      
      // 身份信息
      customerIdcard: this.extractValue(row, ['身份证号', '身份证', 'idcard', 'customerIdcard']),
      customerPhone: this.extractValue(row, ['电话', '手机号', 'phone', 'customerPhone']),
      gender: this.extractValue(row, ['性别', 'gender']),
      ethnicity: this.extractValue(row, ['民族', 'ethnicity']),
      birthDate: this.parseDate(this.extractValue(row, ['出生日期', 'birthDate'])),
      homeAddress: this.extractValue(row, ['户籍住址', '家庭住址', 'homeAddress']),
      address: this.extractValue(row, ['通讯地址', '地址', 'address']),
      
      // 借款信息
      annualInterestRate: parseFloat(this.extractValue(row, ['年贷款利率', '利率', 'annualInterestRate']) || 0),
      loanContractDate: this.parseDate(this.extractValue(row, ['借款合同签订日期', '借款日期', 'loanContractDate'])),
      loanContractExpiryDate: this.parseDate(this.extractValue(row, ['借款合同到期日期', '到期日期', 'loanContractExpiryDate'])),
      firstOverdueDate: this.parseDate(this.extractValue(row, ['首次逾期日', '逾期日期', 'firstOverdueDate'])),
      firstCompensationDate: this.parseDate(this.extractValue(row, ['首次代偿日期', 'firstCompensationDate'])),
      lastCompensationDate: this.parseDate(this.extractValue(row, ['最后代偿日期', 'lastCompensationDate'])),
      
      // 金额
      originalClaim: parseFloat(this.extractValue(row, ['诉讼标的', '标的金额', 'originalClaim']) || 0),
      fees: parseFloat(this.extractValue(row, ['费用', 'fees']) || 0),
      
      // 其他
      collector: this.extractValue(row, ['催收员', 'collector']),
      collectionAgency: this.extractValue(row, ['催收机构', '机构', 'collectionAgency']),
    };

    return record;
  }

  /**
   * 从行数据中提取值（支持多种列名）
   */
  private extractValue(row: any, possibleKeys: string[]): string | undefined {
    for (const key of possibleKeys) {
      if (row[key] !== undefined && row[key] !== null && row[key] !== '') {
        return String(row[key]).trim();
      }
    }
    return undefined;
  }

  /**
   * 解析日期
   */
  private parseDate(dateValue: any): Date | undefined {
    if (!dateValue) return undefined;
    
    try {
      const date = new Date(dateValue);
      if (!isNaN(date.getTime())) {
        return date;
      }
    } catch {
      // 尝试其他格式
      if (typeof dateValue === 'number') {
        // Excel日期格式（1900年1月1日起的天数）
        const excelEpoch = new Date(1900, 0, 1);
        return new Date(excelEpoch.getTime() + (dateValue - 2) * 24 * 60 * 60 * 1000);
      }
    }
    return undefined;
  }

  /**
   * 创建案件
   */
  private async createCase(record: CaseImportRecord, operator: string): Promise<Case> {
    // 计算诉讼标的（本金 + 费用）
    const originalClaim = record.originalClaim || record.loanPrincipal + (record.fees || 0);
    const remainingClaim = originalClaim;

    const caseData = this.caseRepo.create({
      pinCode: record.pinCode,
      caseType: CaseType.CIVIL,
      status: CivilCaseStatus.FILING_SUBMITTED,
      
      // 客户信息
      customerName: record.customerName,
      customerIdcard: record.customerIdcard,
      customerPhone: record.customerPhone,
      gender: record.gender,
      ethnicity: record.ethnicity,
      birthDate: record.birthDate,
      homeAddress: record.homeAddress,
      address: record.address,
      
      // 借款信息
      loanPrincipal: record.loanPrincipal,
      installments: record.installments,
      annualInterestRate: record.annualInterestRate,
      loanContractDate: record.loanContractDate,
      loanContractExpiryDate: record.loanContractExpiryDate,
      firstOverdueDate: record.firstOverdueDate,
      firstCompensationDate: record.firstCompensationDate,
      lastCompensationDate: record.lastCompensationDate,
      
      // 金额信息
      amountInfo: {
        originalClaim,
        remainingClaim,
        paidTotal: 0,
        executionTarget: 0,
        executionPaid: 0,
        fees: record.fees || 0,
        courtDeduction: 0,
        voluntaryRepayment: 0,
      },
      
      // 其他
      collector: record.collector,
      collectionAgency: record.collectionAgency,
      freezeStatus: FreezeStatus.NORMAL,
      repaymentMethod: RepaymentMethod.CUSTOM,
      
      // 系统字段
      isDeleted: false,
      createdBy: operator,
      updatedBy: operator,
    });

    return this.caseRepo.save(caseData);
  }

  /**
   * 生成导入模板
   */
  generateTemplate(): Buffer {
    const templateData = [
      {
        '京东PIN': 'JD123456789',
        '客户姓名': '张三',
        '身份证号': '110101199001011234',
        '电话': '13800138000',
        '性别': '男',
        '民族': '汉族',
        '出生日期': '1990-01-01',
        '户籍住址': '北京市朝阳区xxx街道',
        '通讯地址': '北京市海淀区xxx小区',
        '借款本金': 10000,
        '分期期数': 12,
        '年贷款利率': 15.4,
        '借款合同签订日期': '2024-01-01',
        '借款合同到期日期': '2024-12-31',
        '首次逾期日': '2024-03-01',
        '首次代偿日期': '2024-03-05',
        '最后代偿日期': '2024-03-05',
        '诉讼标的': 10000,
        '费用': 500,
        '催收员': '李四',
        '催收机构': '法催团队A',
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '案件信息');
    
    return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
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
      installments: number;
      exists: boolean;
    }>;
  }> {
    const rawData = this.parseExcel(fileBuffer);
    const preview = [];

    for (let i = 0; i < Math.min(rawData.length, 10); i++) {
      const row = rawData[i];
      try {
        const record = await this.validateAndTransform(row, i + 2);
        const exists = !!(await this.caseRepo.findOne({
          where: { pinCode: record.pinCode, caseType: CaseType.CIVIL },
        }));
        
        preview.push({
          row: i + 2,
          pinCode: record.pinCode,
          customerName: record.customerName,
          loanPrincipal: record.loanPrincipal,
          installments: record.installments,
          exists,
        });
      } catch (error) {
        preview.push({
          row: i + 2,
          pinCode: this.extractValue(row, ['京东PIN', 'PIN码', '客户ID']) || '未知',
          customerName: this.extractValue(row, ['客户姓名', '姓名']) || '未知',
          loanPrincipal: parseFloat(this.extractValue(row, ['借款本金', '本金']) || 0),
          installments: parseInt(this.extractValue(row, ['分期期数', '期数']) || 0),
          exists: false,
          error: error.message,
        });
      }
    }

    return {
      total: rawData.length,
      preview,
    };
  }
}
