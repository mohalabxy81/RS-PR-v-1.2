import {
  IsString,
  IsOptional,
  IsUUID,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterAppDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;
}

export class CreateAppVersionDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  version: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  changelog?: string;
}

export class InstallAppDto {
  @ApiProperty()
  @IsUUID()
  tenantId: string;

  @ApiProperty()
  @IsUUID()
  installedBy: string;
}
