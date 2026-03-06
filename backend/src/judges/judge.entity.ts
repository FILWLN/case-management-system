import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Court } from './court.entity';

/**
 * 法官角色枚举
 */
export enum JudgeRole {
  PRIMARY = 'primary',       // 承办法官（必填）
  ASSISTANT = 'assistant',   // 法官助理（选填）
  CLERK = 'clerk',           // 书记员（必填）
}

/**
 * 法官实体
 * 管理法官信息
 */
@Entity('judges')
export class Judge {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, comment: '姓名' })
  @Index()
  name: string;

  @Column({ 
    type: 'enum', 
    enum: JudgeRole, 
    default: JudgeRole.PRIMARY,
    comment: '角色' 
  })
  role: JudgeRole;

  @Column({ length: 50, nullable: true, comment: '职务' })
  title: string; // 审判长、审判员等

  @Column({ length: 20, nullable: true, comment: '联系电话' })
  phone: string;

  @Column({ length: 100, nullable: true, comment: '邮箱' })
  email: string;

  @Column({ default: true, comment: '是否启用' })
  isActive: boolean;

  // 关联法院
  @Column({ comment: '法院ID' })
  courtId: string;

  @ManyToOne(() => Court, court => court.judges)
  @JoinColumn({ name: 'courtId' })
  court: Court;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
