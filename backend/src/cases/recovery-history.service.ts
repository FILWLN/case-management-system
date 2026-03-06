import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Case, CaseType, ExecutionCaseStatus } from './case.entity';

/**
 * 执恢记录接口
 */
export interface RecoveryRecord {
  id: string;
  parentCaseId: string;
  pinCode: string;
  recoveryCaseNo: string;
  filingDate: Date;
  amount: number;
  status: string;
  closeDate?: Date;
  createdAt: Date;
}

/**
 * 执恢历史服务
 */
@Injectable()
export class RecoveryHistoryService {
  private readonly logger = new Logger(RecoveryHistoryService.name);

  constructor(
    @InjectRepository(Case)
    private caseRepo: Repository<Case>,
  ) {}

  /**
   * 创建执恢案件
   */
  async createRecoveryCase(
    parentCaseId: string,
    data: {
      recoveryCaseNo: string;
      amount: number;
      filingDate: Date;
    },
    operator: string,
  ): Promise<Case> {
    // 查找原执行案件
    const parentCase = await this.caseRepo.findOne({
      where: { id: parentCaseId },
    });

    if (!parentCase) {
      throw new NotFoundException('原执行案件不存在');
    }

    // 创建执恢案件
    const recoveryCase = this.caseRepo.create({
      pinCode: parentCase.pinCode,
      caseType: CaseType.RECOVERY,
      parentCaseId: parentCase.id,
      status: ExecutionCaseStatus.FILING_SUBMITTED,
      
      // 复制客户信息
      customerName: parentCase.customerName,
      customerIdcard: parentCase.customerIdcard,
      customerPhone: parentCase.customerPhone,
      
      // 执恢信息
      recoveryCaseNo: data.recoveryCaseNo,
      recoveryFilingDate: data.filingDate,
      
      // 金额信息
      amountInfo: {
        ...parentCase.amountInfo,
        executionTarget: data.amount,
        executionPaid: 0,
      },
      
      createdBy: operator,
      updatedBy: operator,
    });

    this.logger.log(
      `创建执恢案件：${data.recoveryCaseNo}，关联原案件：${parentCaseId}`,
    );

    return this.caseRepo.save(recoveryCase);
  }

  /**
   * 获取执恢历史记录
   */
  async getRecoveryHistory(parentCaseId: string): Promise<RecoveryRecord[]> {
    const recoveryCases = await this.caseRepo.find({
      where: { parentCaseId },
      order: { createdAt: 'ASC' },
    });

    return recoveryCases.map(c => ({
      id: c.id,
      parentCaseId: c.parentCaseId,
      pinCode: c.pinCode,
      recoveryCaseNo: c.recoveryCaseNo,
      filingDate: c.recoveryFilingDate,
      amount: c.amountInfo?.executionTarget || 0,
      status: c.status,
      closeDate: c.recoveryCloseDate,
      createdAt: c.createdAt,
    }));
  }

  /**
   * 获取执恢案件详情
   */
  async getRecoveryCaseDetail(recoveryCaseId: string): Promise<{
    recoveryCase: Case;
    parentCase: Case;
    history: RecoveryRecord[];
  }> {
    const recoveryCase = await this.caseRepo.findOne({
      where: { id: recoveryCaseId },
    });

    if (!recoveryCase) {
      throw new NotFoundException('执恢案件不存在');
    }

    const parentCase = await this.caseRepo.findOne({
      where: { id: recoveryCase.parentCaseId },
    });

    if (!parentCase) {
      throw new NotFoundException('原执行案件不存在');
    }

    const history = await this.getRecoveryHistory(recoveryCase.parentCaseId);

    return {
      recoveryCase,
      parentCase,
      history,
    };
  }

  /**
   * 更新执恢案件状态
   */
  async updateRecoveryStatus(
    recoveryCaseId: string,
    status: string,
    operator: string,
  ): Promise<Case> {
    const recoveryCase = await this.caseRepo.findOne({
      where: { id: recoveryCaseId },
    });

    if (!recoveryCase) {
      throw new NotFoundException('执恢案件不存在');
    }

    recoveryCase.status = status;
    
    if (status === ExecutionCaseStatus.EXECUTION_CLOSED) {
      recoveryCase.recoveryCloseDate = new Date();
    }
    
    recoveryCase.updatedBy = operator;

    this.logger.log(`执恢案件 ${recoveryCaseId} 状态更新为：${status}`);

    return this.caseRepo.save(recoveryCase);
  }

  /**
   * 获取所有执恢案件
   */
  async getAllRecoveryCases(query: {
    pinCode?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  }): Promise<{ list: Case[]; total: number }> {
    const { pinCode, startDate, endDate, page = 1, limit = 20 } = query;

    const where: any = {
      caseType: CaseType.RECOVERY,
    };

    if (pinCode) {
      where.pinCode = pinCode;
    }

    if (startDate && endDate) {
      where.createdAt = Between(startDate, endDate);
    }

    const [list, total] = await this.caseRepo.findAndCount({
      where,
      relations: ['parentCase'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { list, total };
  }

  /**
   * 获取执恢统计
   */
  async getRecoveryStats(
    startDate: Date,
    endDate: Date,
  ): Promise<{
    totalCount: number;
    successCount: number;
    totalAmount: number;
    recoveredAmount: number;
  }> {
    const recoveryCases = await this.caseRepo.find({
      where: {
        caseType: CaseType.RECOVERY,
        createdAt: Between(startDate, endDate),
      },
    });

    const successCases = recoveryCases.filter(
      c => c.status === ExecutionCaseStatus.EXECUTION_COMPLETED,
    );

    const totalAmount = recoveryCases.reduce(
      (sum, c) => sum + (c.amountInfo?.executionTarget || 0),
      0,
    );

    const recoveredAmount = successCases.reduce(
      (sum, c) => sum + (c.amountInfo?.executionPaid || 0),
      0,
    );

    return {
      totalCount: recoveryCases.length,
      successCount: successCases.length,
      totalAmount,
      recoveredAmount,
    };
  }
}
