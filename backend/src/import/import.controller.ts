import { 
  Controller, 
  Post, 
  UploadedFile, 
  UseInterceptors, 
  Get, 
  Res, 
  Body,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { RepaymentImportService } from './repayment-import.service';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('数据导入')
@Controller('import')
export class ImportController {
  constructor(private readonly repaymentImportService: RepaymentImportService) {}

  /**
   * 预览还款数据导入
   */
  @Post('repayments/preview')
  @ApiOperation({ summary: '预览还款导入数据' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Excel文件',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async previewRepayments(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      return { success: false, message: '请上传文件' };
    }
    
    const result = await this.repaymentImportService.previewImport(file.buffer);
    return {
      success: true,
      data: result,
    };
  }

  /**
   * 导入还款数据
   */
  @Post('repayments')
  @ApiOperation({ summary: '导入还款数据' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Excel文件',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async importRepayments(
    @UploadedFile() file: Express.Multer.File,
    @Body('operator') operator: string,
  ) {
    if (!file) {
      return { success: false, message: '请上传文件' };
    }

    const result = await this.repaymentImportService.importRepayments(
      file.buffer,
      operator || 'system',
    );

    return {
      success: true,
      data: result,
      message: `导入完成：成功 ${result.success} 条，失败 ${result.failed} 条`,
    };
  }

  /**
   * 下载还款导入模板
   */
  @Get('repayments/template')
  @ApiOperation({ summary: '下载还款导入模板' })
  async downloadTemplate(@Res() res: Response) {
    const buffer = this.repaymentImportService.generateTemplate();
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=还款导入模板.xlsx');
    res.send(buffer);
  }
}
