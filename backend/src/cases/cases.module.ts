import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CasesController } from './cases.controller';
import { CasesService } from './cases.service';
import { CaseJudgeService } from './case-judge.service';
import { FreezeService } from './freeze.service';
import { RecoveryHistoryService } from './recovery-history.service';
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
  providers: [CasesService, CaseJudgeService, FreezeService, RecoveryHistoryService],
  exports: [CasesService, CaseJudgeService, FreezeService, RecoveryHistoryService],
})
export class CasesModule {}
