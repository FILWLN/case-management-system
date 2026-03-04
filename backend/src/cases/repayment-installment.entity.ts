import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Case } from './case.entity';

export enum InstallmentStatus {
  PENDING = 'pending',  // 寰呰繕娆?  PAID = 'paid',        // 宸茶繕娆?  OVERDUE = 'overdue',  // 宸查€炬湡
}

@Entity('repayment_installments')
export class RepaymentInstallment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', comment: '妗堜欢ID' })
  @Index()
  caseId: number;

  @Column({ type: 'integer', comment: '鏈熸暟' })
  installmentNo: number;

  @Column({ type: 'date', comment: '搴旀敮浠樻棩鏈? })
  dueDate: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2, comment: '搴旀敮浠橀噾棰? })
  dueAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0, comment: '瀹炰粯娆? })
  paidAmount: number;

  @Column({ length: 20, default: 'pending', comment: '鐘舵€? })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Case, c => c.installments)
  @JoinColumn({ name: 'case_id' })
  case: Case;
}
