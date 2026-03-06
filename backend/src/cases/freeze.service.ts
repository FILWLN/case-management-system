import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Case, FreezeStatus, CivilCaseStatus } from './case.entity';

/**
 * 冻结管理服务
 * 管理案件冻结状态（正常冻结、无需冻结）
 */
@Injectable()
export class FreezeService {
  private readonly logger = new Logger(FreezeService.name);

  constructor(
    @InjectRepository(Case)
    private caseRepo: Repository<Case>,
  ) {}

  /**
   * 标记案件为无需冻结
   * 
   * 场景：
   * - 已生成民初号，未生成执保号
   * - 有调解时间和案件撤回日期
   * - 标记为【已协商无需冻结】
   */
  async markNoFreeze(
    caseId: string,
    reason: string,
    operator: string,
  ): Promise<Case> {
    const caseData = await this.caseRepo.findOne({ where: { id: caseId } });

    if (!caseData) {
      throw new Error('案件不存在');
    }

    // 更新冻结状态
    caseData.freezeStatus = FreezeStatus.NO_FREEZE;
    caseData.noFreezeReason = reason;
    caseData.updatedBy = operator;

    this.logger.log(`案件 ${caseId} 标记为无需冻结，原因：${reason}`);

    return this.caseRepo.save(caseData);
  }

  /**
   * 标记案件为已冻结
   */
  async markFrozen(
    caseId: string,
    freezeAmount: number,
    freezeDate: Date,
    operator: string,
  ): Promise<Case> {
    const caseData = await this.caseRepo.findOne({ where: { id: caseId } });

    if (!caseData) {
      throw new Error('案件不存在');
    }

    // 更新冻结信息
    caseData.freezeStatus = FreezeStatus.FROZEN;
    caseData.freezeAmount = freezeAmount;
    caseData.freezeDate = freezeDate;
    caseData.noFreezeReason = null; // 清除无需冻结原因
    caseData.updatedBy = operator;

    this.logger.log(`案件 ${caseId} 标记为已冻结，金额：${freezeAmount}`);

    return this.caseRepo.save(caseData);
  }

  /**
   * 更新实际冻结金额
   */
  async updateActualFreezeAmount(
    caseId: string,
    actualAmount: number,
    operator: string,
  ): Promise<Case> {
    const caseData = await this.caseRepo.findOne({ where: { id: caseId } });

    if (!caseData) {
      throw new Error('案件不存在');
    }

    caseData.actualFreezeAmount = actualAmount;
    caseData.updatedBy = operator;

    this.logger.log(`案件 ${caseId} 实际冻结金额更新为：${actualAmount}`);

    return this.caseRepo.save(caseData);
  }

  /**
   * 解冻案件
   */
  async unfreeze(
    caseId: string,
    unfreezeDate: Date,
    operator: string,
  ): Promise<Case> {
    const caseData = await this.caseRepo.findOne({ where: { id: caseId } });

    if (!caseData) {
      throw new Error('案件不存在');
    }

    caseData.freezeStatus = FreezeStatus.NORMAL;
    caseData.unfreezeDate = unfreezeDate;
    caseData.updatedBy = operator;

    this.logger.log(`案件 ${caseId} 已解冻`);

    return this.caseRepo.save(caseData);
  }

  /**
   * 获取无需冻结的案件列表
   */
  async getNoFreezeCases(): Promise<Case[]> {
    return this.caseRepo.find({
      where: { freezeStatus: FreezeStatus.NO_FREEZE },
      order: { updatedAt: 'DESC' },
    });
  }

  /**
   * 获取已冻结的案件列表
   */
  async getFrozenCases(): Promise<Case[]> {
    return this.caseRepo.find({
      where: { freezeStatus: FreezeStatus.FROZEN },
      order: { freezeDate: 'DESC' },
    });
  }

  /**
   * 检查案件是否需要冻结
   * 
   * 规则：
   * - 如果已生成民初号，未生成执保号
   * - 如果有调解时间和案件撤回日期
   * - 则标记为无需冻结
   */
  async checkFreezeRequirement(caseId: string): Promise<{
    needFreeze: boolean;
    reason?: string;
  }> {
    const caseData = await this.caseRepo.findOne({ where: { id: caseId } });

    if (!caseData) {
      throw new Error('案件不存在');
    }

    // 检查是否已生成民初号
    const hasCivilCaseNo = !!caseData.civilCaseNo;
    
    // 检查是否未生成执保号
    const noPreservationCaseNo = !caseData.preservationCaseNo;
    
    // 检查是否有调解时间
    const hasMediationDate = !!caseData.mediationDate;
    
    // 检查是否有案件撤回日期
    const hasWithdrawalDate = caseData.status === CivilCaseStatus.CASE_WITHDRAWN;

    if (hasCivilCaseNo && noPreservationCaseNo && (hasMediationDate || hasWithdrawalDate)) {
      return {
        needFreeze: false,
        reason: '已协商无需冻结',
      };
    }

    return {
      needFreeze: true,
    };
  }

  /**
   * 批量标记无需冻结
   */
  async batchMarkNoFreeze(
    caseIds: string[],
    reason: string,
    operator: string,
  ): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    for (const caseId of caseIds) {
      try {
        await this.markNoFreeze(caseId, reason, operator);
        success++;
      } catch (error) {
        this.logger.error(`标记案件 ${caseId} 无需冻结失败`, error);
        failed++;
      }
    }

    return { success, failed };
  }
}
