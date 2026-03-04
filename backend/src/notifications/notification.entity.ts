import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export enum NotificationType {
  REPAYMENT_REMINDER = 'repayment_reminder',  // 还款提醒
  OVERDUE_ALERT = 'overdue_alert',            // 逾期预警
  SYSTEM_NOTICE = 'system_notice',            // 系统通知
  CASE_UPDATE = 'case_update',                // 案件更新
}

export enum NotificationStatus {
  UNREAD = 'unread',
  READ = 'read',
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', comment: '接收人ID' })
  @Index()
  userId: number;

  @Column({ length: 50, comment: '通知类型' })
  type: string;

  @Column({ length: 200, comment: '标题' })
  title: string;

  @Column({ type: 'text', comment: '内容' })
  content: string;

  @Column({ type: 'json', nullable: true, comment: '关联数据(案件ID列表等)' })
  metaData: any;

  @Column({ length: 20, default: 'unread', comment: '状态' })
  status: string;

  @Column({ type: 'datetime', nullable: true, comment: '阅读时间' })
  readAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
