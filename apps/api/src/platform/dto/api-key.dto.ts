import { IsString, IsArray, IsOptional, IsInt, Min, Max } from 'class-validator';

export class CreateApiKeyDto {
  @IsString()
  name: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  scopes?: string[];

  @IsInt()
  @Min(1)
  @Max(365)
  @IsOptional()
  expiresInDays?: number;
}

export class RotateApiKeyDto {
  @IsInt()
  @Min(0)
  @Max(72)
  @IsOptional()
  gracePeriodHours?: number;
}

export class UpdateApiKeyScopesDto {
  @IsArray()
  @IsString({ each: true })
  scopes: string[];
}
