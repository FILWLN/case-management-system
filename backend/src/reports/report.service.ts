import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Case, CaseType, CivilCaseStatus, ExecutionCaseStatus } from '../cases/case.entity';
import { RepaymentInstallment } from '../cases/repayment-installment.entity';

/**
 * 周报数据接口
 */
export interface WeeklyReport {
  period: {
    startDate: Date;
    endDate: Date;
    weekNumber: number;
  };
  
  // 调解统计
  mediation: {
    count: number;              // 调解案件数
    successCount: number;       // 调解成功数
    failureCount: number;       // 调解失败数
    totalAmount: number;        // 调解金额
    averageAmount: number;      // 平均调解金额
  };
  
  // 还款统计
  repayment: {
    count: number;              // 还款笔数
    voluntaryCount: number;     // 主动还款笔数
    courtDeductionCount: number;// 法院划扣笔数
    totalAmount: number;        // 还款总金额
    voluntaryAmount: number;    // 主动还款金额
    courtDeductionAmount: number;// 法院划扣金额
  };
  
  // 案件进展
  cases: {
    newCount: number;           // 新增案件
    closedCount: number;        // 结案数
    statusChanges: Array<{
      status: string;
      count: number;
    }>;
  };
  
  // 详细列表
  details: {
    mediations: any[];
    repayments: any[];
    newCases: any[];
    closedCases: any[];
  };
}

/**
 * 月报数据接口
 */
export interface MonthlyReport {
  period: {
    year: number;
    month: number;
    startDate: Date;
    endDate: Date;
  };
  
  // 汇总数据
  summary: {
    totalCases: number;         // 总案件数
    activeCases: number;        // 在办案件
    closedCases: number;        // 已结案
    totalRepayment: number;     // 总还款金额
    totalMediation: number;     // 总调解金额
  };
  
  // 按状态统计
  byStatus: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
  
  // 按法院统计
  byCourt: Array<{
    courtName: string;
    caseCount: number;
    repaymentAmount: number;
  }>;
  
  // 趋势数据（按日）
  dailyTrend: Array<{
    date: string;
    newCases: number;
    repayments: number;
    repaymentAmount: number;
  }>;
  
  // 催收员业绩
  collectorPerformance: Array<{
    name: string;
    caseCount: number;
    repaymentAmount: number;
    mediationAmount: number;
  }>;
}

@Injectable()
export class ReportService {
  private readonly logger = new Logger(ReportService.name);

  constructor(
    @InjectRepository(Case)
    private caseRepo: Repository<Case>,
    @InjectRepository(RepaymentInstallment)
    private installmentRepo: Repository<RepaymentInstallment>,
  ) {}

  /**
   * 生成周报
   */
  async generateWeeklyReport(startDate: Date, endDate: Date): Promise<WeeklyReport> {
    this.logger.log(`生成周报: ${startDate.toISOString()} - ${endDate.toISOString()}`);

    // 计算周数
    const weekNumber = this.getWeekNumber(startDate);

    // 1. 查询调解数据
    const mediationStats = await this.getMediationStats(startDate, endDate);

    // 2. 查询还款数据
    const repaymentStats = await this.getRepaymentStats(startDate, endDate);

    // 3. 查询案件进展
    const caseStats = await this.getCaseStats(startDate, endDate);

    return {
      period: {
        startDate,
        endDate,
        weekNumber,
      },
      mediation: mediationStats,
      repayment: repaymentStats,
      cases: caseStats,
      details: {
        mediations: [],
        repayments: [],
        newCases: [],
        closedCases: [],
      },
    };
  }

  /**
   * 生成月报
   */
  async generateMonthlyReport(year: number, month: number): Promise<MonthlyReport> {
    this.logger.log(`生成月报: ${year}年${month}月`);

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    // 1. 汇总数据
    const summary = await this.getMonthlySummary(startDate, endDate);

    // 2. 按状态统计
    const byStatus = await this.getStatusDistribution(startDate, endDate);

    // 3. 按法院统计
    const byCourt = await this.getCourtStatistics(startDate, endDate);

    // 4. 趋势数据
    const dailyTrend = await this.getDailyTrend(startDate, endDate);

    // 5. 催收员业绩
    const collectorPerformance = await this.getCollectorPerformance(startDate, endDate);

    return {
      period: {
        year,
        month,
        startDate,
        endDate,
      },
      summary,
      byStatus,
      byCourt,
      dailyTrend,
      collectorPerformance,
    };
  }

  /**
   * 获取调解统计
   */
  private async getMediationStats(startDate: Date, endDate: Date) {
    // 查询调解中的案件
    const mediationCases = await this.caseRepo.find({
      where: {
        status: CivilCaseStatus.MEDIATION_IN_PROGRESS,
        updatedAt: Between(startDate, endDate),
      },
    });

    // 查询调解成功的案件
    const successCases = await this.caseRepo.find({
      where: {
        status: CivilCaseStatus.MEDIATION_SUCCESS,
        updatedAt: Between(startDate, endDate),
      },
    });

    // 查询调解失败的案件
    const failureCases = await this.caseRepo.find({
      where: {
        status: CivilCaseStatus.MEDIATION_FAILURE,
        updatedAt: Between(startDate, endDate),
      },
    });

    const totalAmount = successCases.reduce((sum, c) => sum + (c.negotiatedAmount || 0), 0);
    const count = mediationCases.length + successCases.length + failureCases.length;

    return {
      count,
      successCount: successCases.length,
      failureCount: failureCases.length,
      totalAmount,
      averageAmount: successCases.length > 0 ? totalAmount / successCases.length : 0,
    };
  }

  /**
   * 获取还款统计
   */
  private async getRepaymentStats(startDate: Date, endDate: Date) {
    const repayments = await this.installmentRepo.find({
      where: {
        paidDate: Between(startDate, endDate),
        status: 'paid',
      },
    });

    const voluntaryRepayments = repayments.filter(r => r.repaymentType === 'voluntary');
    const courtDeductions = repayments.filter(r => r.repaymentType === 'court_deduction');

    const totalAmount = repayments.reduce((sum, r) => sum + (r.paidAmount || 0), 0);
    const voluntaryAmount = voluntaryRepayments.reduce((sum, r) => sum + (r.paidAmount || 0), 0);
    const courtDeductionAmount = courtDeductions.reduce((sum, r) => sum + (r.paidAmount || 0), 0);

    return {
      count: repayments.length,
      voluntaryCount: voluntaryRepayments.length,
      courtDeductionCount: courtDeductions.length,
      totalAmount,
      voluntaryAmount,
      courtDeductionAmount,
    };
  }

  /**
   * 获取案件统计
   */
  private async getCaseStats(startDate: Date, endDate: Date) {
    // 新增案件
    const newCases = await this.caseRepo.find({
      where: {
        createdAt: Between(startDate, endDate),
      },
    });

    // 结案
    const closedCases = await this.caseRepo.find({
      where: [
        { status: CivilCaseStatus.CIVIL_CLOSED, updatedAt: Between(startDate, endDate) },
        { status: ExecutionCaseStatus.EXECUTION_CLOSED, updatedAt: Between(startDate, endDate) },
      ],
    });

    // 状态变更统计
    const statusChanges = await this.getStatusChanges(startDate, endDate);

    return {
      newCount: newCases.length,
      closedCount: closedCases.length,
      statusChanges,
    };
  }

  /**
   * 获取状态变更统计
   */
  private async getStatusChanges(startDate: Date, endDate: Date) {
    // 这里简化处理，实际应该查询状态历史表
    return [];
  }

  /**
   * 获取月度汇总
   */
  private async getMonthlySummary(startDate: Date, endDate: Date) {
    const totalCases = await this.caseRepo.count();
    
    const activeCases = await this.caseRepo.count({
      where: {
        status: Between(CivilCaseStatus.FILING_SUBMITTED, CivilCaseStatus.CIVIL_CLOSED),
      },
    });

    const closedCases = await this.caseRepo.count({
      where: [
        { status: CivilCaseStatus.CIVIL_CLOSED },
        { status: ExecutionCaseStatus.EXECUTION_CLOSED },
      ],
    });

    const repayments = await this.installmentRepo.find({
      where: {
        paidDate: Between(startDate, endDate),
        status: 'paid',
      },
    });
    const totalRepayment = repayments.reduce((sum, r) => sum + (r.paidAmount || 0), 0);

    const mediationCases = await this.caseRepo.find({
      where: {
        status: CivilCaseStatus.MEDIATION_SUCCESS,
        updatedAt: Between(startDate, endDate),
      },
    });
    const totalMediation = mediationCases.reduce((sum, c) => sum + (c.negotiatedAmount || 0), 0);

    return {
      totalCases,
      activeCases,
      closedCases,
      totalRepayment,
      totalMediation,
    };
  }

  /**
   * 获取状态分布
   */
  private async getStatusDistribution(startDate: Date, endDate: Date) {
    // 按状态分组统计
    const statuses = Object.values(CivilCaseStatus);
    const result = [];

    for (const status of statuses) {
      const count = await this.caseRepo.count({
        where: { status },
      });
      
      if (count > 0) {
        result.push({
          status,
          count,
          percentage: 0, // 稍后计算
        });
      }
    }

    // 计算百分比
    const total = result.reduce((sum, r) => sum + r.count, 0);
    result.forEach(r => {
      r.percentage = total > 0 ? Math.round((r.count / total) * 100) : 0;
    });

    return result;
  }

  /**
   * 获取法院统计
   */
  private async getCourtStatistics(startDate: Date, endDate: Date) {
    const cases = await this.caseRepo.find({
      where: {
        createdAt: Between(startDate, endDate),
      },
      select: ['courtName', 'amountInfo'],
    });

    const courtMap = new Map<string, { caseCount: number; repaymentAmount: number }>();

    cases.forEach(c => {
      const courtName = c.courtName || '未知法院';
      const existing = courtMap.get(courtName) || { caseCount: 0, repaymentAmount: 0 };
      existing.caseCount++;
      existing.repaymentAmount += c.amountInfo?.paidTotal || 0;
      courtMap.set(courtName, existing);
    });

    return Array.from(courtMap.entries()).map(([courtName, stats]) => ({
      courtName,
      ...stats,
    }));
  }

  /**
   * 获取每日趋势
   */
  private async getDailyTrend(startDate: Date, endDate: Date) {
    const days = [];
    const current = new Date(startDate);

    while (current <= endDate) {
      const dateStr = current.toISOString().split('T')[0];
      
      // 新增案件
      const newCases = await this.caseRepo.count({
        where: {
          createdAt: Between(
            new Date(current.setHours(0, 0, 0, 0)),
            new Date(current.setHours(23, 59, 59, 999)),
          ),
        },
      });

      // 还款
      const repayments = await this.installmentRepo.find({
        where: {
          paidDate: Between(
            new Date(current.setHours(0, 0, 0, 0)),
            new Date(current.setHours(23, 59, 59, 999)),
          ),
          status: 'paid',
        },
      });

      days.push({
        date: dateStr,
        newCases,
        repayments: repayments.length,
        repaymentAmount: repayments.reduce((sum, r) => sum + (r.paidAmount || 0), 0),
      });

      current.setDate(current.getDate() + 1);
    }

    return days;
  }

  /**
   * 获取催收员业绩
   */
  private async getCollectorPerformance(startDate: Date, endDate: Date) {
    const cases = await this.caseRepo.find({
      where: {
        createdAt: Between(startDate, endDate),
      },
      select: ['collector', 'amountInfo', 'negotiatedAmount'],
    });

    const collectorMap = new Map<string, {
      caseCount: number;
      repaymentAmount: number;
      mediationAmount: number;
    }>();

    cases.forEach(c => {
      const collector = c.collector || '未知';
      const existing = collectorMap.get(collector) || {
        caseCount: 0,
        repaymentAmount: 0,
        mediationAmount: 0,
      };
      existing.caseCount++;
      existing.repaymentAmount += c.amountInfo?.paidTotal || 0;
      existing.mediationAmount += c.negotiatedAmount || 0;
      collectorMap.set(collector, existing);
    });

    return Array.from(collectorMap.entries())
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.repaymentAmount - a.repaymentAmount);
  }

  /**
   * 获取周数
   */
  private getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  }
}
