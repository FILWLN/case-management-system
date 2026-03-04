import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { Notification } from './notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async findAll(userId: number, query: any) {
    const where: any = { userId };
    
    if (query.status) {
      where.status = query.status;
    }

    const [list, total] = await this.notificationRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: ((query.page || 1) - 1) * (query.pageSize || 10),
      take: query.pageSize || 10,
    });

    return { list, total, page: query.page || 1, pageSize: query.pageSize || 10 };
  }

  async findOne(id: number, userId: number) {
    return this.notificationRepository.findOne({
      where: { id, userId },
    });
  }

  async create(data: Partial<Notification>) {
    const notification = this.notificationRepository.create(data);
    return this.notificationRepository.save(notification);
  }

  async markAsRead(id: number, userId: number) {
    await this.notificationRepository.update(
      { id, userId },
      { status: 'read', readAt: new Date() }
    );
    return { success: true };
  }

  async markAllAsRead(userId: number) {
    await this.notificationRepository.update(
      { userId, status: 'unread' },
      { status: 'read', readAt: new Date() }
    );
    return { success: true };
  }

  async getUnreadCount(userId: number) {
    const count = await this.notificationRepository.count({
      where: { userId, status: 'unread' },
    });
    return { count };
  }

  // 鐢熸垚杩樻鎻愰啋閫氱煡
  async createRepaymentReminder(userId: number, cases: any[]) {
    const todayCases = cases.filter(c => c.reminderType === 'today');
    const tomorrowCases = cases.filter(c => c.reminderType === 'tomorrow');
    const overdueCases = cases.filter(c => c.reminderType === 'overdue');

    const content = this.formatReminderContent(todayCases, tomorrowCases, overdueCases);

    return this.create({
      userId,
      type: 'repayment_reminder',
      title: `馃搮 ${this.formatDate(new Date())} 杩樻鎻愰啋`,
      content,
      metaData: { caseIds: cases.map(c => c.id) },
    });
  }

  private formatReminderContent(today: any[], tomorrow: any[], overdue: any[]) {
    let content = '';

    if (today.length > 0) {
      content += `馃敶 浠婃棩搴旇繕 (${today.length}浠?\n`;
      today.forEach(c => {
        content += `  鈥?${c.caseNo} | ${c.customerName} | ${this.formatMoney(c.dueAmount)}\n`;
      });
      content += '\n';
    }

    if (tomorrow.length > 0) {
      content += `馃煛 鏄庢棩搴旇繕 (${tomorrow.length}浠?\n`;
      tomorrow.forEach(c => {
        content += `  鈥?${c.caseNo} | ${c.customerName} | ${this.formatMoney(c.dueAmount)}\n`;
      });
      content += '\n';
    }

    if (overdue.length > 0) {
      content += `鈿狅笍 宸查€炬湡 (${overdue.length}浠?\n`;
      overdue.forEach(c => {
        content += `  鈥?${c.caseNo} | ${c.customerName} | ${this.formatMoney(c.dueAmount)} (閫炬湡${c.overdueDays}澶?\n`;
      });
    }

    return content;
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  private formatMoney(amount: number): string {
    return '楼' + amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 });
  }
}
