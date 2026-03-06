import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Case } from '../cases/case.entity';
import { RepaymentInstallment } from '../cases/repayment-installment.entity';
import { RepaymentImportService } from './repayment-import.service';
import { CaseImportService } from './case-import.service';
import { ImportController } from './import.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Case, RepaymentInstallment]),
  ],
  controllers: [ImportController],
  providers: [RepaymentImportService, CaseImportService],
  exports: [RepaymentImportService, CaseImportService],
})
export class ImportModule {}
