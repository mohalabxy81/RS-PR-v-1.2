import {
  IsString,
  IsOptional,
  IsArray,
  IsUrl,
  IsBoolean,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterWebhookDto {
  @ApiProperty()
  @IsUrl()
  url: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  events: string[];
}

export class UpdateWebhookDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  url?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  events?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
