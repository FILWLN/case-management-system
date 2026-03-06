import { Injectable, Logger } from '@nestjs/common';

/**
 * Excel数据清洗服务
 * 处理格式混乱的日期、金额等数据
 */
@Injectable()
export class DataCleaningService {
  private readonly logger = new Logger(DataCleaningService.name);

  /**
   * 清洗金额字段
   * 处理各种格式：1,000.00、¥1000、1000元、(1000)负数等
   */
  cleanAmount(value: any): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    // 如果是数字，直接返回
    if (typeof value === 'number') {
      return value;
    }

    let str = String(value).trim();

    // 处理负数格式：(1000) 或 -1000
    const isNegative = str.startsWith('(') && str.endsWith(')') || str.startsWith('-');
    str = str.replace(/[()]/g, '').replace(/^-/, '');

    // 移除货币符号和单位
    str = str.replace(/[¥￥$,元]/g, '');

    // 处理千分位
    str = str.replace(/,/g, '');

    // 解析数字
    const num = parseFloat(str);
    
    if (isNaN(num)) {
      this.logger.warn(`无法解析金额: ${value}`);
      return null;
    }

    return isNegative ? -num : num;
  }

  /**
   * 清洗日期字段
   * 处理各种格式：2025-09-25、2025/09/25、20250925、Excel日期数字等
   */
  cleanDate(value: any): Date | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    // 如果已经是Date对象
    if (value instanceof Date) {
      return isNaN(value.getTime()) ? null : value;
    }

    // 如果是数字（Excel日期格式）
    if (typeof value === 'number') {
      return this.parseExcelDate(value);
    }

    const str = String(value).trim();

    // 尝试多种日期格式
    const formats = [
      // 标准格式
      /^\d{4}-\d{2}-\d{2}$/,           // 2025-09-25
      /^\d{4}\/\d{2}\/\d{2}$/,          // 2025/09/25
      /^\d{4}年\d{2}月\d{2}日$/,        // 2025年09月25日
      // 紧凑格式
      /^\d{8}$/,                        // 20250925
      // 带时间格式
      /^\d{4}-\d{2}-\d{2}[\sT]\d{2}:\d{2}/,  // 2025-09-25 10:30
    ];

    for (const format of formats) {
      if (format.test(str)) {
        const date = new Date(str.replace(/年|月|日/g, '-'));
        if (!isNaN(date.getTime())) {
          return date;
        }
      }
    }

    // 尝试通用解析
    const date = new Date(str);
    if (!isNaN(date.getTime())) {
      return date;
    }

    this.logger.warn(`无法解析日期: ${value}`);
    return null;
  }

  /**
   * 解析Excel日期（数字格式）
   * Excel日期是从1900年1月1日开始的天数
   */
  private parseExcelDate(excelDate: number): Date | null {
    // Excel的1900年闰年bug：1900年被错误地视为闰年
    // 因此需要减去2天（1900-02-28和1900-02-29）
    const excelEpoch = new Date(1900, 0, 1);
    const days = excelDate - 2;
    const milliseconds = days * 24 * 60 * 60 * 1000;
    const date = new Date(excelEpoch.getTime() + milliseconds);
    
    return isNaN(date.getTime()) ? null : date;
  }

  /**
   * 清洗字符串字段
   * 去除空格、特殊字符等
   */
  cleanString(value: any): string | null {
    if (value === null || value === undefined) {
      return null;
    }

    let str = String(value).trim();
    
    // 去除多余空格
    str = str.replace(/\s+/g, ' ');
    
    // 去除不可见字符
    str = str.replace(/[\x00-\x1F\x7F]/g, '');

    return str || null;
  }

  /**
   * 清洗京东PIN
   * 从各种格式中提取标准PIN
   */
  cleanPinCode(value: any): string | null {
    const str = this.cleanString(value);
    if (!str) return null;

    // 如果已经是 jd_xxx 格式，提取 xxx
    if (str.startsWith('jd_')) {
      return str.substring(3);
    }

    // 返回原始值
    return str;
  }

  /**
   * 清洗手机号
   * 统一格式为11位数字
   */
  cleanPhone(value: any): string | null {
    const str = this.cleanString(value);
    if (!str) return null;

    // 移除非数字字符
    const digits = str.replace(/\D/g, '');

    // 检查是否为有效手机号
    if (/^1[3-9]\d{9}$/.test(digits)) {
      return digits;
    }

    this.logger.warn(`手机号格式不正确: ${value}`);
    return digits || null;
  }

  /**
   * 清洗身份证号
   * 统一格式
   */
  cleanIdCard(value: any): string | null {
    const str = this.cleanString(value);
    if (!str) return null;

    // 移除非数字和X
    const cleaned = str.toUpperCase().replace(/[^0-9X]/g, '');

    // 检查长度（15位或18位）
    if (cleaned.length === 15 || cleaned.length === 18) {
      return cleaned;
    }

    this.logger.warn(`身份证号格式不正确: ${value}`);
    return cleaned || null;
  }

  /**
   * 清洗期数字段
   */
  cleanInstallments(value: any): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    if (typeof value === 'number') {
      return value;
    }

    const str = String(value).trim().replace(/[^0-9]/g, '');
    const num = parseInt(str);

    return isNaN(num) ? null : num;
  }

  /**
   * 批量清洗数据行
   */
  cleanRow(row: any, mapping: Record<string, string>): any {
    const cleaned: any = {};

    for (const [field, sourceColumn] of Object.entries(mapping)) {
      const rawValue = row[sourceColumn];

      switch (field) {
        case 'pinCode':
          cleaned[field] = this.cleanPinCode(rawValue);
          break;
        case 'customerName':
        case 'collector':
        case 'collectionAgency':
        case 'repaymentMethod':
          cleaned[field] = this.cleanString(rawValue);
          break;
        case 'customerPhone':
          cleaned[field] = this.cleanPhone(rawValue);
          break;
        case 'customerIdcard':
          cleaned[field] = this.cleanIdCard(rawValue);
          break;
        case 'loanPrincipal':
        case 'repaymentAmount':
        case 'couponAmount':
        case 'originalClaim':
        case 'fees':
          cleaned[field] = this.cleanAmount(rawValue);
          break;
        case 'installments':
          cleaned[field] = this.cleanInstallments(rawValue);
          break;
        case 'birthDate':
        case 'loanContractDate':
        case 'loanContractExpiryDate':
        case 'firstOverdueDate':
        case 'firstCompensationDate':
        case 'lastCompensationDate':
        case 'repaymentDate':
          cleaned[field] = this.cleanDate(rawValue);
          break;
        default:
          cleaned[field] = this.cleanString(rawValue);
      }
    }

    return cleaned;
  }
}
