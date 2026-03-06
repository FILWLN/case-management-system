import { Injectable } from '@nestjs/common';
import { WeeklyReport, MonthlyReport } from './report.service';

/**
 * 图表数据格式
 */
export interface ChartData {
  type: 'pie' | 'bar' | 'line' | 'doughnut';
  title: string;
  labels: string[];
  datasets: Array<{
    label?: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string[];
  }>;
}

@Injectable()
export class ChartService {
  /**
   * 生成案件状态分布饼图数据
   */
  generateStatusPieChart(report: MonthlyReport): ChartData {
    const colors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
      '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF',
    ];

    return {
      type: 'pie',
      title: '案件状态分布',
      labels: report.byStatus.map(s => s.status),
      datasets: [{
        data: report.byStatus.map(s => s.count),
        backgroundColor: colors.slice(0, report.byStatus.length),
      }],
    };
  }

  /**
   * 生成法院案件数量柱状图数据
   */
  generateCourtBarChart(report: MonthlyReport): ChartData {
    return {
      type: 'bar',
      title: '各法院案件数量',
      labels: report.byCourt.map(c => c.courtName),
      datasets: [{
        label: '案件数',
        data: report.byCourt.map(c => c.caseCount),
        backgroundColor: ['#36A2EB'],
      }],
    };
  }

  /**
   * 生成还款趋势折线图数据
   */
  generateRepaymentTrendChart(report: MonthlyReport): ChartData {
    return {
      type: 'line',
      title: '每日还款趋势',
      labels: report.dailyTrend.map(d => d.date.slice(5)), // 显示 MM-DD
      datasets: [
        {
          label: '还款笔数',
          data: report.dailyTrend.map(d => d.repayments),
          borderColor: ['#36A2EB'],
        },
        {
          label: '还款金额',
          data: report.dailyTrend.map(d => d.repaymentAmount),
          borderColor: ['#FF6384'],
        },
      ],
    };
  }

  /**
   * 生成催收员业绩柱状图数据
   */
  generateCollectorPerformanceChart(report: MonthlyReport): ChartData {
    return {
      type: 'bar',
      title: '催收员业绩排名',
      labels: report.collectorPerformance.map(c => c.name),
      datasets: [
        {
          label: '还款金额',
          data: report.collectorPerformance.map(c => c.repaymentAmount),
          backgroundColor: ['#4BC0C0'],
        },
        {
          label: '调解金额',
          data: report.collectorPerformance.map(c => c.mediationAmount),
          backgroundColor: ['#FFCE56'],
        },
      ],
    };
  }

  /**
   * 生成还款类型分布环形图数据
   */
  generateRepaymentTypeDoughnut(report: WeeklyReport): ChartData {
    return {
      type: 'doughnut',
      title: '还款类型分布',
      labels: ['主动还款', '法院划扣'],
      datasets: [{
        data: [
          report.repayment.voluntaryAmount,
          report.repayment.courtDeductionAmount,
        ],
        backgroundColor: ['#36A2EB', '#FF6384'],
      }],
    };
  }

  /**
   * 生成调解结果饼图数据
   */
  generateMediationResultPie(report: WeeklyReport): ChartData {
    return {
      type: 'pie',
      title: '调解结果分布',
      labels: ['调解成功', '调解失败'],
      datasets: [{
        data: [
          report.mediation.successCount,
          report.mediation.failureCount,
        ],
        backgroundColor: ['#4BC0C0', '#FF6384'],
      }],
    };
  }

  /**
   * 生成所有图表数据（月报）
   */
  generateAllMonthlyCharts(report: MonthlyReport): ChartData[] {
    return [
      this.generateStatusPieChart(report),
      this.generateCourtBarChart(report),
      this.generateRepaymentTrendChart(report),
      this.generateCollectorPerformanceChart(report),
    ];
  }

  /**
   * 生成所有图表数据（周报）
   */
  generateAllWeeklyCharts(report: WeeklyReport): ChartData[] {
    return [
      this.generateRepaymentTypeDoughnut(report),
      this.generateMediationResultPie(report),
    ];
  }
}
