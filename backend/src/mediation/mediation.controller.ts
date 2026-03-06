import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { MediationService, MediationRecordDto } from './mediation.service';

@ApiTags('调解员工作台')
@Controller('mediation')
export class MediationController {
  constructor(private readonly mediationService: MediationService) {}

  /**
   * 获取调解员的案件列表
   */
  @Get('cases')
  @ApiOperation({ summary: '获取调解案件列表' })
  async getMediationCases(
    @Query('mediatorName') mediatorName: string,
    @Query('status') status?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    if (!mediatorName) {
      return { success: false, message: '请提供调解员姓名' };
    }
    
    const result = await this.mediationService.getMediationCases(
      mediatorName,
      { status, page, limit },
    );
    
    return {
      success: true,
      data: result,
    };
  }

  /**
   * 获取待调解案件列表
   */
  @Get('pending')
  @ApiOperation({ summary: '获取待调解案件列表' })
  async getPendingCases(
    @Query('courtId') courtId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const result = await this.mediationService.getPendingMediationCases({
      courtId,
      page,
      limit,
    });
    
    return {
      success: true,
      data: result,
    };
  }

  /**
   * 记录调解结果
   */
  @Post('record')
  @ApiOperation({ summary: '记录调解结果' })
  async recordMediationResult(
    @Body() data: MediationRecordDto,
    @Body('operator') operator: string,
  ) {
    const result = await this.mediationService.recordMediationResult(
      data,
      operator || 'system',
    );
    
    return {
      success: true,
      data: result,
      message: '调解结果已记录',
    };
  }

  /**
   * 获取调解统计
   */
  @Get('stats')
  @ApiOperation({ summary: '获取调解统计' })
  async getMediationStats(
    @Query('mediatorName') mediatorName: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    if (!mediatorName) {
      return { success: false, message: '请提供调解员姓名' };
    }

    const start = startDate ? new Date(startDate) : new Date();
    const end = endDate ? new Date(endDate) : new Date();
    
    const stats = await this.mediationService.getMediationStats(
      mediatorName,
      start,
      end,
    );
    
    return {
      success: true,
      data: stats,
    };
  }

  /**
   * 分配调解员
   */
  @Put('assign/:caseId')
  @ApiOperation({ summary: '分配调解员' })
  async assignMediator(
    @Param('caseId') caseId: string,
    @Body('mediatorName') mediatorName: string,
    @Body('operator') operator: string,
  ) {
    if (!mediatorName) {
      return { success: false, message: '请提供调解员姓名' };
    }

    const result = await this.mediationService.assignMediator(
      caseId,
      mediatorName,
      operator || 'system',
    );
    
    return {
      success: true,
      data: result,
      message: '调解员分配成功',
    };
  }
}
