import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Case } from './case.entity';

@Entity('repayment_plans')
export class RepaymentPlan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', comment: '案件ID' })
  @Index()
  caseId: number;

  @Column({ type: 'integer', comment: '总期数' })
  totalPeriods: number;

  @Column({ type: 'integer', comment: '每月还款日(1-31)' })
  repaymentDay: number;

  @Column({ length: 50, comment: '还款方式' })
  repaymentMethod: string; // equal_interest/ equal_principal / once / custom

  @Column({ type: 'date', comment: '首次还款日' })
  firstDueDate: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2, comment: '总应还金额' })
  totalAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true, comment: '年利率(%)' })
  interestRate: number;

  @Column({ type: 'boolean', default: true, comment: '是否自动提醒' })
  autoRemind: boolean;

  @Column({ type: 'integer', default: 1, comment: '提前提醒天数' })
  remindDaysBefore: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Case, c => c.id)
  @JoinColumn({ name: 'case_id' })
  case: Case;
}
