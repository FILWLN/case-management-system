import { Injectable } from '@nestjs/common';

export interface OcrResult {
  success: boolean;
  fields: Record<string, string>;
  confidence: number;
  rawText: string;
}

@Injectable()
export class OcrService {
  // 妯℃嫙OCR璇嗗埆锛堝疄闄呴」鐩腑闇€瑕佹帴鍏ョ湡瀹炵殑OCR鏈嶅姟锛?  async recognizeDocument(imageBase64: string, docType: string): Promise<OcrResult> {
    // TODO: 鎺ュ叆鐪熷疄OCR鏈嶅姟锛堝鐧惧害OCR銆佽吘璁簯OCR銆侀樋閲屼簯OCR绛夛級
    // 绀轰緥璋冪敤:
    // const result = await thirdPartyOcrApi.recognize(imageBase64);
    
    // 妯℃嫙杩斿洖缁撴灉
    return this.mockOcrResult(docType);
  }

  // 浠庢枃鏈腑鎻愬彇瀛楁
  async extractFromText(text: string): Promise<OcrResult> {
    const fields: Record<string, string> = {};
    
    // 鎻愬彇妗堝彿
    const caseNoMatch = text.match(/妗堝彿[锛?]\s*([\w\-\(\)]+)/);
    if (caseNoMatch) fields.caseNo = caseNoMatch[1];
    
    // 鎻愬彇濮撳悕
    const nameMatch = text.match(/褰撲簨浜篬锛?]\s*([\u4e00-\u9fa5]{2,4})/);
    if (nameMatch) fields.customerName = nameMatch[1];
    
    // 鎻愬彇韬唤璇佸彿
    const idcardMatch = text.match(/(\d{18}|\d{17}[Xx])/);
    if (idcardMatch) fields.customerIdcard = idcardMatch[1];
    
    // 鎻愬彇閲戦
    const amountMatch = text.match(/閲戦[锛?]\s*([\d,\.]+)/);
    if (amountMatch) fields.amount = amountMatch[1].replace(/,/g, '');
    
    // 鎻愬彇鏃ユ湡
    const dateMatch = text.match(/(\d{4}骞碶d{1,2}鏈圽d{1,2}鏃\d{4}-\d{2}-\d{2})/);
    if (dateMatch) fields.date = dateMatch[1];
    
    return {
      success: Object.keys(fields).length > 0,
      fields,
      confidence: 0.85,
      rawText: text,
    };
  }

  // 瑙ｆ瀽璋冭В涔?  async parseMediationDocument(imageBase64: string): Promise<OcrResult> {
    // 璋冭В涔︾壒瀹氬瓧娈垫彁鍙?    const baseResult = await this.recognizeDocument(imageBase64, 'mediation');
    
    // 鎻愬彇璋冭В涔︾壒鏈夊瓧娈?    const fields = { ...baseResult.fields };
    
    // 璋冭В閲戦
    if (!fields.orderAmount) {
      const match = baseResult.rawText.match(/璋冭В[鍗忚纭]*.*?閲戦[锛?]\s*([\d,\.]+)/);
      if (match) fields.orderAmount = match[1].replace(/,/g, '');
    }
    
    // 璋冭В鏃ユ湡
    if (!fields.mediationDate) {
      const match = baseResult.rawText.match(/璋冭В鏃ユ湡[锛?]\s*(\d{4}骞碶d{1,2}鏈圽d{1,2}鏃?/);
      if (match) fields.mediationDate = match[1];
    }
    
    return {
      ...baseResult,
      fields,
    };
  }

  // 瑙ｆ瀽鍒ゅ喅涔?  async parseJudgmentDocument(imageBase64: string): Promise<OcrResult> {
    const baseResult = await this.recognizeDocument(imageBase64, 'judgment');
    
    const fields = { ...baseResult.fields };
    
    // 鍒ゅ喅閲戦
    if (!fields.judgmentAmount) {
      const match = baseResult.rawText.match(/鍒ゅ喅.*?(?:琚憡|鍊哄姟浜?.*?鏀粯.*?([\d,\.]+)\s*鍏?);
      if (match) fields.judgmentAmount = match[1].replace(/,/g, '');
    }
    
    return {
      ...baseResult,
      fields,
    };
  }

  // 妯℃嫙OCR缁撴灉
  private mockOcrResult(docType: string): OcrResult {
    const mockData: Record<string, Record<string, string>> = {
      mediation: {
        caseNo: 'JD-2024-XXX',
        customerName: '寮犱笁',
        customerIdcard: '110101198503151234',
        orderAmount: '50000',
        closeType: '璋冭В',
        closeDate: '2024-03-01',
      },
      judgment: {
        caseNo: 'JD-2024-YYY',
        customerName: '鏉庡洓',
        customerIdcard: '310101199001012345',
        judgmentAmount: '80000',
        effectiveDate: '2024-03-15',
      },
      idcard: {
        customerName: '鐜嬩簲',
        customerIdcard: '440106197505056789',
        address: '骞夸笢鐪佸箍宸炲競xxx琛楅亾',
      },
    };

    return {
      success: true,
      fields: mockData[docType] || {},
      confidence: 0.92,
      rawText: '妯℃嫙璇嗗埆鐨勫師濮嬫枃鏈唴瀹?..',
    };
  }
}
