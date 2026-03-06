import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Case, CivilCaseStatus, ExecutionCaseStatus, CaseType } from './case.entity';
import { CaseStatusHistory, StatusChangeAction } from './case-status-history.entity';

// 状态流转图配置
const STATUS_TRANSITIONS: Record<string, string[]> = {
  // 民初案件状态流转
  [CivilCaseStatus.FILING_SUBMITTED]: [
    CivilCaseStatus.FILING_FEEDBACK,
    CivilCaseStatus.FILING_REJECTED,
    CivilCaseStatus.FILING_ACCEPTED,
    CivilCaseStatus.PENDING_MATERIALS,
  ],
  [CivilCaseStatus.FILING_REJECTED]: [
    CivilCaseStatus.FILING_SUBMITTED, // 重新提交
  ],
  [CivilCaseStatus.PENDING_MATERIALS]: [
    CivilCaseStatus.MATERIALS_TO_MAIL,
    CivilCaseStatus.MATERIALS_TO_UPLOAD,
  ],
  [CivilCaseStatus.MATERIALS_TO_MAIL]: [
    CivilCaseStatus.MATERIALS_MAILED,
  ],
  [CivilCaseStatus.MATERIALS_TO_UPLOAD]: [
    CivilCaseStatus.MATERIALS_UPLOADED,
  ],
  [CivilCaseStatus.MATERIALS_MAILED]: [
    CivilCaseStatus.MATERIALS_RECEIVED,
    CivilCaseStatus.MATERIALS_NOT_RECEIVED,
  ],
  [CivilCaseStatus.MATERIALS_UPLOADED]: [
    CivilCaseStatus.MATERIALS_RECEIVED,
    CivilCaseStatus.MATERIALS_NOT_RECEIVED,
  ],
  [CivilCaseStatus.FILING_ACCEPTED]: [
    CivilCaseStatus.PAYMENT_NOTICE,
  ],
  [CivilCaseStatus.PAYMENT_NOTICE]: [
    CivilCaseStatus.AWAITING_SUMMONS,
  ],
  [CivilCaseStatus.AWAITING_SUMMONS]: [
    CivilCaseStatus.SUMMONS_RECEIVED,
    CivilCaseStatus.MEDIATION_IN_PROGRESS,
  ],
  [CivilCaseStatus.SUMMONS_RECEIVED]: [
    CivilCaseStatus.TRIAL_INFO,
    CivilCaseStatus.MEDIATION_IN_PROGRESS,
  ],
  [CivilCaseStatus.MEDIATION_IN_PROGRESS]: [
    CivilCaseStatus.MEDIATION_SUCCESS,
    CivilCaseStatus.MEDIATION_FAILURE,
  ],
  [CivilCaseStatus.MEDIATION_SUCCESS]: [
    CivilCaseStatus.CIVIL_CLOSED,
  ],
  [CivilCaseStatus.MEDIATION_FAILURE]: [
    CivilCaseStatus.TRIAL_INFO,
  ],
  [CivilCaseStatus.TRIAL_INFO]: [
    CivilCaseStatus.AWAITING_TRIAL,
  ],
  [CivilCaseStatus.AWAITING_TRIAL]: [
    CivilCaseStatus.CIVIL_CLOSED,
  ],
  [CivilCaseStatus.CIVIL_CLOSED]: [
    ExecutionCaseStatus.FILING_SUBMITTED, // 转执行
  ],

  // 执行案件状态流转
  [ExecutionCaseStatus.FILING_SUBMITTED]: [
    ExecutionCaseStatus.FILING_ACCEPTED,
    ExecutionCaseStatus.FILING_FAILURE,
  ],
  [ExecutionCaseStatus.FILING_ACCEPTED]: [
    ExecutionCaseStatus.FILING_SUCCESS,
    ExecutionCaseStatus.COMMUNICATION_DONE,
  ],
  [ExecutionCaseStatus.FILING_SUCCESS]: [
    ExecutionCaseStatus.REPAYMENT_FOLLOWUP,
  ],
  [ExecutionCaseStatus.REPAYMENT_FOLLOWUP]: [
    ExecutionCaseStatus.REPAYMENT_OVERDUE,
    ExecutionCaseStatus.REPAYMENT_ON_TIME,
    ExecutionCaseStatus.FULL_DEDUCTION,
    ExecutionCaseStatus.PARTIAL_DEDUCTION,
    ExecutionCaseStatus.SETTLEMENT_REACHED,
  ],
  [ExecutionCaseStatus.FULL_DEDUCTION]: [
    ExecutionCaseStatus.EXECUTION_CLOSED,
  ],
  [ExecutionCaseStatus.SETTLEMENT_REACHED]: [
    ExecutionCaseStatus.EXECUTION_CLOSED,
  ],
  [ExecutionCaseStatus.EXECUTION_COMPLETED]: [
    ExecutionCaseStatus.EXECUTION_CLOSED,
  ],
  [ExecutionCaseStatus.NO_PROPERTY]: [
    ExecutionCaseStatus.TERMINATION_RULING,
  ],
  [ExecutionCaseStatus.TERMINATION_RULING]: [
    ExecutionCaseStatus.EXECUTION_CLOSED,
    ExecutionCaseStatus.FILING_SUBMITTED, // 执恢
  ],
};

@Injectable()
export class StateMachineService {
  private readonly logger = new Logger(StateMachineService.name);

  constructor(
    @InjectRepository(CaseStatusHistory)
    private historyRepo: Repository<CaseStatusHistory>,
  ) {}

  /**
   * 检查状态是否可以流转
   */
  canTransition(fromStatus: string, toStatus: string): boolean {
    const allowedTransitions = STATUS_TRANSITIONS[fromStatus] || [];
    return allowedTransitions.includes(toStatus);
  }

  /**
   * 获取允许流转的目标状态列表
   */
  getAllowedTransitions(currentStatus: string, caseType: CaseType): string[] {
    const transitions = STATUS_TRANSITIONS[currentStatus] || [];
    
    // 根据案件类型过滤
    return transitions.filter(status => {
      if (caseType === CaseType.CIVIL) {
        return Object.values(CivilCaseStatus).includes(status as CivilCaseStatus);
      }
      if (caseType === CaseType.EXECUTION) {
        return Object.values(ExecutionCaseStatus).includes(status as ExecutionCaseStatus);
      }
      return true;
    });
  }

  /**
   * 执行状态流转
   */
  async transition(
    caseData: Case,
    toStatus: string,
    operator: string,
    operatorRole: string,
    options?: {
      action?: StatusChangeAction;
      remark?: string;
      skipValidation?: boolean;
    },
  ): Promise<{
    success: boolean;
    message: string;
    history?: CaseStatusHistory;
  }> {
    const { action = StatusChangeAction.NORMAL, remark, skipValidation = false } = options || {};

    // 检查是否可以流转
    if (!skipValidation && !this.canTransition(caseData.status, toStatus)) {
      return {
        success: false,
        message: `不能从状态 "${caseData.status}" 流转到 "${toStatus}"`,
      };
    }

    // 保存变更前快照
    const beforeSnapshot = {
      status: caseData.status,
      amountInfo: caseData.amountInfo,
      freezeStatus: caseData.freezeStatus,
    };

    // 更新案件状态
    const fromStatus = caseData.status;
    caseData.status = toStatus;

    // 更新状态历史
    if (!caseData.statusHistory) {
      caseData.statusHistory = [];
    }
    caseData.statusHistory.push({
      status: toStatus,
      changedAt: new Date(),
      changedBy: operator,
      remark: remark || '',
    });

    // 创建历史记录
    const history = this.historyRepo.create({
      caseId: caseData.id,
      pinCode: caseData.pinCode,
      fromStatus,
      toStatus,
      action,
      operator,
      operatorRole,
      remark,
      beforeSnapshot,
      afterSnapshot: {
        status: toStatus,
        amountInfo: caseData.amountInfo,
        freezeStatus: caseData.freezeStatus,
      },
    });

    await this.historyRepo.save(history);

    this.logger.log(
      `案件 ${caseData.pinCode} 状态变更: ${fromStatus} -> ${toStatus}, 操作人: ${operator}`,
    );

    return {
      success: true,
      message: '状态变更成功',
      history,
    };
  }

  /**
   * 获取案件状态历史
   */
  async getStatusHistory(caseId: string): Promise<CaseStatusHistory[]> {
    return this.historyRepo.find({
      where: { caseId },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * 获取案件状态历史（按PIN码）
   */
  async getStatusHistoryByPin(pinCode: string): Promise<CaseStatusHistory[]> {
    return this.historyRepo.find({
      where: { pinCode },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * 检查用户是否有权限执行状态变更
   */
  hasPermission(
    operatorRole: string,
    action: StatusChangeAction,
  ): boolean {
    const permissions: Record<string, StatusChangeAction[]> = {
      admin: [StatusChangeAction.NORMAL, StatusChangeAction.SKIP, StatusChangeAction.ROLLBACK, StatusChangeAction.MANUAL],
      manager: [StatusChangeAction.NORMAL, StatusChangeAction.SKIP, StatusChangeAction.MANUAL],
      operator: [StatusChangeAction.NORMAL],
      mediator: [StatusChangeAction.NORMAL], // 调解员只能正常流转
    };

    const allowedActions = permissions[operatorRole] || [];
    return allowedActions.includes(action);
  }
}
