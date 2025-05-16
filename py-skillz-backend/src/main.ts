import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
//import { ValidationPipe } from '@nestjs/common';
import { I18nValidationPipe, I18nValidationExceptionFilter } from 'nestjs-i18n';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: process.env.CORS_ORIGIN,
  });
  app.useGlobalPipes(new I18nValidationPipe());
  app.useGlobalFilters(
    new I18nValidationExceptionFilter({
      detailedErrors: false,
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('Py Skillz API')
    .setDescription('Py Skillz API')
    .setVersion('1.0')
    .addTag('Py Skillz')
    .build();

  const documentFactory = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
