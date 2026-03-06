import {
  Controller,
  Get,
  Post,
  Query,
  Res,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { ReportService } from './report.service';
import { ReportExportService } from './report-export.service';
import { ChartService } from './chart.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Case } from '../cases/case.entity';
import { RepaymentInstallment } from '../cases/repayment-installment.entity';

@ApiTags('报表管理')
@Controller('reports')
export class ReportsController {
  constructor(
    private readonly reportService: ReportService,
    private readonly exportService: ReportExportService,
    private readonly chartService: ChartService,
    @InjectRepository(Case)
    private caseRepo: Repository<Case>,
    @InjectRepository(RepaymentInstallment)
    private installmentRepo: Repository<RepaymentInstallment>,
  ) {}

  // ========== 周报 ==========

  @Get('weekly')
  @ApiOperation({ summary: '生成周报' })
  async generateWeeklyReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const start = startDate ? new Date(startDate) : this.getWeekStart();
    const end = endDate ? new Date(endDate) : new Date();
    
    const report = await this.reportService.generateWeeklyReport(start, end);
    
    return {
      success: true,
      data: report,
    };
  }

  @Get('weekly/export')
  @ApiOperation({ summary: '导出周报Excel' })
  async exportWeeklyReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Res() res: Response,
  ) {
    const start = startDate ? new Date(startDate) : this.getWeekStart();
    const end = endDate ? new Date(endDate) : new Date();
    
    const report = await this.reportService.generateWeeklyReport(start, end);
    const buffer = this.exportService.exportWeeklyReport(report);
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=周报_${report.period.weekNumber}.xlsx`);
    res.send(buffer);
  }

  @Get('weekly/charts')
  @ApiOperation({ summary: '获取周报图表数据' })
  async getWeeklyCharts(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const start = startDate ? new Date(startDate) : this.getWeekStart();
    const end = endDate ? new Date(endDate) : new Date();
    
    const report = await this.reportService.generateWeeklyReport(start, end);
    const charts = this.chartService.generateAllWeeklyCharts(report);
    
    return {
      success: true,
      data: charts,
    };
  }

  // ========== 月报 ==========

  @Get('monthly')
  @ApiOperation({ summary: '生成月报' })
  async generateMonthlyReport(
    @Query('year') year: number,
    @Query('month') month: number,
  ) {
    const now = new Date();
    const y = year || now.getFullYear();
    const m = month || now.getMonth() + 1;
    
    const report = await this.reportService.generateMonthlyReport(y, m);
    
    return {
      success: true,
      data: report,
    };
  }

  @Get('monthly/export')
  @ApiOperation({ summary: '导出月报Excel' })
  async exportMonthlyReport(
    @Query('year') year: number,
    @Query('month') month: number,
    @Res() res: Response,
  ) {
    const now = new Date();
    const y = year || now.getFullYear();
    const m = month || now.getMonth() + 1;
    
    const report = await this.reportService.generateMonthlyReport(y, m);
    const buffer = this.exportService.exportMonthlyReport(report);
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=月报_${y}年${m}月.xlsx`);
    res.send(buffer);
  }

  @Get('monthly/charts')
  @ApiOperation({ summary: '获取月报图表数据' })
  async getMonthlyCharts(
    @Query('year') year: number,
    @Query('month') month: number,
  ) {
    const now = new Date();
    const y = year || now.getFullYear();
    const m = month || now.getMonth() + 1;
    
    const report = await this.reportService.generateMonthlyReport(y, m);
    const charts = this.chartService.generateAllMonthlyCharts(report);
    
    return {
      success: true,
      data: charts,
    };
  }

  // ========== 数据导出 ==========

  @Post('export/cases')
  @ApiOperation({ summary: '导出案件列表' })
  async exportCases(
    @Body('ids') ids: string[],
    @Res() res: Response,
  ) {
    let cases;
    
    if (ids && ids.length > 0) {
      cases = await this.caseRepo.findByIds(ids);
    } else {
      cases = await this.caseRepo.find();
    }
    
    const buffer = this.exportService.exportCases(cases);
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=案件列表.xlsx');
    res.send(buffer);
  }

  @Post('export/repayments')
  @ApiOperation({ summary: '导出还款记录' })
  async exportRepayments(
    @Body('caseId') caseId: string,
    @Res() res: Response,
  ) {
    let repayments;
    
    if (caseId) {
      repayments = await this.installmentRepo.find({
        where: { caseId },
        relations: ['case'],
      });
    } else {
      repayments = await this.installmentRepo.find({
        relations: ['case'],
      });
    }
    
    const buffer = this.exportService.exportRepayments(repayments);
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=还款记录.xlsx');
    res.send(buffer);
  }

  // ========== 辅助方法 ==========

  private getWeekStart(): Date {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(now.setDate(diff));
  }
}
