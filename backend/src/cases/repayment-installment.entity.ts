import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Case } from './case.entity';

export enum InstallmentStatus {
  PENDING = 'pending',  // 待还款
  PAID = 'paid',        // 已还款
  OVERDUE = 'overdue',  // 已逾期
}

@Entity('repayment_installments')
export class RepaymentInstallment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', comment: '案件ID' })
  @Index()
  caseId: number;

  @Column({ type: 'integer', comment: '期数' })
  installmentNo: number;

  @Column({ type: 'date', comment: '应支付日期' })
  dueDate: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2, comment: '应支付金额' })
  dueAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0, comment: '实付款' })
  paidAmount: number;

  @Column({ length: 20, default: 'pending', comment: '状态' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Case, c => c.installments)
  @JoinColumn({ name: 'case_id' })
  case: Case;
}
