import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediationController } from './mediation.controller';
import { MediationService } from './mediation.service';
import { Case } from '../cases/case.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Case]),
  ],
  controllers: [MediationController],
  providers: [MediationService],
  exports: [MediationService],
})
export class MediationModule {}
