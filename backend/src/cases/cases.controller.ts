import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CasesService } from './cases.service';
import { CaseJudgeService } from './case-judge.service';
import { FreezeService } from './freeze.service';
import { RecoveryHistoryService } from './recovery-history.service';

@ApiTags('案件管理')
@Controller('cases')
// @UseGuards(AuthGuard('jwt'))  // 临时关闭认证
export class CasesController {
  constructor(
    private casesService: CasesService,
    private caseJudgeService: CaseJudgeService,
    private freezeService: FreezeService,
    private recoveryHistoryService: RecoveryHistoryService,
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

  // ========== 冻结管理 ==========

  @Put(':id/freeze/no-freeze')
  @ApiOperation({ summary: '标记无需冻结' })
  async markNoFreeze(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @Body('operator') operator: string,
  ) {
    const result = await this.freezeService.markNoFreeze(
      id,
      reason || '已协商无需冻结',
      operator || 'system',
    );
    return {
      success: true,
      data: result,
      message: '已标记为无需冻结',
    };
  }

  @Put(':id/freeze/frozen')
  @ApiOperation({ summary: '标记已冻结' })
  async markFrozen(
    @Param('id') id: string,
    @Body('freezeAmount') freezeAmount: number,
    @Body('freezeDate') freezeDate: Date,
    @Body('operator') operator: string,
  ) {
    const result = await this.freezeService.markFrozen(
      id,
      freezeAmount,
      freezeDate || new Date(),
      operator || 'system',
    );
    return {
      success: true,
      data: result,
      message: '已标记为已冻结',
    };
  }

  @Put(':id/freeze/unfreeze')
  @ApiOperation({ summary: '解冻案件' })
  async unfreeze(
    @Param('id') id: string,
    @Body('unfreezeDate') unfreezeDate: Date,
    @Body('operator') operator: string,
  ) {
    const result = await this.freezeService.unfreeze(
      id,
      unfreezeDate || new Date(),
      operator || 'system',
    );
    return {
      success: true,
      data: result,
      message: '案件已解冻',
    };
  }

  @Put(':id/freeze/actual-amount')
  @ApiOperation({ summary: '更新实际冻结金额' })
  async updateActualFreezeAmount(
    @Param('id') id: string,
    @Body('actualAmount') actualAmount: number,
    @Body('operator') operator: string,
  ) {
    const result = await this.freezeService.updateActualFreezeAmount(
      id,
      actualAmount,
      operator || 'system',
    );
    return {
      success: true,
      data: result,
      message: '实际冻结金额已更新',
    };
  }

  @Get('freeze/no-freeze')
  @ApiOperation({ summary: '获取无需冻结案件列表' })
  async getNoFreezeCases() {
    const list = await this.freezeService.getNoFreezeCases();
    return {
      success: true,
      data: list,
    };
  }

  @Get('freeze/frozen')
  @ApiOperation({ summary: '获取已冻结案件列表' })
  async getFrozenCases() {
    const list = await this.freezeService.getFrozenCases();
    return {
      success: true,
      data: list,
    };
  }

  @Get(':id/freeze/check')
  @ApiOperation({ summary: '检查案件是否需要冻结' })
  async checkFreezeRequirement(@Param('id') id: string) {
    const result = await this.freezeService.checkFreezeRequirement(id);
    return {
      success: true,
      data: result,
    };
  }

  // ========== 执恢历史 ==========

  @Get(':id/recovery/history')
  @ApiOperation({ summary: '获取执恢历史记录' })
  async getRecoveryHistory(@Param('id') id: string) {
    const history = await this.recoveryHistoryService.getRecoveryHistory(id);
    return {
      success: true,
      data: history,
    };
  }

  @Post(':id/recovery')
  @ApiOperation({ summary: '创建执恢案件' })
  async createRecoveryCase(
    @Param('id') id: string,
    @Body() data: {
      recoveryCaseNo: string;
      amount: number;
      filingDate: Date;
    },
    @Body('operator') operator: string,
  ) {
    const result = await this.recoveryHistoryService.createRecoveryCase(
      id,
      data,
      operator || 'system',
    );
    return {
      success: true,
      data: result,
      message: '执恢案件已创建',
    };
  }
}
