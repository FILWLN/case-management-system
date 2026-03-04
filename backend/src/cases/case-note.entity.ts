import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Case } from './case.entity';

@Entity('case_notes')
export class CaseNote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', comment: '妗堜欢ID' })
  @Index()
  caseId: number;

  @Column({ type: 'text', comment: '澶囨敞鍐呭' })
  content: string;

  @Column({ type: 'integer', comment: '鍒涘缓浜篒D' })
  createdBy: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Case, c => c.notes)
  @JoinColumn({ name: 'case_id' })
  case: Case;
}
