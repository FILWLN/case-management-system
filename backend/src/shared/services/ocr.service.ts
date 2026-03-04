import { Injectable } from '@nestjs/common';

export interface OcrResult {
  success: boolean;
  fields: Record<string, string>;
  confidence: number;
  rawText: string;
}

@Injectable()
export class OcrService {
  // 模拟OCR识别（实际项目中需要接入真实的OCR服务）
  async recognizeDocument(imageBase64: string, docType: string): Promise<OcrResult> {
    // TODO: 接入真实OCR服务（如百度OCR、腾讯云OCR、阿里云OCR等）
    // 示例调用:
    // const result = await thirdPartyOcrApi.recognize(imageBase64);
    
    // 模拟返回结果
    return this.mockOcrResult(docType);
  }

  // 从文本中提取字段
  async extractFromText(text: string): Promise<OcrResult> {
    const fields: Record<string, string> = {};
    
    // 提取案号
    const caseNoMatch = text.match(/案号[：:]\s*([\w\-\(\)]+)/);
    if (caseNoMatch) fields.caseNo = caseNoMatch[1];
    
    // 提取姓名
    const nameMatch = text.match(/当事人[：:]\s*([\u4e00-\u9fa5]{2,4})/);
    if (nameMatch) fields.customerName = nameMatch[1];
    
    // 提取身份证号
    const idcardMatch = text.match(/(\d{18}|\d{17}[Xx])/);
    if (idcardMatch) fields.customerIdcard = idcardMatch[1];
    
    // 提取金额
    const amountMatch = text.match(/金额[：:]\s*([\d,\.]+)/);
    if (amountMatch) fields.amount = amountMatch[1].replace(/,/g, '');
    
    // 提取日期
    const dateMatch = text.match(/(\d{4}年\d{1,2}月\d{1,2}日|\d{4}-\d{2}-\d{2})/);
    if (dateMatch) fields.date = dateMatch[1];
    
    return {
      success: Object.keys(fields).length > 0,
      fields,
      confidence: 0.85,
      rawText: text,
    };
  }

  // 解析调解书
  async parseMediationDocument(imageBase64: string): Promise<OcrResult> {
    // 调解书特定字段提取
    const baseResult = await this.recognizeDocument(imageBase64, 'mediation');
    
    // 提取调解书特有字段
    const fields = { ...baseResult.fields };
    
    // 调解金额
    if (!fields.orderAmount) {
      const match = baseResult.rawText.match(/调解[协议确认]*.*?金额[：:]\s*([\d,\.]+)/);
      if (match) fields.orderAmount = match[1].replace(/,/g, '');
    }
    
    // 调解日期
    if (!fields.mediationDate) {
      const match = baseResult.rawText.match(/调解日期[：:]\s*(\d{4}年\d{1,2}月\d{1,2}日)/);
      if (match) fields.mediationDate = match[1];
    }
    
    return {
      ...baseResult,
      fields,
    };
  }

  // 解析判决书
  async parseJudgmentDocument(imageBase64: string): Promise<OcrResult> {
    const baseResult = await this.recognizeDocument(imageBase64, 'judgment');
    
    const fields = { ...baseResult.fields };
    
    // 判决金额
    if (!fields.judgmentAmount) {
      const match = baseResult.rawText.match(/判决.*?(?:被告|债务人).*?支付.*?([\d,\.]+)\s*元/);
      if (match) fields.judgmentAmount = match[1].replace(/,/g, '');
    }
    
    return {
      ...baseResult,
      fields,
    };
  }

  // 模拟OCR结果
  private mockOcrResult(docType: string): OcrResult {
    const mockData: Record<string, Record<string, string>> = {
      mediation: {
        caseNo: 'JD-2024-XXX',
        customerName: '张三',
        customerIdcard: '110101198503151234',
        orderAmount: '50000',
        closeType: '调解',
        closeDate: '2024-03-01',
      },
      judgment: {
        caseNo: 'JD-2024-YYY',
        customerName: '李四',
        customerIdcard: '310101199001012345',
        judgmentAmount: '80000',
        effectiveDate: '2024-03-15',
      },
      idcard: {
        customerName: '王五',
        customerIdcard: '440106197505056789',
        address: '广东省广州市xxx街道',
      },
    };

    return {
      success: true,
      fields: mockData[docType] || {},
      confidence: 0.92,
      rawText: '模拟识别的原始文本内容...',
    };
  }
}
