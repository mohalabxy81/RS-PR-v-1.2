import {
  IsString,
  IsOptional,
  IsBoolean,
  IsUUID,
  IsNumber,
  MinLength,
  IsUrl,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { AiProviderType } from '@prisma/client';

export class CreateAiProviderDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({ enum: AiProviderType })
  @IsString()
  type: AiProviderType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  baseUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  apiKey?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class CreateAiModelDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  modelIdentifier: string;

  @ApiProperty()
  @IsUUID()
  providerId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  capabilities?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  maxTokens?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  costPer1kTokens?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class CreateAiPromptDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty()
  @IsString()
  category: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;
}

export class CreatePromptVersionDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  content: string;
}
