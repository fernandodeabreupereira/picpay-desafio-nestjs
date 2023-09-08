import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function configureSwagger (app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('API do desafio PicPay')
    .setDescription(
      'API desenvolvida para o desafio técnico da empresa PicPay',
    )
    .setVersion('1.0')
    .addTag('autenticacao')
    .addTag('transferencia')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documentation', app, document);
}
