import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RepaymentPlan } from '../cases/repayment-plan.entity';
import { RepaymentInstallment } from '../cases/repayment-installment.entity';

@Injectable()
export class RepaymentPlanGeneratorService {
  constructor(
    @InjectRepository(RepaymentInstallment)
    private installmentRepository: Repository<RepaymentInstallment>,
  ) {}

  // 鐢熸垚杩樻璁″垝
  async generatePlan(plan: RepaymentPlan) {
    const installments: Partial<RepaymentInstallment>[] = [];
    
    switch (plan.repaymentMethod) {
      case 'equal_interest':
        return this.generateEqualInterestPlan(plan);
      case 'equal_principal':
        return this.generateEqualPrincipalPlan(plan);
      case 'once':
        return this.generateOncePlan(plan);
      case 'custom':
      default:
        return this.generateCustomPlan(plan);
    }
  }

  // 绛夐鏈伅
  private generateEqualInterestPlan(plan: RepaymentPlan) {
    const { totalPeriods, totalAmount, interestRate, firstDueDate, repaymentDay } = plan;
    const monthlyRate = (interestRate || 0) / 100 / 12;
    
    // 姣忔湀杩樻棰?= [鏈噾脳鏈堝埄鐜嚸?1+鏈堝埄鐜?^鏈熸暟]梅[(1+鏈堝埄鐜?^鏈熸暟-1]
    const monthlyPayment = monthlyRate > 0
      ? (totalAmount * monthlyRate * Math.pow(1 + monthlyRate, totalPeriods)) / 
        (Math.pow(1 + monthlyRate, totalPeriods) - 1)
      : totalAmount / totalPeriods;

    const installments = [];
    let remainingPrincipal = totalAmount;

    for (let i = 1; i <= totalPeriods; i++) {
      const interest = remainingPrincipal * monthlyRate;
      const principal = monthlyPayment - interest;
      remainingPrincipal -= principal;

      installments.push({
        caseId: plan.caseId,
        installmentNo: i,
        dueDate: this.calculateDueDate(firstDueDate, i - 1, repaymentDay),
        dueAmount: parseFloat(monthlyPayment.toFixed(2)),
        principal: parseFloat(principal.toFixed(2)),
        interest: parseFloat(interest.toFixed(2)),
        remainingPrincipal: parseFloat(Math.max(0, remainingPrincipal).toFixed(2)),
        status: 'pending',
      });
    }

    return installments;
  }

  // 绛夐鏈噾
  private generateEqualPrincipalPlan(plan: RepaymentPlan) {
    const { totalPeriods, totalAmount, interestRate, firstDueDate, repaymentDay } = plan;
    const monthlyPrincipal = totalAmount / totalPeriods;
    const monthlyRate = (interestRate || 0) / 100 / 12;

    const installments = [];
    let remainingPrincipal = totalAmount;

    for (let i = 1; i <= totalPeriods; i++) {
      const interest = remainingPrincipal * monthlyRate;
      const monthlyPayment = monthlyPrincipal + interest;
      remainingPrincipal -= monthlyPrincipal;

      installments.push({
        caseId: plan.caseId,
        installmentNo: i,
        dueDate: this.calculateDueDate(firstDueDate, i - 1, repaymentDay),
        dueAmount: parseFloat(monthlyPayment.toFixed(2)),
        principal: parseFloat(monthlyPrincipal.toFixed(2)),
        interest: parseFloat(interest.toFixed(2)),
        remainingPrincipal: parseFloat(Math.max(0, remainingPrincipal).toFixed(2)),
        status: 'pending',
      });
    }

    return installments;
  }

  // 涓€娆℃€ц繕鏈粯鎭?  private generateOncePlan(plan: RepaymentPlan) {
    const { totalAmount, interestRate, firstDueDate } = plan;
    const interest = totalAmount * (interestRate || 0) / 100;

    return [{
      caseId: plan.caseId,
      installmentNo: 1,
      dueDate: firstDueDate,
      dueAmount: parseFloat((totalAmount + interest).toFixed(2)),
      principal: totalAmount,
      interest: parseFloat(interest.toFixed(2)),
      remainingPrincipal: 0,
      status: 'pending',
    }];
  }

  // 鑷畾涔夊垎鏈燂紙骞冲潎鍒嗛厤锛?  private generateCustomPlan(plan: RepaymentPlan) {
    const { totalPeriods, totalAmount, firstDueDate, repaymentDay } = plan;
    const monthlyAmount = totalAmount / totalPeriods;

    const installments = [];
    
    for (let i = 1; i <= totalPeriods; i++) {
      const isLast = i === totalPeriods;
      const amount = isLast 
        ? totalAmount - monthlyAmount * (totalPeriods - 1)
        : monthlyAmount;

      installments.push({
        caseId: plan.caseId,
        installmentNo: i,
        dueDate: this.calculateDueDate(firstDueDate, i - 1, repaymentDay),
        dueAmount: parseFloat(amount.toFixed(2)),
        principal: parseFloat(amount.toFixed(2)),
        interest: 0,
        remainingPrincipal: parseFloat((totalAmount - monthlyAmount * i).toFixed(2)),
        status: 'pending',
      });
    }

    return installments;
  }

  // 璁＄畻杩樻鏃ユ湡
  private calculateDueDate(firstDueDate: Date, periodOffset: number, repaymentDay: number): Date {
    const date = new Date(firstDueDate);
    date.setMonth(date.getMonth() + periodOffset);
    
    // 璁剧疆杩樻鏃?    const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    date.setDate(Math.min(repaymentDay, lastDayOfMonth));
    
    return date;
  }
}
