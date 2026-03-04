import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Case } from './case.entity';

@Entity('repayment_plans')
export class RepaymentPlan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', comment: '妗堜欢ID' })
  @Index()
  caseId: number;

  @Column({ type: 'integer', comment: '鎬绘湡鏁? })
  totalPeriods: number;

  @Column({ type: 'integer', comment: '姣忔湀杩樻鏃?1-31)' })
  repaymentDay: number;

  @Column({ length: 50, comment: '杩樻鏂瑰紡' })
  repaymentMethod: string; // equal_interest/ equal_principal / once / custom

  @Column({ type: 'date', comment: '棣栨杩樻鏃? })
  firstDueDate: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2, comment: '鎬诲簲杩橀噾棰? })
  totalAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true, comment: '骞村埄鐜?%)' })
  interestRate: number;

  @Column({ type: 'boolean', default: true, comment: '鏄惁鑷姩鎻愰啋' })
  autoRemind: boolean;

  @Column({ type: 'integer', default: 1, comment: '鎻愬墠鎻愰啋澶╂暟' })
  remindDaysBefore: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Case, c => c.id)
  @JoinColumn({ name: 'case_id' })
  case: Case;
}
