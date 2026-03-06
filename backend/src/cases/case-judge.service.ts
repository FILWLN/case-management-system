import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Case } from './case.entity';
import { JudgesService } from '../judges/judges.service';
import { JudgeInfo } from './case.entity';

/**
 * 案件法官关联服务
 * 管理案件与法官的关联关系
 */
@Injectable()
export class CaseJudgeService {
  private readonly logger = new Logger(CaseJudgeService.name);

  constructor(
    @InjectRepository(Case)
    private caseRepo: Repository<Case>,
    private judgesService: JudgesService,
  ) {}

  /**
   * 设置案件的法官信息
   */
  async setCaseJudges(
    caseId: string,
    judgeInfo: Partial<JudgeInfo>,
    operator: string,
  ): Promise<Case> {
    const caseData = await this.caseRepo.findOne({ where: { id: caseId } });
    
    if (!caseData) {
      throw new NotFoundException('案件不存在');
    }

    // 验证法官是否存在
    if (judgeInfo.primaryJudge) {
      await this.judgesService.findOne(judgeInfo.primaryJudge);
    }
    if (judgeInfo.assistant) {
      await this.judgesService.findOne(judgeInfo.assistant);
    }
    if (judgeInfo.clerk) {
      await this.judgesService.findOne(judgeInfo.clerk);
    }

    // 更新法官信息
    caseData.judgeInfo = {
      ...caseData.judgeInfo,
      ...judgeInfo,
    } as JudgeInfo;

    caseData.updatedBy = operator;

    return this.caseRepo.save(caseData);
  }

  /**
   * 获取案件的法官信息
   */
  async getCaseJudges(caseId: string): Promise<{
    judgeInfo: JudgeInfo | null;
    details: {
      primaryJudge?: any;
      assistant?: any;
      clerk?: any;
    };
  }> {
    const caseData = await this.caseRepo.findOne({ where: { id: caseId } });
    
    if (!caseData) {
      throw new NotFoundException('案件不存在');
    }

    const judgeInfo = caseData.judgeInfo;
    const details: any = {};

    if (judgeInfo?.primaryJudge) {
      try {
        details.primaryJudge = await this.judgesService.findOne(judgeInfo.primaryJudge);
      } catch {
        details.primaryJudge = null;
      }
    }

    if (judgeInfo?.assistant) {
      try {
        details.assistant = await this.judgesService.findOne(judgeInfo.assistant);
      } catch {
        details.assistant = null;
      }
    }

    if (judgeInfo?.clerk) {
      try {
        details.clerk = await this.judgesService.findOne(judgeInfo.clerk);
      } catch {
        details.clerk = null;
      }
    }

    return {
      judgeInfo,
      details,
    };
  }

  /**
   * 通过法院获取可用的法官选项
   */
  async getAvailableJudges(courtId: string): Promise<{
    primaryJudges: any[];
    assistants: any[];
    clerks: any[];
  }> {
    return this.judgesService.getJudgeOptions(courtId);
  }

  /**
   * 批量更新案件法官
   */
  async batchUpdateJudges(
    caseIds: string[],
    judgeInfo: Partial<JudgeInfo>,
    operator: string,
  ): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    for (const caseId of caseIds) {
      try {
        await this.setCaseJudges(caseId, judgeInfo, operator);
        success++;
      } catch (error) {
        this.logger.error(`更新案件 ${caseId} 法官失败`, error);
        failed++;
      }
    }

    return { success, failed };
  }
}
