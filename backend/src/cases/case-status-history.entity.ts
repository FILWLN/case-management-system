import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

// 状态变更操作类型
export enum StatusChangeAction {
  NORMAL = 'normal',           // 正常流转
  SKIP = 'skip',               // 跳过状态
  ROLLBACK = 'rollback',       // 回退状态
  MANUAL = 'manual',           // 手动修改
}

@Entity('case_status_history')
export class CaseStatusHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ comment: '案件ID' })
  @Index()
  caseId: string;

  @Column({ comment: '京东PIN码' })
  @Index()
  pinCode: string;

  @Column({ length: 50, comment: '原状态' })
  fromStatus: string;

  @Column({ length: 50, comment: '新状态' })
  toStatus: string;

  @Column({ 
    type: 'enum', 
    enum: StatusChangeAction, 
    default: StatusChangeAction.NORMAL,
    comment: '操作类型' 
  })
  action: StatusChangeAction;

  @Column({ length: 100, comment: '操作人' })
  operator: string;

  @Column({ length: 100, nullable: true, comment: '操作人角色' })
  operatorRole: string;

  @Column({ type: 'text', nullable: true, comment: '操作备注' })
  remark: string;

  @Column({ type: 'simple-json', nullable: true, comment: '变更前数据快照' })
  beforeSnapshot: any;

  @Column({ type: 'simple-json', nullable: true, comment: '变更后数据快照' })
  afterSnapshot: any;

  @CreateDateColumn()
  createdAt: Date;
}
