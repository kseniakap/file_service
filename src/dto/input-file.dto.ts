import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class InputFileDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  fieldname?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  originalname?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  encoding?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  mimetype?: string;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  size?: number;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  destination?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  filename?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  path?: string;

  @ApiProperty()
  @ApiPropertyOptional()
  buffer?: Buffer;
}
