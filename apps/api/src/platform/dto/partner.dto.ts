import {
  IsString,
  IsOptional,
  IsUUID,
  IsNumber,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterPartnerDto {
  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  companyName: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  partnerType: string;
}

export class UpdatePartnerDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
  companyName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
  partnerType?: string;
}

export class CreateProgramDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty()
  @IsNumber()
  commissionRate: number;
}
