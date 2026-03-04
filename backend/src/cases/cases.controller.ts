import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CasesService } from './cases.service';

@Controller('cases')
@UseGuards(AuthGuard('jwt'))
export class CasesController {
  constructor(private casesService: CasesService) {}

  @Get()
  async findAll(@Query() query) {
    return this.casesService.findAll(query);
  }

  @Get('stats/summary')
  async getStats() {
    return this.casesService.getStats();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.casesService.findOne(Number(id));
  }

  @Post()
  async create(@Body() data) {
    return this.casesService.create(data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data) {
    return this.casesService.update(Number(id), data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.casesService.remove(Number(id));
  }
}
