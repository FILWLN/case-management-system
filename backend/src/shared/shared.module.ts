import { Module } from '@nestjs/common';
import { RepaymentPlanGeneratorService } from './services/repayment-plan-generator.service';
import { OcrService } from './services/ocr.service';

@Module({
  providers: [RepaymentPlanGeneratorService, OcrService],
  exports: [RepaymentPlanGeneratorService, OcrService],
})
export class SharedModule {}
