import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { OutputFileDto } from '@/dto/output-file.dto';
import { InputFileDto } from '@/dto/input-file.dto';
import AggregationService from '@/services/aggregation/aggregation.service';
import { Readable } from 'typeorm/platform/PlatformTools';
import { FileModel } from '@/entities/file.entity';

@ApiTags('File API')
@Controller()
export class FileController {
  constructor(private readonly aggregationService: AggregationService) {}

  @Get()
  @ApiOperation({ description: 'Получить все файлы' })
  @ApiQuery({
    name: 'fileIds',
    required: false,
    description: 'Массив идентификаторов файлов',
    type: [Number],
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Данные успешно получены',
    type: [OutputFileDto],
  })
  getAllFiles(
    @Query('fileIds') fileIds?: number[],
  ): Promise<FileModel[] | undefined> {
    return this.aggregationService.findAll(fileIds);
  }

  @Post(':fileType')
  @ApiOperation({ description: 'Загрузить файлы' })
  @ApiParam({
    name: 'fileType',
    type: String,
    required: true,
    description: 'Тип файла',
  })
  @ApiBody({
    type: [InputFileDto],
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Файл успешно загружен',
    type: [OutputFileDto],
  })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  createTemplate(
    @Param('fileType') fileType: string,
    @Body() inputFile: InputFileDto[],
  ): Promise<(FileModel | undefined)[]> {
    return this.aggregationService.create(fileType, inputFile);
  }

  @Get(':fileId')
  @ApiOperation({ summary: 'Получить файл' })
  @ApiParam({
    name: 'fileId',
    description: 'Идентификатор файла',
    required: true,
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Объект не найден',
  })
  find(@Param('fileId') fileId: number): Promise<Readable | undefined> {
    return this.aggregationService.findFile(fileId);
  }

  @Delete(':fileId')
  @ApiOperation({ summary: 'Удалить файл' })
  @ApiParam({
    name: 'fileId',
    description: 'Идентификатор файла',
    required: true,
    type: Number,
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Файл успешно удален' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Объект не найден',
  })
  async destroy(@Param('fileId') fileId: number): Promise<void> {
    this.aggregationService.destroy(fileId);
  }
}
