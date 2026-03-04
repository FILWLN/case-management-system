import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CasesController } from './cases.controller';
import { CasesService } from './cases.service';
import { Case } from './case.entity';
import { RepaymentInstallment } from './repayment-installment.entity';
import { CaseNote } from './case-note.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Case, RepaymentInstallment, CaseNote])],
  controllers: [CasesController],
  providers: [CasesService],
})
export class CasesModule {}
