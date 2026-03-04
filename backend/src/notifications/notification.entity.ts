import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export enum NotificationType {
  REPAYMENT_REMINDER = 'repayment_reminder',  // 杩樻鎻愰啋
  OVERDUE_ALERT = 'overdue_alert',            // 閫炬湡棰勮
  SYSTEM_NOTICE = 'system_notice',            // 绯荤粺閫氱煡
  CASE_UPDATE = 'case_update',                // 妗堜欢鏇存柊
}

export enum NotificationStatus {
  UNREAD = 'unread',
  READ = 'read',
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', comment: '鎺ユ敹浜篒D' })
  @Index()
  userId: number;

  @Column({ length: 50, comment: '閫氱煡绫诲瀷' })
  type: string;

  @Column({ length: 200, comment: '鏍囬' })
  title: string;

  @Column({ type: 'text', comment: '鍐呭' })
  content: string;

  @Column({ type: 'json', nullable: true, comment: '鍏宠仈鏁版嵁(妗堜欢ID鍒楄〃绛?' })
  metaData: any;

  @Column({ length: 20, default: 'unread', comment: '鐘舵€? })
  status: string;

  @Column({ type: 'datetime', nullable: true, comment: '闃呰鏃堕棿' })
  readAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
