import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { RepaymentInstallment } from './repayment-installment.entity';
import { CaseNote } from './case-note.entity';

// ========== 案件类型 ==========
export enum CaseType {
  CIVIL = '民初',           // 民初案件
  EXECUTION = '执行',       // 执行案件
  RECOVERY = '执恢',        // 执恢案件
}

// ========== 民初案件状态（29个） ==========
export enum CivilCaseStatus {
  // 立案阶段
  FILING_SUBMITTED = '网立立案已提交',
  FILING_FEEDBACK = '网立立案反馈获取',
  FILING_REJECTED = '网立驳回',
  FILING_ACCEPTED = '网立受理立案',
  FILING_NOT_ACCEPTED = '网立不予立案',
  
  // 补充材料
  PENDING_MATERIALS = '待补充网立材料',
  MATERIALS_TO_MAIL = '待邮寄网立立案补充材料',
  MATERIALS_TO_UPLOAD = '待上传网立立案补充材料',
  MATERIALS_MAILED = '网立立案补充材料已邮寄',
  MATERIALS_UPLOADED = '网立立案补充材料已上传',
  MATERIALS_RECEIVED = '网立立案补充材料法院已收到',
  MATERIALS_NOT_RECEIVED = '网立立案补充材料法院未收到',
  
  // 缴费/通知
  PAYMENT_NOTICE = '缴费通知/案件受理通知',
  
  // 传票
  AWAITING_SUMMONS = '等待法院传票送达',
  SUMMONS_RECEIVED = '法院传票已收到',
  
  // 管辖变更
  CHANGE_JURISDICTION = '变更管辖法院重新网立',
  REFILE_JURISDICTION = '变更管辖法院重提网立立案',
  
  // 调解
  MEDIATION_IN_PROGRESS = '法院调解中',
  MEDIATION_SUCCESS = '网立调解成功',
  MEDIATION_FAILURE = '网立调解失败',
  
  // 庭审
  TRIAL_INFO = '开庭信息',
  AWAITING_TRIAL = '等待开庭',
  
  // 其他
  AWAITING_LAWYER = '待委派律师',
  CASE_WITHDRAWN = '退案结案',
  CIVIL_CLOSED = '诉讼结案',
}

// ========== 执行案件状态（22个） ==========
export enum ExecutionCaseStatus {
  // 立案
  FILING_SUBMITTED = '强执立案已提交',
  FILING_SUCCESS = '强执立案成功',
  FILING_FAILURE = '强执立案失败',
  FILING_ACCEPTED = '强执立案已受理',
  
  // 材料
  COMMUNICATION_DONE = '已完成强执立案沟通',
  MATERIALS_MAILED = '已邮寄强执立案材料',
  MATERIALS_RECEIVED = '强执立案材料法院已收到',
  MATERIALS_NOT_RECEIVED = '强执立案材料法院未收到',
  
  // 还款
  REPAYMENT_FOLLOWUP = '还款跟进',
  REPAYMENT_OVERDUE = '还款已逾期',
  REPAYMENT_ON_TIME = '还款未逾期',
  
  // 结果
  FULL_DEDUCTION = '全部划扣',
  PARTIAL_DEDUCTION = '部分划扣',
  SETTLEMENT_REACHED = '达成执行和解',
  EXECUTION_COMPLETED = '执行到位',
  NO_PROPERTY = '无财产可供执行',
  FINAL_TERMINATION = '终局强执立案失败',
  
  // 判决
  JUDGMENT_UPLOADED = '判决文书已上传',
  JUDGMENT_PERFORMED = '履行判决结果',
  SETTLEMENT_CLOSED = '达成和解',
  NOT_EXECUTED = '不予执行立案',
  
  // 终本
  TERMINATION_RULING = '终本裁定',
  EXECUTION_CLOSED = '执行结案',
}

// ========== 冻结状态 ==========
export enum FreezeStatus {
  NORMAL = 'normal',           // 正常
  NO_FREEZE = 'no_freeze',     // 无需冻结
  FROZEN = 'frozen',           // 已冻结
}

// ========== 法官角色 ==========
export enum JudgeRole {
  PRIMARY = 'primary',         // 承办法官
  ASSISTANT = 'assistant',     // 法官助理
  CLERK = 'clerk',             // 书记员
}

// ========== 还款方式 ==========
export enum RepaymentMethod {
  EQUAL_INTEREST = '等额本息',
  EQUAL_PRINCIPAL = '等额本金',
  LUMP_SUM = '一次性',
  CUSTOM = '自定义',
}

// 金额信息接口
export interface AmountInfo {
  originalClaim: number;        // A诉讼标的
  remainingClaim: number;       // E起诉剩余未还金额
  paidTotal: number;            // C还款合计
  executionTarget: number;      // F执行立案标的
  executionPaid: number;        // H还款合计（执行阶段）
  fees: number;                 // 费用（计入未还金额）
  courtDeduction: number;       // 法院划扣金额
  voluntaryRepayment: number;   // 当事人主动还款
}

// 法官信息接口
export interface JudgeInfo {
  primaryJudge: string;         // 承办法官（必填）
  assistant?: string;           // 法官助理（选填）
  clerk: string;                // 书记员（必填）
}

@Entity('cases')
export class Case {
  // ========== 主键 ==========
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ========== 业务主键：京东PIN码 ==========
  @Column({ length: 100, unique: true, comment: '京东PIN码-业务主键' })
  @Index()
  pinCode: string;

  // ========== 案件类型 ==========
  @Column({ 
    type: 'enum', 
    enum: CaseType, 
    default: CaseType.CIVIL,
    comment: '案件类型：民初/执行/执恢' 
  })
  caseType: CaseType;

  // ========== 父案件ID（执恢关联原执行案件） ==========
  @Column({ nullable: true, comment: '父案件ID（执恢关联原执行案件）' })
  parentCaseId: string;

  @ManyToOne(() => Case, c => c.recoveryCases)
  @JoinColumn({ name: 'parentCaseId' })
  parentCase: Case;

  @OneToMany(() => Case, c => c.parentCase)
  recoveryCases: Case[];

  // ========== 客户基本信息 ==========
  @Column({ length: 100, comment: '客户姓名' })
  customerName: string;

  @Column({ length: 20, nullable: true, comment: '身份证号' })
  customerIdcard: string;

  @Column({ length: 20, nullable: true, comment: '电话' })
  customerPhone: string;

  @Column({ length: 10, nullable: true, comment: '性别' })
  gender: string;

  @Column({ length: 20, nullable: true, comment: '民族' })
  ethnicity: string;

  @Column({ type: 'date', nullable: true, comment: '出生日期' })
  birthDate: Date;

  @Column({ length: 500, nullable: true, comment: '户籍住址' })
  homeAddress: string;

  @Column({ length: 500, nullable: true, comment: '通讯地址' })
  address: string;

  // ========== 案件状态（详细枚举） ==========
  @Column({ 
    length: 50, 
    default: CivilCaseStatus.FILING_SUBMITTED,
    comment: '案件状态' 
  })
  @Index()
  status: string;

  // ========== 状态历史记录（JSON数组） ==========
  @Column({ type: 'simple-json', nullable: true, comment: '状态变更历史' })
  statusHistory: Array<{
    status: string;
    changedAt: Date;
    changedBy: string;
    remark?: string;
  }>;

  // ========== 法官信息（JSON） ==========
  @Column({ type: 'simple-json', nullable: true, comment: '法官信息' })
  judgeInfo: JudgeInfo;

  // ========== 法院信息 ==========
  @Column({ length: 200, nullable: true, comment: '法院名称' })
  courtName: string;

  @Column({ length: 50, nullable: true, comment: '民初案号' })
  civilCaseNo: string;

  @Column({ length: 50, nullable: true, comment: '执行案号' })
  executionCaseNo: string;

  @Column({ length: 50, nullable: true, comment: '执恢案号' })
  recoveryCaseNo: string;

  // ========== 金额信息（JSON） ==========
  @Column({ type: 'simple-json', nullable: true, comment: '金额信息' })
  amountInfo: AmountInfo;

  // ========== 借款信息 ==========
  @Column({ type: 'decimal', precision: 15, scale: 2, comment: '借款本金' })
  loanPrincipal: number;

  @Column({ type: 'int', comment: '分期期数' })
  installments: number;

  @Column({ type: 'int', nullable: true, comment: '逾期未还期数' })
  overdueInstallments: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true, comment: '年贷款利率' })
  annualInterestRate: number;

  @Column({ type: 'date', nullable: true, comment: '借款合同签订日期' })
  loanContractDate: Date;

  @Column({ type: 'date', nullable: true, comment: '借款合同到期日期' })
  loanContractExpiryDate: Date;

  @Column({ type: 'date', nullable: true, comment: '首次逾期日' })
  firstOverdueDate: Date;

  @Column({ type: 'date', nullable: true, comment: '首次代偿日期' })
  firstCompensationDate: Date;

  @Column({ type: 'date', nullable: true, comment: '最后代偿日期' })
  lastCompensationDate: Date;

  // ========== 冻结管理 ==========
  @Column({ 
    type: 'enum', 
    enum: FreezeStatus, 
    default: FreezeStatus.NORMAL,
    comment: '冻结状态' 
  })
  freezeStatus: FreezeStatus;

  @Column({ length: 200, nullable: true, comment: '无需冻结原因' })
  noFreezeReason: string;

  @Column({ type: 'date', nullable: true, comment: '冻结日期' })
  freezeDate: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true, comment: '申请冻结金额' })
  freezeAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true, comment: '实际冻结金额' })
  actualFreezeAmount: number;

  // ========== 调解信息 ==========
  @Column({ type: 'boolean', default: false, comment: '是否调解' })
  isMediation: boolean;

  @Column({ length: 100, nullable: true, comment: '调解员' })
  mediatorName: string;

  @Column({ type: 'date', nullable: true, comment: '调解时间' })
  mediationDate: Date;

  @Column({ type: 'text', nullable: true, comment: '调解详情' })
  mediationDetail: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true, comment: '协商还款总额' })
  negotiatedAmount: number;

  // ========== 还款计划 ==========
  @Column({ 
    type: 'enum', 
    enum: RepaymentMethod, 
    default: RepaymentMethod.CUSTOM,
    comment: '还款方式' 
  })
  repaymentMethod: RepaymentMethod;

  @Column({ type: 'simple-json', nullable: true, comment: '还款计划明细' })
  repaymentSchedule: Array<{
    period: number;
    dueDate: Date;
    principal: number;
    interest: number;
    fee: number;
    total: number;
    status: string;
  }>;

  // ========== 费用信息 ==========
  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true, comment: '受理费' })
  acceptanceFee: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true, comment: '执行费' })
  executionFee: number;

  // ========== 日期记录 ==========
  @Column({ type: 'date', nullable: true, comment: '立案日期' })
  filingDate: Date;

  @Column({ type: 'date', nullable: true, comment: '判决生效日期' })
  effectiveDate: Date;

  @Column({ type: 'date', nullable: true, comment: '开庭日期' })
  hearingDate: Date;

  @Column({ type: 'date', nullable: true, comment: '结案日期' })
  closeDate: Date;

  // ========== 系统字段 ==========
  @Column({ default: false, comment: '是否删除' })
  isDeleted: boolean;

  @Column({ length: 100, nullable: true, comment: '创建人' })
  createdBy: string;

  @Column({ length: 100, nullable: true, comment: '更新人' })
  updatedBy: string;

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
