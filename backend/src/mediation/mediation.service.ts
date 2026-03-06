import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Case, CivilCaseStatus } from '../cases/case.entity';

/**
 * 调解记录DTO
 */
export interface MediationRecordDto {
  caseId: string;
  mediationDate: Date;
  mediatorName: string;
  result: 'success' | 'failure' | 'pending';
  agreementAmount?: number;
  repaymentMethod?: string;
  installments?: number;
  firstRepaymentDate?: Date;
  remarks?: string;
}

/**
 * 调解员工作台服务
 */
@Injectable()
export class MediationService {
  private readonly logger = new Logger(MediationService.name);

  constructor(
    @InjectRepository(Case)
    private caseRepo: Repository<Case>,
  ) {}

  /**
   * 获取调解员的案件列表
   */
  async getMediationCases(mediatorName: string, query: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ list: Case[]; total: number }> {
    const { status, page = 1, limit = 20 } = query;

    const where: any = {
      mediatorName,
    };

    if (status) {
      where.status = status;
    } else {
      // 默认查询调解中的案件
      where.status = CivilCaseStatus.MEDIATION_IN_PROGRESS;
    }

    const [list, total] = await this.caseRepo.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { mediationDate: 'DESC' },
    });

    return { list, total };
  }

  /**
   * 记录调解结果
   */
  async recordMediationResult(
    data: MediationRecordDto,
    operator: string,
  ): Promise<Case> {
    const caseData = await this.caseRepo.findOne({
      where: { id: data.caseId },
    });

    if (!caseData) {
      throw new NotFoundException('案件不存在');
    }

    // 更新调解信息
    caseData.mediationDate = data.mediationDate;
    caseData.mediatorName = data.mediatorName;
    
    if (data.result === 'success') {
      caseData.status = CivilCaseStatus.MEDIATION_SUCCESS;
      caseData.negotiatedAmount = data.agreementAmount;
      caseData.closeType = '调解';
      caseData.closeDate = new Date();
      
      // 更新还款计划
      if (data.repaymentMethod) {
        caseData.repaymentMethod = data.repaymentMethod as any;
      }
      
      if (data.installments) {
        caseData.installments = data.installments;
      }
      
      this.logger.log(`案件 ${data.caseId} 调解成功，金额：${data.agreementAmount}`);
    } else if (data.result === 'failure') {
      caseData.status = CivilCaseStatus.MEDIATION_FAILURE;
      this.logger.log(`案件 ${data.caseId} 调解失败`);
    }

    caseData.updatedBy = operator;

    return this.caseRepo.save(caseData);
  }

  /**
   * 获取调解统计
   */
  async getMediationStats(
    mediatorName: string,
    startDate: Date,
    endDate: Date,
  ): Promise<{
    totalCases: number;
    successCount: number;
    failureCount: number;
    successRate: number;
    totalAmount: number;
  }> {
    const cases = await this.caseRepo.find({
      where: {
        mediatorName,
        mediationDate: Between(startDate, endDate),
      },
    });

    const successCases = cases.filter(c => 
      c.status === CivilCaseStatus.MEDIATION_SUCCESS
    );
    const failureCases = cases.filter(c => 
      c.status === CivilCaseStatus.MEDIATION_FAILURE
    );

    const totalAmount = successCases.reduce(
      (sum, c) => sum + (c.negotiatedAmount || 0),
      0,
    );

    const totalCases = cases.length;
    const successCount = successCases.length;
    const successRate = totalCases > 0 ? (successCount / totalCases) * 100 : 0;

    return {
      totalCases,
      successCount,
      failureCount: failureCases.length,
      successRate: Math.round(successRate * 100) / 100,
      totalAmount,
    };
  }

  /**
   * 获取待调解案件列表
   */
  async getPendingMediationCases(query: {
    courtId?: string;
    page?: number;
    limit?: number;
  }): Promise<{ list: Case[]; total: number }> {
    const { courtId, page = 1, limit = 20 } = query;

    const where: any = {
      status: CivilCaseStatus.MEDIATION_IN_PROGRESS,
    };

    if (courtId) {
      // 这里假设案件有courtId字段，实际可能需要调整
      // where.courtId = courtId;
    }

    const [list, total] = await this.caseRepo.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { mediationDate: 'ASC' },
    });

    return { list, total };
  }

  /**
   * 分配调解员
   */
  async assignMediator(
    caseId: string,
    mediatorName: string,
    operator: string,
  ): Promise<Case> {
    const caseData = await this.caseRepo.findOne({ where: { id: caseId } });

    if (!caseData) {
      throw new NotFoundException('案件不存在');
    }

    caseData.mediatorName = mediatorName;
    caseData.status = CivilCaseStatus.MEDIATION_IN_PROGRESS;
    caseData.updatedBy = operator;

    this.logger.log(`案件 ${caseId} 分配给调解员 ${mediatorName}`);

    return this.caseRepo.save(caseData);
  }
}
