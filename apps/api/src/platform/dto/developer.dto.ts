import {
  IsString,
  IsOptional,
  IsUUID,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDeveloperDto {
  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  website?: string;
}

export class CreateOrganizationDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  name: string;
}

export class CreateTeamDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  name: string;
}

export class CreateProjectDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;
}
