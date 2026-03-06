import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepaymentPlanGeneratorService } from './services/repayment-plan-generator.service';
import { OcrService } from './services/ocr.service';
import { RepaymentInstallment } from '../cases/repayment-installment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RepaymentInstallment])],
  providers: [RepaymentPlanGeneratorService, OcrService],
  exports: [RepaymentPlanGeneratorService, OcrService],
})
export class SharedModule {}
