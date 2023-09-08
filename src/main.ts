import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Request, Response } from 'express';
import { AppModule } from './app.module';
import { PORT } from './config/app';
import { configureSwagger } from './config/swagger';

async function bootstrap () {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  configureSwagger(app);

  const server = app.getHttpAdapter();

  server.get('/', (req: Request, res: Response) => {
    res.redirect('/documentation');
  });

  await app.listen(PORT);
}
bootstrap();
