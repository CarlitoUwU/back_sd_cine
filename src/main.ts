import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  }));

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('NestJS Prisma Example')
    .setDescription('API documentation for NestJS with Prisma')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  app.enableCors();

  const port = Number(process.env.PORT);
  await app.listen(Number.isFinite(port) ? port : 3000);
}
bootstrap();
