import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { WeeklyReport, MonthlyReport } from './report.service';

@Injectable()
export class ReportExportService {
  /**
   * 导出周报为Excel
   */
  exportWeeklyReport(report: WeeklyReport): Buffer {
    const workbook = XLSX.utils.book_new();

    // 1. 汇总 sheet
    const summaryData = [
      { 项目: '报告周期', 值: `${report.period.startDate.toISOString().split('T')[0]} 至 ${report.period.endDate.toISOString().split('T')[0]}` },
      { 项目: '周数', 值: `第${report.period.weekNumber}周` },
      { 项目: '', 值: '' },
      { 项目: '=== 调解统计 ===', 值: '' },
      { 项目: '调解案件数', 值: report.mediation.count },
      { 项目: '调解成功数', 值: report.mediation.successCount },
      { 项目: '调解失败数', 值: report.mediation.failureCount },
      { 项目: '调解金额', 值: report.mediation.totalAmount },
      { 项目: '平均调解金额', 值: report.mediation.averageAmount.toFixed(2) },
      { 项目: '', 值: '' },
      { 项目: '=== 还款统计 ===', 值: '' },
      { 项目: '还款笔数', 值: report.repayment.count },
      { 项目: '主动还款笔数', 值: report.repayment.voluntaryCount },
      { 项目: '法院划扣笔数', 值: report.repayment.courtDeductionCount },
      { 项目: '还款总金额', 值: report.repayment.totalAmount },
      { 项目: '主动还款金额', 值: report.repayment.voluntaryAmount },
      { 项目: '法院划扣金额', 值: report.repayment.courtDeductionAmount },
      { 项目: '', 值: '' },
      { 项目: '=== 案件进展 ===', 值: '' },
      { 项目: '新增案件', 值: report.cases.newCount },
      { 项目: '结案数', 值: report.cases.closedCount },
    ];

    const summarySheet = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, '汇总');

    // 2. 状态变更 sheet
    if (report.cases.statusChanges.length > 0) {
      const statusSheet = XLSX.utils.json_to_sheet(report.cases.statusChanges);
      XLSX.utils.book_append_sheet(workbook, statusSheet, '状态变更');
    }

    return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  }

  /**
   * 导出月报为Excel
   */
  exportMonthlyReport(report: MonthlyReport): Buffer {
    const workbook = XLSX.utils.book_new();

    // 1. 汇总 sheet
    const summaryData = [
      { 项目: '报告月份', 值: `${report.period.year}年${report.period.month}月` },
      { 项目: '统计周期', 值: `${report.period.startDate.toISOString().split('T')[0]} 至 ${report.period.endDate.toISOString().split('T')[0]}` },
      { 项目: '', 值: '' },
      { 项目: '=== 案件汇总 ===', 值: '' },
      { 项目: '总案件数', 值: report.summary.totalCases },
      { 项目: '在办案件', 值: report.summary.activeCases },
      { 项目: '已结案', 值: report.summary.closedCases },
      { 项目: '总还款金额', 值: report.summary.totalRepayment },
      { 项目: '总调解金额', 值: report.summary.totalMediation },
    ];

    const summarySheet = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, '汇总');

    // 2. 状态分布 sheet
    const statusData = report.byStatus.map(s => ({
      状态: s.status,
      数量: s.count,
      占比: `${s.percentage}%`,
    }));
    const statusSheet = XLSX.utils.json_to_sheet(statusData);
    XLSX.utils.book_append_sheet(workbook, statusSheet, '状态分布');

    // 3. 法院统计 sheet
    const courtData = report.byCourt.map(c => ({
      法院: c.courtName,
      案件数: c.caseCount,
      还款金额: c.repaymentAmount,
    }));
    const courtSheet = XLSX.utils.json_to_sheet(courtData);
    XLSX.utils.book_append_sheet(workbook, courtSheet, '法院统计');

    // 4. 每日趋势 sheet
    const trendData = report.dailyTrend.map(d => ({
      日期: d.date,
      新增案件: d.newCases,
      还款笔数: d.repayments,
      还款金额: d.repaymentAmount,
    }));
    const trendSheet = XLSX.utils.json_to_sheet(trendData);
    XLSX.utils.book_append_sheet(workbook, trendSheet, '每日趋势');

    // 5. 催收员业绩 sheet
    const collectorData = report.collectorPerformance.map(c => ({
      催收员: c.name,
      案件数: c.caseCount,
      还款金额: c.repaymentAmount,
      调解金额: c.mediationAmount,
    }));
    const collectorSheet = XLSX.utils.json_to_sheet(collectorData);
    XLSX.utils.book_append_sheet(workbook, collectorSheet, '催收员业绩');

    return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  }

  /**
   * 导出案件列表为Excel
   */
  exportCases(cases: any[]): Buffer {
    const data = cases.map(c => ({
      '京东PIN': c.pinCode,
      '客户姓名': c.customerName,
      '身份证号': c.customerIdcard,
      '电话': c.customerPhone,
      '案件类型': c.caseType,
      '案件状态': c.status,
      '法院': c.courtName,
      '借款本金': c.loanPrincipal,
      '诉讼标的': c.amountInfo?.originalClaim,
      '已还金额': c.amountInfo?.paidTotal,
      '剩余金额': c.amountInfo?.remainingClaim,
      '创建时间': c.createdAt,
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, '案件列表');

    return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  }

  /**
   * 导出还款记录为Excel
   */
  exportRepayments(repayments: any[]): Buffer {
    const data = repayments.map(r => ({
      '客户ID': r.case?.customerId,
      '客户姓名': r.case?.customerName,
      '期数': r.period,
      '应还日期': r.dueDate,
      '本金': r.principal,
      '利息': r.interest,
      '合计': r.total,
      '实际还款日期': r.paidDate,
      '实际还款金额': r.paidAmount,
      '还款方式': r.repaymentMethod,
      '还款类型': r.repaymentType === 'court_deduction' ? '法院划扣' : '主动还款',
      '状态': r.status,
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, '还款记录');

    return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  }
}
