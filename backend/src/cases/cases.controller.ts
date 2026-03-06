import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CasesService } from './cases.service';
import { CaseJudgeService } from './case-judge.service';

@ApiTags('案件管理')
@Controller('cases')
// @UseGuards(AuthGuard('jwt'))  // 临时关闭认证
export class CasesController {
  constructor(
    private casesService: CasesService,
    private caseJudgeService: CaseJudgeService,
  ) {}

  @Get()
  @ApiOperation({ summary: '查询案件列表' })
  async findAll(@Query() query) {
    return this.casesService.findAll(query);
  }

  @Get('stats/summary')
  @ApiOperation({ summary: '获取案件统计' })
  async getStats() {
    return this.casesService.getStats();
  }

  @Get(':id')
  @ApiOperation({ summary: '查询案件详情' })
  async findOne(@Param('id') id: string) {
    return this.casesService.findOne(Number(id));
  }

  @Post()
  @ApiOperation({ summary: '创建案件' })
  async create(@Body() data) {
    return this.casesService.create(data);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新案件' })
  async update(@Param('id') id: string, @Body() data) {
    return this.casesService.update(Number(id), data);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除案件' })
  async remove(@Param('id') id: string) {
    return this.casesService.remove(Number(id));
  }

  // ========== 案件法官管理 ==========

  @Get(':id/judges')
  @ApiOperation({ summary: '获取案件法官信息' })
  async getCaseJudges(@Param('id') id: string) {
    return this.caseJudgeService.getCaseJudges(id);
  }

  @Put(':id/judges')
  @ApiOperation({ summary: '设置案件法官' })
  async setCaseJudges(
    @Param('id') id: string,
    @Body() data: {
      primaryJudge?: string;
      assistant?: string;
      clerk?: string;
    },
    @Body('operator') operator: string,
  ) {
    return this.caseJudgeService.setCaseJudges(id, data, operator || 'system');
  }

  @Get(':id/judges/options')
  @ApiOperation({ summary: '获取可用法官选项' })
  async getJudgeOptions(@Param('id') id: string) {
    // 先获取案件的法院
    const caseData = await this.casesService.findOne(Number(id));
    if (!caseData?.courtName) {
      // 如果没有法院信息，返回空
      return { primaryJudges: [], assistants: [], clerks: [] };
    }
    
    // 通过法院名称查找法院ID
    // 这里简化处理，实际应该通过courtId关联
    return { primaryJudges: [], assistants: [], clerks: [] };
  }
}
