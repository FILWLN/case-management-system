import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Case } from './case.entity';

@Entity('case_notes')
export class CaseNote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', comment: '案件ID' })
  @Index()
  caseId: number;

  @Column({ type: 'text', comment: '备注内容' })
  content: string;

  @Column({ type: 'integer', comment: '创建人ID' })
  createdBy: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Case, c => c.notes)
  @JoinColumn({ name: 'case_id' })
  case: Case;
}
