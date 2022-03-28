import { AppModule } from './app.module';
import { ErrorFilter } from './error/error.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { createConnections } from 'typeorm';

async function bootstrap() {
  try {
    await createConnections();
  } catch (error) {
    console.log('Error in DB connection', error);
  }
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('/api');
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new ErrorFilter());
  await app.listen(3000);
}
bootstrap();
