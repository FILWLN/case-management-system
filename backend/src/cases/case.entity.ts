import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index, OneToMany } from 'typeorm';
import { RepaymentInstallment } from './repayment-installment.entity';
import { CaseNote } from './case-note.entity';

// 案件类型
export enum CaseType {
  LITIGATION = 'litigation',      // 诉讼案件
  EXECUTION = 'execution',        // 执行案件
  PRESERVATION = 'preservation',  // 诉保案件
}

// 案件状态（更新后的详细状态）
export enum CaseStatus {
  PENDING = 'pending',                    // 待处理-待立案
  FILING = 'filing',                      // 已立案-待保全
  PRESERVATION = 'preservation',          // 保全中-待处理
  MEDIATION_CLOSED = 'mediation',         // 调解结束-待履约
  JUDGMENT_CLOSED = 'judgment',           // 判决结束-待履约
  CLOSED = 'closed',                      // 已结案-履约监督中
  EXECUTION = 'execution',                // 执行中
  FINISHED = 'finished',                  // 案件结束
}

// 调解结案方式
export enum MediationCloseType {
  RECONCILIATION = '和解',
  MEDIATION = '调解',
  WITHDRAWAL = '准许撤诉',
  DISMISSAL = '按撤诉处理',
}

// 执行结案方式
export enum ExecutionCloseType {
  NOT_EXECUTED = '不予执行',
  REJECTED = '驳回申请',
  COMPLETED = '执行完毕',
  TERMINATED = '终结执行',
  END_THIS_TIME = '终结本次执行程序',
  CASE_CANCELLED = '销案',
}

@Entity('cases')
export class Case {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, comment: '案件序号' })
  @Index()
  caseNo: string;

  @Column({ length: 20, comment: '案件类型' })
  caseType: string;

  // ========== 基本信息 ==========
  @Column({ length: 100, comment: '客户姓名' })
  customerName: string;

  @Column({ length: 100, nullable: true, comment: '身份证号(加密)' })
  customerIdcard: string;

  @Column({ length: 100, nullable: true, comment: '电话(加密)' })
  customerPhone: string;

  @Column({ length: 50, nullable: true, comment: '京东PIN' })
  customerJdPin: string;

  @Column({ length: 50, nullable: true, comment: '唯一识别码' })
  uniqueCode: string;

  @Column({ length: 10, nullable: true, comment: '性别' })
  gender: string;

  @Column({ length: 20, nullable: true, comment: '民族' })
  ethnicity: string;

  @Column({ type: 'date', nullable: true, comment: '出生日期' })
  birthDate: Date;

  @Column({ length: 200, nullable: true, comment: '通讯地址' })
  address: string;

  @Column({ length: 200, nullable: true, comment: '家庭住址' })
  homeAddress: string;

  @Column({ type: 'int', nullable: true, comment: '家庭人口' })
  familySize: number;

  // ========== 案件状态 ==========
  @Column({ length: 20, default: 'pending', comment: '案件状态' })
  @Index()
  status: string;

  // ========== 立案信息 ==========
  @Column({ type: 'date', nullable: true, comment: '立案日期' })
  filingDate: Date;

  @Column({ type: 'date', nullable: true, comment: '外网立案日期' })
  externalFilingDate: Date;

  @Column({ length: 100, nullable: true, comment: '民初案号' })
  civilCaseNo: string;

  @Column({ length: 50, nullable: true, comment: '民初承办法官' })
  judgeName: string;

  @Column({ length: 50, nullable: true, comment: '法官助理' })
  judgeAssistant: string;

  @Column({ length: 50, nullable: true, comment: '书记员' })
  clerk: string;

  // ========== 执保信息 ==========
  @Column({ type: 'date', nullable: true, comment: '执保立案日期' })
  preservationFilingDate: Date;

  @Column({ length: 100, nullable: true, comment: '执保案号' })
  preservationCaseNo: string;

  @Column({ length: 50, nullable: true, comment: '执保承办法官' })
  preservationJudgeName: string;

  @Column({ type: 'date', nullable: true, comment: '冻结日期' })
  freezeDate: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true, comment: '申请冻结金额' })
  freezeAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true, comment: '实际冻结金额' })
  actualFreezeAmount: number;

  @Column({ type: 'date', nullable: true, comment: '解冻日期' })
  unfreezeDate: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true, comment: '受理费' })
  acceptanceFee: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true, comment: '执保费' })
  preservationFee: number;

  @Column({ default: false, comment: '已协商无需冻结' })
  noFreezeRequired: boolean;

  // ========== 开庭信息 ==========
  @Column({ type: 'date', nullable: true, comment: '开庭日期' })
  hearingDate: Date;

  @Column({ length: 100, nullable: true, comment: '开庭法庭' })
  court: string;

  // ========== 结案类型 ==========
  @Column({ length: 20, nullable: true, comment: '结案类型：mediation/judgment' })
  closeTypeCategory: string;

  // ========== 调解结案信息 ==========
  @Column({ type: 'date', nullable: true, comment: '违约纠纷发生日期' })
  disputeDate: Date;

  @Column({ type: 'date', nullable: true, comment: '协议签署日期' })
  agreementDate: Date;

  @Column({ type: 'date', nullable: true, comment: '协议到期日期' })
  agreementExpiryDate: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true, comment: '协议利率(%)' })
  interestRate: number;

  @Column({ length: 50, nullable: true, comment: '调解员' })
  mediatorName: string;

  @Column({ length: 50, nullable: true, comment: '协议办法官' })
  mediationJudgeName: string;

  @Column({ length: 50, nullable: true, comment: '协议司法员' })
  judicialOfficer: string;

  @Column({ length: 50, nullable: true, comment: '调解时间' })
  mediationTime: string;

  @Column({ type: 'text', nullable: true, comment: '调解详情/笔录' })
  mediationDetail: string;

  @Column({ type: 'text', nullable: true, comment: '笔录书写备注' })
  noteRemark: string;

  @Column({ default: false, comment: '签字笔录打印' })
  printed: boolean;

  @Column({ length: 20, nullable: true, comment: '是否需制作文书' })
  needDocument: string; // 'yes-done', 'yes-pending', 'no'

  @Column({ default: false, comment: '调解书稿打印' })
  documentPrinted: boolean;

  @Column({ default: false, comment: '书稿法官签字' })
  judgeSigned: boolean;

  @Column({ type: 'date', nullable: true, comment: '原告签字日期' })
  plaintiffSignDate: Date;

  @Column({ type: 'date', nullable: true, comment: '被告签字日期' })
  defendantSignDate: Date;

  @Column({ length: 50, nullable: true, comment: '调解结案方式' })
  closeType: string;

  @Column({ type: 'date', nullable: true, comment: '调解结案日期' })
  closeDate: Date;

  @Column({ type: 'date', nullable: true, comment: '结案期限日限' })
  closeDeadline: Date;

  @Column({ type: 'text', nullable: true, comment: '调解结案方式备注' })
  closeRemark: string;

  // ========== 调解结果金额 ==========
  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true, comment: '订单金额' })
  orderAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true, comment: '订单外协商金额' })
  negotiatedAmount: number;

  // ========== 判决结案信息 ==========
  @Column({ type: 'date', nullable: true, comment: '判决书送达日期' })
  serviceDate: Date;

  @Column({ type: 'date', nullable: true, comment: '判决生效日期' })
  effectiveDate: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true, comment: '判决金额' })
  judgmentAmount: number;

  @Column({ length: 50, nullable: true, comment: '判决承办法官' })
  judgmentJudgeName: string;

  // ========== 履约监督 ==========
  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true, comment: '已还总额' })
  paidAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true, comment: '冻结合计' })
  repaymentFreezeAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true, comment: '实际解冻合计' })
  repaymentUnfreezeAmount: number;

  @Column({ type: 'date', nullable: true, comment: '需解冻日期' })
  repaymentUnfreezeDate: Date;

  @Column({ type: 'date', nullable: true, comment: '实际解冻日期' })
  actualUnfreezeDate: Date;

  @Column({ length: 10, nullable: true, comment: '是否申请强制执行' })
  applyEnforcement: string;

  @Column({ length: 50, nullable: true, comment: '还款方式' })
  repaymentMethod: string;

  @Column({ type: 'boolean', default: false, comment: '是否已生成执行案件' })
  hasExecutionCase: boolean;

  // ========== 执行案件信息 ==========
  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true, comment: '原案件金额（执行标的）' })
  executionOriginalAmount: number;

  @Column({ type: 'date', nullable: true, comment: '执行立案日期' })
  executionFilingDate: Date;

  @Column({ length: 100, nullable: true, comment: '执行案号' })
  executionCaseNumber: string;

  @Column({ length: 50, nullable: true, comment: '执行办法官' })
  executionJudgeName: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true, comment: '执行费' })
  executionFee: number;

  @Column({ length: 20, nullable: true, comment: '执行费承担方' })
  feeBearer: string;

  @Column({ length: 50, nullable: true, comment: '执行结案方式' })
  executionCloseType: string;

  @Column({ type: 'date', nullable: true, comment: '执行结案日期' })
  executionCloseDate: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true, comment: '法院划扣金额' })
  courtDeduction: number;

  @Column({ type: 'date', nullable: true, comment: '法院支付日期' })
  courtPaymentDate: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true, comment: '法院转账至京东金额' })
  courtTransferAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true, comment: '当事人主动还款' })
  voluntaryRepayment: number;

  // ========== 执恢信息 ==========
  @Column({ default: false, comment: '是否执恢' })
  hasRecovery: boolean;

  @Column({ length: 100, nullable: true, comment: '执恢案号' })
  recoveryCaseNo: string;

  @Column({ type: 'date', nullable: true, comment: '执恢立案日期' })
  recoveryFilingDate: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true, comment: '执恢标的金额' })
  recoveryAmount: number;

  @Column({ type: 'date', nullable: true, comment: '执恢结案日期' })
  recoveryCloseDate: Date;

  // ========== 系统字段 ==========
  @Column({ type: 'tinyint', default: 0, comment: '是否删除' })
  isDeleted: number;

  @Column({ type: 'integer', nullable: true, comment: '创建人ID' })
  createdBy: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // ========== 关联 ==========
  @OneToMany(() => RepaymentInstallment, installment => installment.case)
  installments: RepaymentInstallment[];

  @OneToMany(() => CaseNote, note => note.case)
  notes: CaseNote[];
}
