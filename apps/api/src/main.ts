import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Varco API')
    .setDescription('API REST — catalogo, matrice obblighi, checklist, documenti, partner')
    .setVersion('0.1.0')
    .addTag('health')
    .addTag('organizations')
    .addTag('catalog')
    .addTag('skus')
    .addTag('documents')
    .addTag('checklist')
    .addTag('partner')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = Number(process.env.API_PORT ?? 3001);
  await app.listen(port);
  console.log(`[api] NestJS in ascolto su http://localhost:${port}`);
  console.log(`[api] OpenAPI: http://localhost:${port}/api/docs`);
}

void bootstrap();
