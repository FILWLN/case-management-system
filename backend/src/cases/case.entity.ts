import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index, OneToMany } from 'typeorm';
import { RepaymentInstallment } from './repayment-installment.entity';
import { CaseNote } from './case-note.entity';

// 妗堜欢绫诲瀷
export enum CaseType {
  LITIGATION = 'litigation',      // 璇夎妗堜欢
  EXECUTION = 'execution',        // 鎵ц妗堜欢
  PRESERVATION = 'preservation',  // 璇変繚妗堜欢
}

// 妗堜欢鐘舵€侊紙鏇存柊鍚庣殑璇︾粏鐘舵€侊級
export enum CaseStatus {
  PENDING = 'pending',                    // 寰呭鐞?寰呯珛妗?  FILING = 'filing',                      // 宸茬珛妗?寰呬繚鍏?  PRESERVATION = 'preservation',          // 淇濆叏涓?寰呭鐞?  MEDIATION_CLOSED = 'mediation',         // 璋冭В缁撴潫-寰呭饱绾?  JUDGMENT_CLOSED = 'judgment',           // 鍒ゅ喅缁撴潫-寰呭饱绾?  CLOSED = 'closed',                      // 宸茬粨妗?灞ョ害鐩戠潱涓?  EXECUTION = 'execution',                // 鎵ц涓?  FINISHED = 'finished',                  // 妗堜欢缁撴潫
}

// 璋冭В缁撴鏂瑰紡
export enum MediationCloseType {
  RECONCILIATION = '鍜岃В',
  MEDIATION = '璋冭В',
  WITHDRAWAL = '鍑嗚鎾よ瘔',
  DISMISSAL = '鎸夋挙璇夊鐞?,
}

// 鎵ц缁撴鏂瑰紡
export enum ExecutionCloseType {
  NOT_EXECUTED = '涓嶄簣鎵ц',
  REJECTED = '椹冲洖鐢宠',
  COMPLETED = '鎵ц瀹屾瘯',
  TERMINATED = '缁堢粨鎵ц',
  END_THIS_TIME = '缁堢粨鏈鎵ц绋嬪簭',
  CASE_CANCELLED = '閿€妗?,
}

@Entity('cases')
export class Case {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, comment: '妗堜欢搴忓彿' })
  @Index()
  caseNo: string;

  @Column({ length: 20, comment: '妗堜欢绫诲瀷' })
  caseType: string;

  // ========== 鍩烘湰淇℃伅 ==========
  @Column({ length: 100, comment: '瀹㈡埛濮撳悕' })
  customerName: string;

  @Column({ length: 100, nullable: true, comment: '韬唤璇佸彿(鍔犲瘑)' })
  customerIdcard: string;

  @Column({ length: 100, nullable: true, comment: '鐢佃瘽(鍔犲瘑)' })
  customerPhone: string;

  @Column({ length: 50, nullable: true, comment: '浜笢PIN' })
  customerJdPin: string;

  @Column({ length: 50, nullable: true, comment: '鍞竴璇嗗埆鐮? })
  uniqueCode: string;

  @Column({ length: 10, nullable: true, comment: '鎬у埆' })
  gender: string;

  @Column({ length: 20, nullable: true, comment: '姘戞棌' })
  ethnicity: string;

  @Column({ type: 'date', nullable: true, comment: '鍑虹敓鏃ユ湡' })
  birthDate: Date;

  @Column({ length: 200, nullable: true, comment: '閫氳鍦板潃' })
  address: string;

  @Column({ length: 200, nullable: true, comment: '瀹跺涵浣忓潃' })
  homeAddress: string;

  @Column({ type: 'int', nullable: true, comment: '瀹跺涵浜哄彛' })
  familySize: number;

  // ========== 妗堜欢鐘舵€?==========
  @Column({ length: 20, default: 'pending', comment: '妗堜欢鐘舵€? })
  @Index()
  status: string;

  // ========== 绔嬫淇℃伅 ==========
  @Column({ type: 'date', nullable: true, comment: '绔嬫鏃ユ湡' })
  filingDate: Date;

  @Column({ type: 'date', nullable: true, comment: '澶栫綉绔嬫鏃ユ湡' })
  externalFilingDate: Date;

  @Column({ length: 100, nullable: true, comment: '姘戝垵妗堝彿' })
  civilCaseNo: string;

  @Column({ length: 50, nullable: true, comment: '姘戝垵鎵垮姙娉曞畼' })
  judgeName: string;

  @Column({ length: 50, nullable: true, comment: '娉曞畼鍔╃悊' })
  judgeAssistant: string;

  @Column({ length: 50, nullable: true, comment: '涔﹁鍛? })
  clerk: string;

  // ========== 鎵т繚淇℃伅 ==========
  @Column({ type: 'date', nullable: true, comment: '鎵т繚绔嬫鏃ユ湡' })
  preservationFilingDate: Date;

  @Column({ length: 100, nullable: true, comment: '鎵т繚妗堝彿' })
  preservationCaseNo: string;

  @Column({ length: 50, nullable: true, comment: '鎵т繚鎵垮姙娉曞畼' })
  preservationJudgeName: string;

  @Column({ type: 'date', nullable: true, comment: '鍐荤粨鏃ユ湡' })
  freezeDate: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true, comment: '鐢宠鍐荤粨閲戦' })
  freezeAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true, comment: '瀹為檯鍐荤粨閲戦' })
  actualFreezeAmount: number;

  @Column({ type: 'date', nullable: true, comment: '瑙ｅ喕鏃ユ湡' })
  unfreezeDate: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true, comment: '鍙楃悊璐? })
  acceptanceFee: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true, comment: '鎵т繚璐? })
  preservationFee: number;

  @Column({ default: false, comment: '宸插崗鍟嗘棤闇€鍐荤粨' })
  noFreezeRequired: boolean;

  // ========== 寮€搴俊鎭?==========
  @Column({ type: 'date', nullable: true, comment: '寮€搴棩鏈? })
  hearingDate: Date;

  @Column({ length: 100, nullable: true, comment: '寮€搴硶搴? })
  court: string;

  // ========== 缁撴绫诲瀷 ==========
  @Column({ length: 20, nullable: true, comment: '缁撴绫诲瀷锛歮ediation/judgment' })
  closeTypeCategory: string;

  // ========== 璋冭В缁撴淇℃伅 ==========
  @Column({ type: 'date', nullable: true, comment: '杩濈害绾犵悍鍙戠敓鏃ユ湡' })
  disputeDate: Date;

  @Column({ type: 'date', nullable: true, comment: '鍗忚绛剧讲鏃ユ湡' })
  agreementDate: Date;

  @Column({ type: 'date', nullable: true, comment: '鍗忚鍒版湡鏃ユ湡' })
  agreementExpiryDate: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true, comment: '鍗忚鍒╃巼(%)' })
  interestRate: number;

  @Column({ length: 50, nullable: true, comment: '璋冭В鍛? })
  mediatorName: string;

  @Column({ length: 50, nullable: true, comment: '鍗忚鍔炴硶瀹? })
  mediationJudgeName: string;

  @Column({ length: 50, nullable: true, comment: '鍗忚鍙告硶鍛? })
  judicialOfficer: string;

  @Column({ length: 50, nullable: true, comment: '璋冭В鏃堕棿' })
  mediationTime: string;

  @Column({ type: 'text', nullable: true, comment: '璋冭В璇︽儏/绗斿綍' })
  mediationDetail: string;

  @Column({ type: 'text', nullable: true, comment: '绗斿綍涔﹀啓澶囨敞' })
  noteRemark: string;

  @Column({ default: false, comment: '绛惧瓧绗斿綍鎵撳嵃' })
  printed: boolean;

  @Column({ length: 20, nullable: true, comment: '鏄惁闇€鍒朵綔鏂囦功' })
  needDocument: string; // 'yes-done', 'yes-pending', 'no'

  @Column({ default: false, comment: '璋冭В涔︾鎵撳嵃' })
  documentPrinted: boolean;

  @Column({ default: false, comment: '涔︾娉曞畼绛惧瓧' })
  judgeSigned: boolean;

  @Column({ type: 'date', nullable: true, comment: '鍘熷憡绛惧瓧鏃ユ湡' })
  plaintiffSignDate: Date;

  @Column({ type: 'date', nullable: true, comment: '琚憡绛惧瓧鏃ユ湡' })
  defendantSignDate: Date;

  @Column({ length: 50, nullable: true, comment: '璋冭В缁撴鏂瑰紡' })
  closeType: string;

  @Column({ type: 'date', nullable: true, comment: '璋冭В缁撴鏃ユ湡' })
  closeDate: Date;

  @Column({ type: 'date', nullable: true, comment: '缁撴鏈熼檺鏃ラ檺' })
  closeDeadline: Date;

  @Column({ type: 'text', nullable: true, comment: '璋冭В缁撴鏂瑰紡澶囨敞' })
  closeRemark: string;

  // ========== 璋冭В缁撴灉閲戦 ==========
  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true, comment: '璁㈠崟閲戦' })
  orderAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true, comment: '璁㈠崟澶栧崗鍟嗛噾棰? })
  negotiatedAmount: number;

  // ========== 鍒ゅ喅缁撴淇℃伅 ==========
  @Column({ type: 'date', nullable: true, comment: '鍒ゅ喅涔﹂€佽揪鏃ユ湡' })
  serviceDate: Date;

  @Column({ type: 'date', nullable: true, comment: '鍒ゅ喅鐢熸晥鏃ユ湡' })
  effectiveDate: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true, comment: '鍒ゅ喅閲戦' })
  judgmentAmount: number;

  @Column({ length: 50, nullable: true, comment: '鍒ゅ喅鎵垮姙娉曞畼' })
  judgmentJudgeName: string;

  // ========== 灞ョ害鐩戠潱 ==========
  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true, comment: '宸茶繕鎬婚' })
  paidAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true, comment: '鍐荤粨鍚堣' })
  repaymentFreezeAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true, comment: '瀹為檯瑙ｅ喕鍚堣' })
  repaymentUnfreezeAmount: number;

  @Column({ type: 'date', nullable: true, comment: '闇€瑙ｅ喕鏃ユ湡' })
  repaymentUnfreezeDate: Date;

  @Column({ type: 'date', nullable: true, comment: '瀹為檯瑙ｅ喕鏃ユ湡' })
  actualUnfreezeDate: Date;

  @Column({ length: 10, nullable: true, comment: '鏄惁鐢宠寮哄埗鎵ц' })
  applyEnforcement: string;

  @Column({ length: 50, nullable: true, comment: '杩樻鏂瑰紡' })
  repaymentMethod: string;

  @Column({ type: 'boolean', default: false, comment: '鏄惁宸茬敓鎴愭墽琛屾浠? })
  hasExecutionCase: boolean;

  // ========== 鎵ц妗堜欢淇℃伅 ==========
  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true, comment: '鍘熸浠堕噾棰濓紙鎵ц鏍囩殑锛? })
  executionOriginalAmount: number;

  @Column({ type: 'date', nullable: true, comment: '鎵ц绔嬫鏃ユ湡' })
  executionFilingDate: Date;

  @Column({ length: 100, nullable: true, comment: '鎵ц妗堝彿' })
  executionCaseNumber: string;

  @Column({ length: 50, nullable: true, comment: '鎵ц鍔炴硶瀹? })
  executionJudgeName: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true, comment: '鎵ц璐? })
  executionFee: number;

  @Column({ length: 20, nullable: true, comment: '鎵ц璐规壙鎷呮柟' })
  feeBearer: string;

  @Column({ length: 50, nullable: true, comment: '鎵ц缁撴鏂瑰紡' })
  executionCloseType: string;

  @Column({ type: 'date', nullable: true, comment: '鎵ц缁撴鏃ユ湡' })
  executionCloseDate: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true, comment: '娉曢櫌鍒掓墸閲戦' })
  courtDeduction: number;

  @Column({ type: 'date', nullable: true, comment: '娉曢櫌鏀粯鏃ユ湡' })
  courtPaymentDate: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true, comment: '娉曢櫌杞处鑷充含涓滈噾棰? })
  courtTransferAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true, comment: '褰撲簨浜轰富鍔ㄨ繕娆? })
  voluntaryRepayment: number;

  // ========== 鎵ф仮淇℃伅 ==========
  @Column({ default: false, comment: '鏄惁鎵ф仮' })
  hasRecovery: boolean;

  @Column({ length: 100, nullable: true, comment: '鎵ф仮妗堝彿' })
  recoveryCaseNo: string;

  @Column({ type: 'date', nullable: true, comment: '鎵ф仮绔嬫鏃ユ湡' })
  recoveryFilingDate: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true, comment: '鎵ф仮鏍囩殑閲戦' })
  recoveryAmount: number;

  @Column({ type: 'date', nullable: true, comment: '鎵ф仮缁撴鏃ユ湡' })
  recoveryCloseDate: Date;

  // ========== 绯荤粺瀛楁 ==========
  @Column({ type: 'tinyint', default: 0, comment: '鏄惁鍒犻櫎' })
  isDeleted: number;

  @Column({ type: 'integer', nullable: true, comment: '鍒涘缓浜篒D' })
  createdBy: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // ========== 鍏宠仈 ==========
  @OneToMany(() => RepaymentInstallment, installment => installment.case)
  installments: RepaymentInstallment[];

  @OneToMany(() => CaseNote, note => note.case)
  notes: CaseNote[];
}
