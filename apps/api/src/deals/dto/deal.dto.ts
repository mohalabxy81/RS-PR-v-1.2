import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsUUID,
  IsDateString,
  Min,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { DealStage } from '@prisma/client';

export class CreateDealDto {
  @ApiProperty({ example: 'Downtown Apartment Deal' })
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  title: string;

  @ApiProperty({ example: 1200000 })
  @IsNumber()
  @Min(0)
  value: number;

  @ApiPropertyOptional({ example: 'AED' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  currency?: string;

  @ApiPropertyOptional({ enum: DealStage })
  @IsOptional()
  @IsEnum(DealStage)
  stage?: DealStage;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  customerId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  leadId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  propertyId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  assigneeId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  forecastCloseDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateDealDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  value?: number;

  @ApiPropertyOptional({ enum: DealStage })
  @IsOptional()
  @IsEnum(DealStage)
  stage?: DealStage;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  customerId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  propertyId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  assigneeId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  forecastCloseDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateDealStageDto {
  @ApiProperty({ enum: DealStage })
  @IsEnum(DealStage)
  stage: DealStage;
}

export class AddDealNoteDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  content: string;
}

export class QueryDealDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 20;

  @ApiPropertyOptional({ enum: DealStage })
  @IsOptional()
  @IsEnum(DealStage)
  stage?: DealStage;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  assigneeId?: string;

  @ApiPropertyOptional({ example: 'Downtown' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;
}
