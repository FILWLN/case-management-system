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
    
    // 妗堜欢绫诲瀷绛涢€?    if (query.caseType) {
      where.caseType = query.caseType;
    }
    
    // 妗堜欢鐘舵€佺瓫閫夛紙鏂板瓧娈祍tatus锛?    if (query.status) {
      where.status = query.status;
    }
    
    // 鏄惁鐢熸垚鎵ц妗堜欢绛涢€?    if (query.hasExecution !== undefined && query.hasExecution !== '') {
      where.hasExecutionCase = query.hasExecution === 'true' || query.hasExecution === true;
    }
    
    // 鍏抽敭璇嶆悳绱紙妗堝彿/濮撳悕/韬唤璇佸彿锛?    if (query.keyword) {
      const keyword = `%${query.keyword}%`;
      // 浣跨敤QueryBuilder鏀寔澶氬瓧娈垫悳绱?      const qb = this.caseRepository.createQueryBuilder('case')
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
    // 璁剧疆鍒濆鐘舵€?    if (!data.status) {
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
    // 鍋囧垹闄?    await this.caseRepository.update(id, { isDeleted: 1 });
    return { success: true };
  }

  // 鑾峰彇缁熻鏁版嵁
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
