import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Judge, JudgeRole } from './judge.entity';
import { Court } from './court.entity';

@Injectable()
export class JudgesService {
  private readonly logger = new Logger(JudgesService.name);

  constructor(
    @InjectRepository(Judge)
    private judgeRepo: Repository<Judge>,
    @InjectRepository(Court)
    private courtRepo: Repository<Court>,
  ) {}

  /**
   * 创建法官
   */
  async create(data: Partial<Judge>): Promise<Judge> {
    // 验证法院是否存在
    if (data.courtId) {
      const court = await this.courtRepo.findOne({ where: { id: data.courtId } });
      if (!court) {
        throw new NotFoundException('法院不存在');
      }
    }

    const judge = this.judgeRepo.create(data);
    return this.judgeRepo.save(judge);
  }

  /**
   * 查询法官列表
   */
  async findAll(query: {
    courtId?: string;
    role?: JudgeRole;
    keyword?: string;
    page?: number;
    limit?: number;
  }): Promise<{ list: Judge[]; total: number }> {
    const { courtId, role, keyword, page = 1, limit = 20 } = query;

    const where: any = {};

    if (courtId) {
      where.courtId = courtId;
    }

    if (role) {
      where.role = role;
    }

    if (keyword) {
      where.name = Like(`%${keyword}%`);
    }

    const [list, total] = await this.judgeRepo.findAndCount({
      where,
      relations: ['court'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { list, total };
  }

  /**
   * 查询法官详情
   */
  async findOne(id: string): Promise<Judge> {
    const judge = await this.judgeRepo.findOne({
      where: { id },
      relations: ['court'],
    });

    if (!judge) {
      throw new NotFoundException('法官不存在');
    }

    return judge;
  }

  /**
   * 更新法官
   */
  async update(id: string, data: Partial<Judge>): Promise<Judge> {
    const judge = await this.findOne(id);

    // 验证法院是否存在
    if (data.courtId) {
      const court = await this.courtRepo.findOne({ where: { id: data.courtId } });
      if (!court) {
        throw new NotFoundException('法院不存在');
      }
    }

    Object.assign(judge, data);
    return this.judgeRepo.save(judge);
  }

  /**
   * 删除法官
   */
  async remove(id: string): Promise<void> {
    const judge = await this.findOne(id);
    await this.judgeRepo.remove(judge);
  }

  /**
   * 根据法院获取法官列表
   */
  async findByCourt(courtId: string): Promise<Judge[]> {
    return this.judgeRepo.find({
      where: { courtId, isActive: true },
      order: { role: 'ASC', name: 'ASC' },
    });
  }

  /**
   * 获取案件所需的法官配置（承办法官+助理+书记员）
   */
  async getJudgeOptions(courtId: string): Promise<{
    primaryJudges: Judge[];
    assistants: Judge[];
    clerks: Judge[];
  }> {
    const judges = await this.findByCourt(courtId);

    return {
      primaryJudges: judges.filter(j => j.role === JudgeRole.PRIMARY),
      assistants: judges.filter(j => j.role === JudgeRole.ASSISTANT),
      clerks: judges.filter(j => j.role === JudgeRole.CLERK),
    };
  }

  /**
   * 批量创建法官
   */
  async batchCreate(data: Partial<Judge>[]): Promise<Judge[]> {
    const judges = this.judgeRepo.create(data);
    return this.judgeRepo.save(judges);
  }
}
