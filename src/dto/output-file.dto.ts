import { BaseSchema } from '@/utils/BaseSchema';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class OutputFileDto extends BaseSchema {
  @IsNumber()
  @ApiProperty()
  id: number;

  @IsString()
  @ApiProperty({
    description: 'Название файла',
    example: 'file.docx',
  })
  @IsNotEmpty()
  name: string;

  @IsString()
  @ApiProperty({
    description: 'Путь к файлу',
  })
  @IsNotEmpty()
  path: string;

  @IsNumber()
  @ApiProperty({
    description: 'Размер файла в байтах',
    example: null,
    nullable: true,
  })
  size: number | null;

  @IsString()
  @ApiProperty({
    description: 'Тип файла',
  })
  type: string;
}
