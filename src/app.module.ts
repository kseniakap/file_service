import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileModel } from '@/entities/file.entity';
import { FileController } from '@/controllers/file.controller';
import FilePersistenceService from '@/services/filePersistence/filePersistence.service';
import MinioService from '@/services/minio/minio.service';
import AggregationService from '@/services/aggregation/aggregation.service';

import { envSchema } from '@/config/envSchema.config';

import { TaskService } from '@/services/task/task.service';
import { ScheduleModule } from '@nestjs/schedule';
import LocalService from '@/services/local/local.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '@/guard/auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: envSchema,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [FileModel],
    }),
    TypeOrmModule.forFeature([FileModel]),
    ScheduleModule.forRoot(),
  ],
  controllers: [FileController],
  providers: [
    FilePersistenceService,
    AggregationService,
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: 'MinioService', useClass: MinioService },
    { provide: 'LocalService', useClass: LocalService },
    TaskService,
  ],
})
export class AppModule {}
