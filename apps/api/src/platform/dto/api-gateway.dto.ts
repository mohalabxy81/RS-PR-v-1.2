import {
  IsString,
  IsOptional,
  IsArray,
  IsUUID,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GenerateApiKeyDto {
  @ApiProperty({ example: 'Production Key' })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({ type: [String], example: ['read:properties', 'write:leads'] })
  @IsArray()
  @IsString({ each: true })
  scopes: string[];
}

export class RegisterOAuthClientDto {
  @ApiProperty({ example: 'My Custom App' })
  @IsString()
  @MinLength(1)
  appName: string;

  @ApiProperty({ type: [String], example: ['https://myapp.com/callback'] })
  @IsArray()
  @IsString({ each: true })
  redirectUris: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;
}

export class CreateApiProductDto {
  @ApiProperty({ example: 'Real Estate Data API' })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;
}

export class CreateApiPlanDto {
  @ApiProperty({ example: 'Basic Tier' })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;
}

export class SubscribeToPlanDto {
  @ApiProperty()
  @IsUUID()
  planId: string;
}
