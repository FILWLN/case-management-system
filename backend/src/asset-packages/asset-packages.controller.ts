import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AssetPackagesService } from './asset-packages.service';

@Controller('asset-packages')
// @UseGuards(AuthGuard('jwt'))  // 临时关闭认证
export class AssetPackagesController {
  constructor(private assetPackagesService: AssetPackagesService) {}

  @Get()
  async findAll(@Query() query) {
    return this.assetPackagesService.findAll(query);
  }

  @Get('stats/summary')
  async getAllStats() {
    // 获取所有资产包汇总统计
    return this.assetPackagesService.findAll({ page: 1, pageSize: 1000 });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.assetPackagesService.findOne(Number(id));
  }

  @Get(':id/stats')
  async getStats(@Param('id') id: string) {
    return this.assetPackagesService.getStats(Number(id));
  }

  @Post('compare')
  async compare(@Body() body: { packageIds: number[] }) {
    return this.assetPackagesService.compare(body.packageIds);
  }

  @Post()
  async create(@Body() data) {
    return this.assetPackagesService.create(data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data) {
    return this.assetPackagesService.update(Number(id), data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.assetPackagesService.remove(Number(id));
  }
}
