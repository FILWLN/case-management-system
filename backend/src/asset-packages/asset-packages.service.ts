import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssetPackage } from './asset-package.entity';

@Injectable()
export class AssetPackagesService {
  constructor(
    @InjectRepository(AssetPackage)
    private assetPackageRepository: Repository<AssetPackage>,
  ) {}

  async findAll(query: any) {
    const where: any = { isDeleted: 0 };
    
    if (query.keyword) {
      where.packageName = Like(`%${query.keyword}%`);
    }

    const [list, total] = await this.assetPackageRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: ((query.page || 1) - 1) * (query.pageSize || 10),
      take: query.pageSize || 10,
      relations: ['cases'],
    });

    return { list, total, page: query.page || 1, pageSize: query.pageSize || 10 };
  }

  async findOne(id: number) {
    return this.assetPackageRepository.findOne({
      where: { id },
      relations: ['cases'],
    });
  }

  async create(data: Partial<AssetPackage>) {
    const pkg = this.assetPackageRepository.create(data);
    return this.assetPackageRepository.save(pkg);
  }

  async update(id: number, data: Partial<AssetPackage>) {
    await this.assetPackageRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.assetPackageRepository.update(id, { isDeleted: 1 });
    return { success: true };
  }

  // 获取资产包统计数据
  async getStats(id: number) {
    const pkg = await this.findOne(id);
    if (!pkg) return null;

    // 计算统计数据
    const stats = {
      totalCases: pkg.cases?.length || 0,
      totalAmount: pkg.totalAmount,
      shouldRepayAmount: pkg.shouldRepayAmount,
      actualRepayAmount: pkg.actualRepayAmount,
      overdueAmount: pkg.overdueAmount,
      recoveryRate: pkg.recoveryRate,
      // 按状态分布
      statusDistribution: this.calculateStatusDistribution(pkg.cases || []),
      // 按月趋势
      monthlyTrend: await this.calculateMonthlyTrend(id),
    };

    return stats;
  }

  // 对比多个资产包
  async compare(packageIds: number[]) {
    const packages = await this.assetPackageRepository.findByIds(packageIds);
    return packages.map(pkg => ({
      id: pkg.id,
      packageNo: pkg.packageNo,
      packageName: pkg.packageName,
      totalCases: pkg.totalCases,
      totalAmount: pkg.totalAmount,
      recoveryRate: pkg.recoveryRate,
      overdueAmount: pkg.overdueAmount,
    }));
  }

  private calculateStatusDistribution(cases: any[]) {
    const distribution = {
      pending: 0,
      closed: 0,
      execution: 0,
      finished: 0,
      overdue: 0,
    };

    cases.forEach(c => {
      if (c.status === 'finished') distribution.finished++;
      else if (c.status === 'execution') distribution.execution++;
      else if (c.status === 'closed') distribution.closed++;
      else if (c.status === 'pending') distribution.pending++;
      // 逾期判断逻辑
    });

    return distribution;
  }

  private async calculateMonthlyTrend(packageId: number) {
    // 按月统计应还vs实还
    // TODO: 实现月度趋势统计
    return [];
  }
}
