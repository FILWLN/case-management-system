import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index, OneToMany } from 'typeorm';
import { Case } from '../cases/case.entity';

@Entity('asset_packages')
export class AssetPackage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, comment: '璧勪骇鍖呯紪鍙? })
  @Index()
  packageNo: string;

  @Column({ length: 200, comment: '璧勪骇鍖呭悕绉? })
  packageName: string;

  @Column({ type: 'date', comment: '鍒涘缓鏃ユ湡' })
  createDate: Date;

  @Column({ type: 'date', nullable: true, comment: '鍒版湡鏃ユ湡' })
  expiryDate: Date;

  @Column({ type: 'integer', comment: '妗堜欢鎬绘暟', default: 0 })
  totalCases: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, comment: '璧勪骇鍖呮€婚噾棰?, default: 0 })
  totalAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, comment: '宸插洖鏀堕噾棰?, default: 0 })
  recoveredAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, comment: '搴旇繕閲戦', default: 0 })
  shouldRepayAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, comment: '瀹炶繕閲戦', default: 0 })
  actualRepayAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, comment: '閫炬湡閲戦', default: 0 })
  overdueAmount: number;

  @Column({ type: 'integer', comment: '閫炬湡妗堜欢鏁?, default: 0 })
  overdueCases: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, comment: '鍥炴敹鐜?%)', default: 0 })
  recoveryRate: number;

  @Column({ type: 'text', nullable: true, comment: '璧勪骇鍖呮弿杩? })
  description: string;

  @Column({ length: 50, nullable: true, comment: '鏁版嵁鏉ユ簮' })
  source: string;

  @Column({ type: 'tinyint', default: 0, comment: '鏄惁鍒犻櫎' })
  isDeleted: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // 鍏宠仈妗堜欢
  @OneToMany(() => Case, c => c.assetPackage)
  cases: Case[];
}
