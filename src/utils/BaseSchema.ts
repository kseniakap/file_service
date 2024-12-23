import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsOptional } from 'class-validator';

export class BaseSchema {
  @IsDate()
  @IsOptional()
  @ApiPropertyOptional()
  createdAt?: Date;

  @IsDate()
  @IsOptional()
  @ApiPropertyOptional()
  updatedAt?: Date;

  @IsDate()
  @IsOptional()
  @ApiPropertyOptional()
  deletedAt?: Date;
}
