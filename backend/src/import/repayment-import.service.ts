import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as XLSX from 'xlsx';
import { Case } from '../cases/case.entity';
import { RepaymentInstallment } from '../cases/repayment-installment.entity';
import { DataCleaningService } from './data-cleaning.service';

// 列映射配置（基于实际Excel列位置）
const REPAYMENT_COLUMN_MAPPING: Record<string, string> = {
  customerId: '客户ID',
  repaymentAmount: '还款金额（元）',
  couponAmount: '还款券核销金额（元）',
  repaymentDate: '还款时间',
  repaymentMethod: '还款方式',
  collector: '催收员',
  collectionAgency: '催收机构',
};

@Injectable()
export class RepaymentImportService {
  private readonly logger = new Logger(RepaymentImportService.name);

  constructor(
    @InjectRepository(Case)
    private caseRepo: Repository<Case>,
    @InjectRepository(RepaymentInstallment)
    private installmentRepo: Repository<RepaymentInstallment>,
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
   * 导入还款数据
   */
  async importRepayments(fileBuffer: Buffer, operator: string): Promise<{
    total: number;
    success: number;
    failed: number;
    errors: Array<{ row: number; message: string; data: any }>;
  }> {
    const rawData = this.parseExcel(fileBuffer);
    const result = {
      total: rawData.length,
      success: 0,
      failed: 0,
      errors: [] as Array<{ row: number; message: string; data: any }>,
    };

    for (let i = 0; i < rawData.length; i++) {
      const row = rawData[i];
      const rowNum = i + 2;

      try {
        // 1. 数据清洗
        const cleaned = this.cleaningService.cleanRow(row, REPAYMENT_COLUMN_MAPPING);
        
        // 2. 验证必填字段
        if (!cleaned.customerId) {
          throw new Error('客户ID不能为空');
        }
        if (!cleaned.repaymentAmount || cleaned.repaymentAmount <= 0) {
          throw new Error('还款金额必须大于0');
        }
        if (!cleaned.repaymentDate) {
          throw new Error('还款时间不能为空');
        }

        // 3. 提取PIN码
        const pinCode = this.extractPinCode(cleaned.customerId);
        if (!pinCode) {
          throw new Error(`无法从客户ID提取PIN码: ${cleaned.customerId}`);
        }

        // 4. 查找关联案件
        const caseData = await this.caseRepo.findOne({
          where: [
            { pinCode },
            { customerId: cleaned.customerId },
          ],
          order: { createdAt: 'DESC' },
        });

        if (!caseData) {
          throw new Error(`未找到客户ID ${cleaned.customerId} 对应的案件`);
        }

        // 5. 判断还款类型
        const repaymentType = this.determineRepaymentType(cleaned.repaymentMethod || '');

        // 6. 保存还款记录
        await this.saveRepaymentRecord(caseData, cleaned, repaymentType, operator);

        result.success++;
        this.logger.log(`第${rowNum}行导入成功: ${cleaned.customerId} 还款 ${cleaned.repaymentAmount}元`);
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
   * 提取PIN码
   */
  private extractPinCode(customerId: string): string | null {
    if (!customerId) return null;
    
    if (customerId.startsWith('jd_')) {
      return customerId.substring(3);
    }

    return customerId;
  }

  /**
   * 判断还款类型
   */
  private determineRepaymentType(repaymentMethod: string): 'voluntary' | 'court_deduction' {
    const method = String(repaymentMethod).toLowerCase().trim();
    
    const courtKeywords = ['法院', '划扣', '扣划', '强制执行', '司法扣划'];
    
    if (courtKeywords.some(k => method.includes(k))) {
      return 'court_deduction';
    }
    
    return 'voluntary';
  }

  /**
   * 保存还款记录
   */
  private async saveRepaymentRecord(
    caseData: Case,
    record: any,
    repaymentType: 'voluntary' | 'court_deduction',
    operator: string,
  ): Promise<void> {
    // 创建还款记录
    const installment = this.installmentRepo.create({
      case: caseData,
      caseId: caseData.id,
      period: await this.getNextPeriod(caseData.id),
      dueDate: record.repaymentDate,
      principal: record.repaymentAmount,
      interest: 0,
      total: record.repaymentAmount,
      status: 'paid',
      paidDate: record.repaymentDate,
      paidAmount: record.repaymentAmount,
    });

    await this.installmentRepo.save(installment);

    // 更新案件金额
    await this.updateCaseAmount(caseData, record.repaymentAmount, repaymentType);
  }

  /**
   * 获取下一期数
   */
  private async getNextPeriod(caseId: string): Promise<number> {
    const count = await this.installmentRepo.count({ where: { caseId } });
    return count + 1;
  }

  /**
   * 更新案件金额
   */
  private async updateCaseAmount(
    caseData: Case,
    amount: number,
    repaymentType: 'voluntary' | 'court_deduction',
  ): Promise<void> {
    if (!caseData.amountInfo) {
      caseData.amountInfo = {
        originalClaim: 0,
        remainingClaim: 0,
        paidTotal: 0,
        executionTarget: 0,
        executionPaid: 0,
        fees: 0,
        courtDeduction: 0,
        voluntaryRepayment: 0,
      };
    }

    caseData.amountInfo.paidTotal += amount;
    
    if (repaymentType === 'court_deduction') {
      caseData.amountInfo.courtDeduction += amount;
    } else {
      caseData.amountInfo.voluntaryRepayment += amount;
    }

    caseData.amountInfo.remainingClaim = 
      caseData.amountInfo.originalClaim - caseData.amountInfo.paidTotal;

    await this.caseRepo.save(caseData);
  }

  /**
   * 生成导入模板
   */
  generateTemplate(): Buffer {
    const templateData = [
      {
        '客户ID': 'jd_xxx',
        '还款金额（元）': 1000,
        '还款券核销金额（元）': 0,
        '还款时间': '2025-03-07',
        '还款方式': '线下还款',
        '催收员': '张三',
        '催收机构': '法催团队',
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '还款明细');
    
    return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  }

  /**
   * 预览导入数据
   */
  async previewImport(fileBuffer: Buffer): Promise<{
    total: number;
    preview: Array<{
      row: number;
      customerId: string;
      pinCode: string;
      repaymentAmount: number;
      repaymentDate: string;
      repaymentType: string;
      exists: boolean;
    }>;
  }> {
    const rawData = this.parseExcel(fileBuffer);
    const preview = [];

    for (let i = 0; i < Math.min(rawData.length, 10); i++) {
      const row = rawData[i];
      const rowNum = i + 2;

      try {
        const cleaned = this.cleaningService.cleanRow(row, REPAYMENT_COLUMN_MAPPING);
        
        const pinCode = this.extractPinCode(cleaned.customerId);
        const exists = pinCode ? !!(await this.caseRepo.findOne({
          where: [
            { pinCode },
            { customerId: cleaned.customerId },
          ],
        })) : false;
        
        const repaymentType = this.determineRepaymentType(cleaned.repaymentMethod || '');
        
        preview.push({
          row: rowNum,
          customerId: cleaned.customerId || '未知',
          pinCode: pinCode || '无法提取',
          repaymentAmount: cleaned.repaymentAmount || 0,
          repaymentDate: cleaned.repaymentDate ? cleaned.repaymentDate.toISOString().split('T')[0] : '',
          repaymentType: repaymentType === 'court_deduction' ? '法院划扣' : '主动还款',
          exists,
        });
      } catch (error) {
        preview.push({
          row: rowNum,
          customerId: '解析失败',
          pinCode: '',
          repaymentAmount: 0,
          repaymentDate: '',
          repaymentType: '解析失败',
          exists: false,
        });
      }
    }

    return {
      total: rawData.length,
      preview,
    };
  }
}
