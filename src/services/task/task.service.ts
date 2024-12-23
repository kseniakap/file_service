import * as path from 'path';
import * as fs from 'fs/promises';
import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FileInterface } from '@/types/file.types';

@Injectable()
export class TaskService {
  constructor(
    @Inject('MinioService') private readonly minioService: FileInterface,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron(): Promise<void> {
    const localFilesDir =
      process.env.PATH_UPLOADS || path.join(__dirname, 'src', 'files');

    try {
      const fileTypes = await fs.readdir(localFilesDir);

      if (!fileTypes.length) {
        return;
      }

      await Promise.all(
        fileTypes.map(async (fileType) => {
          const directoryPath = path.join(localFilesDir, fileType);

          try {
            const files = await fs.readdir(directoryPath);

            if (!files.length) {
              return;
            }

            await Promise.all(
              files.map(async (fileName) => {
                const filePath = path.join(directoryPath, fileName);

                try {
                  const fileBuffer = await fs.readFile(filePath);
                  await this.minioService.sendFile(
                    fileType,
                    fileName,
                    fileBuffer,
                  );

                  await fs.unlink(filePath);
                } catch (error) {
                  console.error(
                    `Ошибка при загрузке файла ${fileName} в Minio:`,
                    error,
                  );
                }
              }),
            );
          } catch (error) {
            console.error(
              `Ошибка при чтении файлов из директории ${directoryPath}:`,
              error,
            );
          }
        }),
      );
    } catch (error) {
      console.error(
        `Ошибка при чтении типов файлов из директории ${localFilesDir}:`,
        error,
      );
    }
  }
}
