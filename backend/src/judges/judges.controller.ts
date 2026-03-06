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
import { JudgesService } from './judges.service';
import { Judge, JudgeRole } from './judge.entity';

@ApiTags('法官管理')
@Controller('judges')
export class JudgesController {
  constructor(private readonly judgesService: JudgesService) {}

  @Post()
  @ApiOperation({ summary: '创建法官' })
  async create(@Body() data: Partial<Judge>): Promise<Judge> {
    return this.judgesService.create(data);
  }

  @Get()
  @ApiOperation({ summary: '查询法官列表' })
  async findAll(
    @Query('courtId') courtId?: string,
    @Query('role') role?: JudgeRole,
    @Query('keyword') keyword?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.judgesService.findAll({ courtId, role, keyword, page, limit });
  }

  @Get(':id')
  @ApiOperation({ summary: '查询法官详情' })
  async findOne(@Param('id') id: string): Promise<Judge> {
    return this.judgesService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新法官' })
  async update(
    @Param('id') id: string,
    @Body() data: Partial<Judge>,
  ): Promise<Judge> {
    return this.judgesService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除法官' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.judgesService.remove(id);
  }

  @Get('court/:courtId')
  @ApiOperation({ summary: '获取法院的法官列表' })
  async findByCourt(@Param('courtId') courtId: string): Promise<Judge[]> {
    return this.judgesService.findByCourt(courtId);
  }

  @Get('court/:courtId/options')
  @ApiOperation({ summary: '获取案件法官选项' })
  async getJudgeOptions(@Param('courtId') courtId: string) {
    return this.judgesService.getJudgeOptions(courtId);
  }
}
