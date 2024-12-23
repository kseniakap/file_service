import { Inject, Injectable } from '@nestjs/common';
import { Readable } from 'stream';
import path from 'path';
import FilePersistenceService from '@/services/filePersistence/filePersistence.service';
import { FileInterface } from '@/types/file.types';
import { v4 as uuidv4 } from 'uuid';
import { InputFileDto } from '@/dto/input-file.dto';
import LocalService from '@/services/local/local.service';

@Injectable()
export default class AggregationService {
  constructor(
    private readonly filePersistenceService: FilePersistenceService,
    @Inject('MinioService') private readonly minioService: FileInterface,
    @Inject('LocalService') private readonly localService: LocalService,
  ) {}

  async findAll(ids?: number[]) {
    if (ids?.length) {
      return this.filePersistenceService.findByIds(ids);
    }
    return this.filePersistenceService.findAll();
  }

  async findFile(id: number) {
    const file = await this.filePersistenceService.find(id);
    try {
      const result = await this.minioService.getStreamFile(
        file.path,
        file.type,
      );
      return result;
    } catch {
      return await this.localService.getStreamFile(file.path, file.type);
    }
  }

  async findFilesByIds(ids: number[]) {
    const files = await this.filePersistenceService.findByIds(ids);
    try {
      const result: Readable[] = [];
      files?.forEach(async (file) => {
        const minioFile = await this.minioService.getStreamFile(
          file.path,
          file.type,
        );
        result.push(minioFile);
      });
      return result;
    } catch {
      const result: Readable[] = [];
      files?.forEach(async (file) => {
        const localFile = await this.localService.getStreamFile(
          file.path,
          file.type,
        );
        result.push(localFile);
      });
      return result;
    }
  }

  async create(fileType: string, files: InputFileDto[]) {
    const createdFiles = files.map(async (file) => {
      if (!file.originalname || !file.buffer) {
        throw new Error('Некорректный файл');
      }
      const fileName = `${file.fieldname}-${uuidv4()}${path.extname(file.originalname)}`;
      const fileBuffer = Buffer.from(file.buffer);
      try {
        await this.minioService.sendFile(fileType, fileName, fileBuffer);
      } catch {
        await this.localService.sendFile(fileType, fileName, fileBuffer);
      }
      return this.filePersistenceService.create(
        fileName,
        file.originalname,
        fileBuffer.byteLength,
        fileType,
      );
    });
    return Promise.all(createdFiles);
  }

  async destroy(id: number) {
    const file = await this.filePersistenceService.find(id);
    try {
      await this.minioService.deleteFile(file.path, file.type);
    } catch {
      await this.localService.deleteFile(file.path, file.type);
    }
    this.filePersistenceService.destroy(file);
  }
}
