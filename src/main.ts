import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT } from './config/app';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Request, Response } from 'express';

async function bootstrap () {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('API do desafio PicPay')
    .setDescription(
      'API desenvolvida para o desafio técnico da empresa PicPay',
    )
    .setVersion('1.0')
    .addTag('autenticação')
    .addTag('transferência')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('documentation', app, document);

  const server = app.getHttpAdapter();

  server.get('/', (req: Request, res: Response) => {
    res.redirect('/documentation');
  });

  await app.listen(PORT);
}
bootstrap();
