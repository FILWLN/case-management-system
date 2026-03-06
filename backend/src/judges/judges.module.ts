import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Court } from './court.entity';
import { Judge } from './judge.entity';
import { CourtsService } from './courts.service';
import { JudgesService } from './judges.service';
import { CourtsController } from './courts.controller';
import { JudgesController } from './judges.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Court, Judge]),
  ],
  controllers: [CourtsController, JudgesController],
  providers: [CourtsService, JudgesService],
  exports: [CourtsService, JudgesService],
})
export class JudgesModule {}
