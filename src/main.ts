import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from '@/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import multipart from '@fastify/multipart';

const fileLimits = {
  limits: {
    fileSize: 1024 * 1024 * 10,
    fieldNameSize: 100,
    fieldSize: 1000000,
  },
  attachFieldsToBody: true,
};

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  await app.register(multipart, fileLimits);

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('API File service')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin: true,
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3010);
}
bootstrap();
