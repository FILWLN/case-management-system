import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Court } from './court.entity';

@Injectable()
export class CourtsService {
  private readonly logger = new Logger(CourtsService.name);

  constructor(
    @InjectRepository(Court)
    private courtRepo: Repository<Court>,
  ) {}

  /**
   * 创建法院
   */
  async create(data: Partial<Court>): Promise<Court> {
    const court = this.courtRepo.create(data);
    return this.courtRepo.save(court);
  }

  /**
   * 查询法院列表
   */
  async findAll(query: {
    keyword?: string;
    region?: string;
    page?: number;
    limit?: number;
  }): Promise<{ list: Court[]; total: number }> {
    const { keyword, region, page = 1, limit = 20 } = query;

    const where: any = {};

    if (keyword) {
      where.name = Like(`%${keyword}%`);
    }

    if (region) {
      where.region = Like(`%${region}%`);
    }

    const [list, total] = await this.courtRepo.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { list, total };
  }

  /**
   * 查询法院详情
   */
  async findOne(id: string): Promise<Court> {
    const court = await this.courtRepo.findOne({
      where: { id },
      relations: ['judges'],
    });

    if (!court) {
      throw new NotFoundException('法院不存在');
    }

    return court;
  }

  /**
   * 更新法院
   */
  async update(id: string, data: Partial<Court>): Promise<Court> {
    const court = await this.findOne(id);
    Object.assign(court, data);
    return this.courtRepo.save(court);
  }

  /**
   * 删除法院
   */
  async remove(id: string): Promise<void> {
    const court = await this.findOne(id);
    await this.courtRepo.remove(court);
  }

  /**
   * 获取所有地区列表
   */
  async getRegions(): Promise<string[]> {
    const courts = await this.courtRepo.find({
      select: ['region'],
      where: { region: Like('%') },
    });
    
    const regions = courts
      .map(c => c.region)
      .filter((v, i, a) => a.indexOf(v) === i); // 去重
    
    return regions;
  }
}
