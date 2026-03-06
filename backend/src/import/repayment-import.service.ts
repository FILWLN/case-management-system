import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as XLSX from 'xlsx';
import { Case } from '../cases/case.entity';
import { RepaymentInstallment } from '../cases/repayment-installment.entity';

// 还款记录接口
export interface RepaymentRecord {
  pinCode?: string;              // 京东PIN（从客户ID提取）
  customerId: string;            // 客户ID
  repaymentAmount: number;       // 还款金额
  couponAmount?: number;         // 优惠券核销金额
  repaymentDate: Date;           // 还款时间
  repaymentMethod: string;       // 还款方式
  repaymentType: 'voluntary' | 'court_deduction'; // 还款类型：主动还款/法院划扣
  collector?: string;            // 催收员
  collectionAgency?: string;     // 催收机构
  remark?: string;               // 备注
}

// 导入结果
export interface ImportResult {
  total: number;                 // 总行数
  success: number;               // 成功导入数
  failed: number;                // 失败数
  errors: Array<{
    row: number;
    message: string;
    data: any;
  }>;
  importedRecords: RepaymentRecord[];
}

@Injectable()
export class RepaymentImportService {
  private readonly logger = new Logger(RepaymentImportService.name);

  constructor(
    @InjectRepository(Case)
    private caseRepo: Repository<Case>,
    @InjectRepository(RepaymentInstallment)
    private installmentRepo: Repository<RepaymentInstallment>,
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
   * 导入还款数据
   */
  async importRepayments(fileBuffer: Buffer, operator: string): Promise<ImportResult> {
    const rawData = this.parseExcel(fileBuffer);
    const result: ImportResult = {
      total: rawData.length,
      success: 0,
      failed: 0,
      errors: [],
      importedRecords: [],
    };

    for (let i = 0; i < rawData.length; i++) {
      const row = rawData[i];
      const rowNum = i + 2; // Excel行号（从2开始，1是表头）

      try {
        // 1. 数据验证和转换
        const record = await this.validateAndTransform(row, rowNum);
        
        // 2. 查找关联案件
        const caseData = await this.findCaseByCustomerId(record.customerId);
        if (!caseData) {
          throw new Error(`未找到客户ID ${record.customerId} 对应的案件`);
        }

        // 3. 保存还款记录
        await this.saveRepaymentRecord(caseData, record, operator);

        result.success++;
        result.importedRecords.push(record);
        
        this.logger.log(`第${rowNum}行导入成功: ${record.customerId} 还款 ${record.repaymentAmount}元`);
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
  private async validateAndTransform(row: any, rowNum: number): Promise<RepaymentRecord> {
    // 字段映射（根据实际Excel列名）
    const customerId = row['客户ID'] || row['客户Id'] || row['customerId'];
    const repaymentAmount = parseFloat(row['还款金额（元）'] || row['还款金额'] || 0);
    const couponAmount = parseFloat(row['还款券核销金额（元）'] || row['优惠券金额'] || 0);
    const repaymentDateStr = row['还款时间'] || row['还款日期'];
    const repaymentMethod = row['还款方式'] || '';
    const collector = row['催收员'] || row['还款人员'] || '';
    const collectionAgency = row['催收机构'] || row['结算机构'] || '';

    // 验证必填字段
    if (!customerId) {
      throw new Error('客户ID不能为空');
    }
    if (!repaymentAmount || repaymentAmount <= 0) {
      throw new Error('还款金额必须大于0');
    }
    if (!repaymentDateStr) {
      throw new Error('还款时间不能为空');
    }

    // 解析日期
    let repaymentDate: Date;
    try {
      repaymentDate = new Date(repaymentDateStr);
      if (isNaN(repaymentDate.getTime())) {
        throw new Error('日期格式错误');
      }
    } catch {
      throw new Error(`还款时间格式错误: ${repaymentDateStr}`);
    }

    // 判断还款类型（主动还款 vs 法院划扣）
    const repaymentType = this.determineRepaymentType(repaymentMethod);

    // 提取PIN码（从客户ID）
    const pinCode = this.extractPinCode(customerId);

    return {
      pinCode,
      customerId,
      repaymentAmount,
      couponAmount,
      repaymentDate,
      repaymentMethod,
      repaymentType,
      collector,
      collectionAgency,
    };
  }

  /**
   * 判断还款类型
   * 根据客户需求：当事人主动还款 与 法院划扣 需要区分
   */
  private determineRepaymentType(repaymentMethod: string): 'voluntary' | 'court_deduction' {
    const method = String(repaymentMethod).toLowerCase().trim();
    
    // 法院划扣关键词
    const courtKeywords = ['法院', '划扣', '扣划', '强制执行', '司法扣划'];
    
    // 主动还款关键词
    const voluntaryKeywords = ['主动', '线下', '线上', '转账', '支付宝', '微信', '银行'];
    
    if (courtKeywords.some(k => method.includes(k))) {
      return 'court_deduction';
    }
    
    // 默认认为是主动还款
    return 'voluntary';
  }

  /**
   * 从客户ID提取PIN码
   */
  private extractPinCode(customerId: string): string | undefined {
    if (!customerId) return undefined;
    
    // 如果客户ID格式是 jd_xxx，提取后面的部分
    if (customerId.startsWith('jd_')) {
      return customerId.substring(3);
    }
    
    return customerId;
  }

  /**
   * 根据客户ID查找案件
   */
  private async findCaseByCustomerId(customerId: string): Promise<Case | null> {
    // 尝试多种匹配方式
    const pinCode = this.extractPinCode(customerId);
    
    // 1. 先按PIN码查找
    if (pinCode) {
      const caseByPin = await this.caseRepo.findOne({
        where: { pinCode },
        order: { createdAt: 'DESC' },
      });
      if (caseByPin) return caseByPin;
    }
    
    // 2. 按客户ID查找
    const caseById = await this.caseRepo.findOne({
      where: [
        { customerId },
        { pinCode: customerId },
      ],
      order: { createdAt: 'DESC' },
    });
    
    return caseById;
  }

  /**
   * 保存还款记录
   */
  private async saveRepaymentRecord(
    caseData: Case,
    record: RepaymentRecord,
    operator: string,
  ): Promise<void> {
    // 创建还款分期记录
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
      // 扩展字段存储还款类型
      repaymentType: record.repaymentType,
      repaymentMethod: record.repaymentMethod,
      collector: record.collector,
      collectionAgency: record.collectionAgency,
    });

    await this.installmentRepo.save(installment);

    // 更新案件金额信息
    await this.updateCaseAmount(caseData, record);
  }

  /**
   * 获取下一期数
   */
  private async getNextPeriod(caseId: string): Promise<number> {
    const count = await this.installmentRepo.count({
      where: { caseId },
    });
    return count + 1;
  }

  /**
   * 更新案件金额
   */
  private async updateCaseAmount(caseData: Case, record: RepaymentRecord): Promise<void> {
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

    // 累加还款总额
    caseData.amountInfo.paidTotal += record.repaymentAmount;
    
    // 区分还款类型
    if (record.repaymentType === 'court_deduction') {
      caseData.amountInfo.courtDeduction += record.repaymentAmount;
    } else {
      caseData.amountInfo.voluntaryRepayment += record.repaymentAmount;
    }

    // 重新计算剩余金额
    if (caseData.caseType === '民初') {
      caseData.amountInfo.remainingClaim = 
        caseData.amountInfo.originalClaim - caseData.amountInfo.paidTotal;
    } else if (caseData.caseType === '执行') {
      caseData.amountInfo.executionPaid = caseData.amountInfo.paidTotal;
    }

    await this.caseRepo.save(caseData);
  }

  /**
   * 生成导入模板
   */
  generateTemplate(): Buffer {
    const templateData = [
      {
        '客户ID': 'jd_xxx 或 PIN码',
        '还款金额（元）': 1000,
        '还款券核销金额（元）': 0,
        '还款时间': '2025-03-07',
        '还款方式': '线下还款/主动还款/法院划扣',
        '催收员': '张三',
        '催收机构': '法催团队',
        '备注': '可选填',
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '还款明细');
    
    return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  }

  /**
   * 预览导入数据（不实际保存）
   */
  async previewImport(fileBuffer: Buffer): Promise<{
    total: number;
    preview: Array<{
      row: number;
      customerId: string;
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
      try {
        const record = await this.validateAndTransform(row, i + 2);
        const exists = !!(await this.findCaseByCustomerId(record.customerId));
        
        preview.push({
          row: i + 2,
          customerId: record.customerId,
          repaymentAmount: record.repaymentAmount,
          repaymentDate: record.repaymentDate.toISOString().split('T')[0],
          repaymentType: record.repaymentType === 'court_deduction' ? '法院划扣' : '主动还款',
          exists,
        });
      } catch (error) {
        preview.push({
          row: i + 2,
          customerId: row['客户ID'] || '未知',
          repaymentAmount: row['还款金额（元）'] || 0,
          repaymentDate: row['还款时间'] || '',
          repaymentType: '解析失败',
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
