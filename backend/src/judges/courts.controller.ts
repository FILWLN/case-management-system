import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CourtsService } from './courts.service';
import { Court } from './court.entity';

@ApiTags('法院管理')
@Controller('courts')
export class CourtsController {
  constructor(private readonly courtsService: CourtsService) {}

  @Post()
  @ApiOperation({ summary: '创建法院' })
  async create(@Body() data: Partial<Court>): Promise<Court> {
    return this.courtsService.create(data);
  }

  @Get()
  @ApiOperation({ summary: '查询法院列表' })
  async findAll(
    @Query('keyword') keyword?: string,
    @Query('region') region?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.courtsService.findAll({ keyword, region, page, limit });
  }

  @Get('regions')
  @ApiOperation({ summary: '获取地区列表' })
  async getRegions(): Promise<string[]> {
    return this.courtsService.getRegions();
  }

  @Get(':id')
  @ApiOperation({ summary: '查询法院详情' })
  async findOne(@Param('id') id: string): Promise<Court> {
    return this.courtsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新法院' })
  async update(
    @Param('id') id: string,
    @Body() data: Partial<Court>,
  ): Promise<Court> {
    return this.courtsService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除法院' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.courtsService.remove(id);
  }
}
