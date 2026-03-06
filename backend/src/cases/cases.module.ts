import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CasesController } from './cases.controller';
import { CasesService } from './cases.service';
import { CaseJudgeService } from './case-judge.service';
import { Case } from './case.entity';
import { RepaymentInstallment } from './repayment-installment.entity';
import { CaseNote } from './case-note.entity';
import { JudgesModule } from '../judges/judges.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Case, RepaymentInstallment, CaseNote]),
    JudgesModule,
  ],
  controllers: [CasesController],
  providers: [CasesService, CaseJudgeService],
  exports: [CasesService, CaseJudgeService],
})
export class CasesModule {}
