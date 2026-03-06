import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Case } from '../cases/case.entity';
import { RepaymentInstallment } from '../cases/repayment-installment.entity';
import { RepaymentImportService } from './repayment-import.service';
import { CaseImportService } from './case-import.service';
import { DataCleaningService } from './data-cleaning.service';
import { ImportController } from './import.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Case, RepaymentInstallment]),
  ],
  controllers: [ImportController],
  providers: [RepaymentImportService, CaseImportService, DataCleaningService],
  exports: [RepaymentImportService, CaseImportService, DataCleaningService],
})
export class ImportModule {}
