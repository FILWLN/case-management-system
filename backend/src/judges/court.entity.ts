import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index, OneToMany } from 'typeorm';
import { Judge } from './judge.entity';

/**
 * 法院实体
 * 管理法院基本信息
 */
@Entity('courts')
export class Court {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200, comment: '法院名称', unique: true })
  @Index()
  name: string;

  @Column({ length: 50, nullable: true, comment: '法院等级' })
  level: string; // 最高法、高院、中院、基层法院

  @Column({ length: 500, nullable: true, comment: '地址' })
  address: string;

  @Column({ length: 20, nullable: true, comment: '联系电话' })
  contactPhone: string;

  @Column({ length: 200, nullable: true, comment: '所属地区' })
  region: string; // 省-市-区

  @Column({ length: 50, nullable: true, comment: '法院代码' })
  courtCode: string;

  @Column({ default: true, comment: '是否启用' })
  isActive: boolean;

  @OneToMany(() => Judge, judge => judge.court)
  judges: Judge[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
