import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index, OneToMany } from 'typeorm';
import { Case } from '../cases/case.entity';

@Entity('asset_packages')
export class AssetPackage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, comment: '资产包编号' })
  @Index()
  packageNo: string;

  @Column({ length: 200, comment: '资产包名称' })
  packageName: string;

  @Column({ type: 'date', comment: '创建日期' })
  createDate: Date;

  @Column({ type: 'date', nullable: true, comment: '到期日期' })
  expiryDate: Date;

  @Column({ type: 'integer', comment: '案件总数', default: 0 })
  totalCases: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, comment: '资产包总金额', default: 0 })
  totalAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, comment: '已回收金额', default: 0 })
  recoveredAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, comment: '应还金额', default: 0 })
  shouldRepayAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, comment: '实还金额', default: 0 })
  actualRepayAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, comment: '逾期金额', default: 0 })
  overdueAmount: number;

  @Column({ type: 'integer', comment: '逾期案件数', default: 0 })
  overdueCases: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, comment: '回收率(%)', default: 0 })
  recoveryRate: number;

  @Column({ type: 'text', nullable: true, comment: '资产包描述' })
  description: string;

  @Column({ length: 50, nullable: true, comment: '数据来源' })
  source: string;

  @Column({ type: 'tinyint', default: 0, comment: '是否删除' })
  isDeleted: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // 关联案件
  @OneToMany(() => Case, c => c.id)
  cases: Case[];
}
