import { IsString, IsOptional, IsNumber, IsEnum, IsDateString, Min, Max, Length, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export enum CaseType {
  LITIGATION = 'litigation',
  EXECUTION = 'execution',
  PRESERVATION = 'preservation',
}

export enum CaseStatus {
  PENDING = 'pending',
  FILING = 'filing',
  PRESERVATION = 'preservation',
  MEDIATION = 'mediation',
  JUDGMENT = 'judgment',
  CLOSED = 'closed',
  EXECUTION = 'execution',
  FINISHED = 'finished',
}

export class CreateCaseDto {
  @IsString()
  @Length(1, 100)
  caseNo: string;

  @IsEnum(CaseType)
  caseType: string;

  @IsString()
  @Length(1, 100)
  customerName: string;

  @IsOptional()
  @IsString()
  @Length(0, 100)
  customerIdcard?: string;

  @IsOptional()
  @IsString()
  @Length(0, 100)
  customerPhone?: string;

  @IsOptional()
  @IsEnum(CaseStatus)
  status?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  orderAmount?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  paidAmount?: number;
}

export class UpdateCaseDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  caseNo?: string;

  @IsOptional()
  @IsEnum(CaseStatus)
  status?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  paidAmount?: number;
}

export class QueryCaseDto {
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsEnum(CaseType)
  caseType?: string;

  @IsOptional()
  @IsEnum(CaseStatus)
  status?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  pageSize?: number = 10;
}
