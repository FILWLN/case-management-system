import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Case } from './case.entity';

@Injectable()
export class CasesService {
  constructor(
    @InjectRepository(Case)
    private caseRepository: Repository<Case>,
  ) {}

  async findAll(query: any) {
    const where: any = { isDeleted: 0 };
    
    // 案件类型筛选
    if (query.caseType) {
      where.caseType = query.caseType;
    }
    
    // 案件状态筛选（新字段status）
    if (query.status) {
      where.status = query.status;
    }
    
    // 是否生成执行案件筛选
    if (query.hasExecution !== undefined && query.hasExecution !== '') {
      where.hasExecutionCase = query.hasExecution === 'true' || query.hasExecution === true;
    }
    
    // 关键词搜索（案号/姓名/身份证号）
    if (query.keyword) {
      const keyword = `%${query.keyword}%`;
      // 使用QueryBuilder支持多字段搜索
      const qb = this.caseRepository.createQueryBuilder('case')
        .where('case.isDeleted = :isDeleted', { isDeleted: 0 });
      
      if (query.caseType) {
        qb.andWhere('case.caseType = :caseType', { caseType: query.caseType });
      }
      if (query.status) {
        qb.andWhere('case.status = :status', { status: query.status });
      }
      if (query.hasExecution !== undefined && query.hasExecution !== '') {
        qb.andWhere('case.hasExecutionCase = :hasExecution', { 
          hasExecution: query.hasExecution === 'true' || query.hasExecution === true 
        });
      }
      
      qb.andWhere(
        '(case.caseNo LIKE :keyword OR case.customerName LIKE :keyword OR case.customerIdcard LIKE :keyword)',
        { keyword }
      );
      
      qb.orderBy('case.createdAt', 'DESC')
        .skip(((query.page || 1) - 1) * (query.pageSize || 10))
        .take(query.pageSize || 10);
      
      const [list, total] = await qb.getManyAndCount();
      return { list, total, page: query.page || 1, pageSize: query.pageSize || 10 };
    }

    const [list, total] = await this.caseRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: ((query.page || 1) - 1) * (query.pageSize || 10),
      take: query.pageSize || 10,
    });

    return { list, total, page: query.page || 1, pageSize: query.pageSize || 10 };
  }

  async findOne(id: number) {
    return this.caseRepository.findOne({ 
      where: { id },
      relations: ['installments', 'notes']
    });
  }

  async create(data: Partial<Case>) {
    // 设置初始状态
    if (!data.status) {
      data.status = 'pending';
    }
    const caseItem = this.caseRepository.create(data);
    return this.caseRepository.save(caseItem);
  }

  async update(id: number, data: Partial<Case>) {
    await this.caseRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    // 假删除
    await this.caseRepository.update(id, { isDeleted: 1 });
    return { success: true };
  }

  // 获取统计数据
  async getStats() {
    const total = await this.caseRepository.count({ where: { isDeleted: 0 } });
    const pending = await this.caseRepository.count({ 
      where: { isDeleted: 0, status: 'pending' } 
    });
    const execution = await this.caseRepository.count({ 
      where: { isDeleted: 0, hasExecutionCase: true } 
    });
    const closed = await this.caseRepository.count({ 
      where: { isDeleted: 0, status: 'closed' } 
    });
    
    return { total, pending, execution, closed };
  }
}
