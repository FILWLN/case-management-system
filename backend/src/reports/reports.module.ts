import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from './reports.controller';
import { ReportService } from './report.service';
import { ReportExportService } from './report-export.service';
import { ChartService } from './chart.service';
import { Case } from '../cases/case.entity';
import { RepaymentInstallment } from '../cases/repayment-installment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Case, RepaymentInstallment]),
  ],
  controllers: [ReportsController],
  providers: [ReportService, ReportExportService, ChartService],
  exports: [ReportService, ReportExportService, ChartService],
})
export class ReportsModule {}
