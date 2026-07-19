import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { appConfig, TAppConfig } from './config/app.config';
import { winstonLogger } from './logger/logger.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: winstonLogger,
  });

  app.use(cookieParser());
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new AllExceptionsFilter());

  // Настройка Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('SkillSwap API')
    .setDescription('Платформа обмена навыками «Я научу / Хочу научиться»')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);
  // Конец настройки Swagger

  const config = app.get<TAppConfig>(appConfig.KEY);
  const port = config.port;

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  await app.listen(port);

  winstonLogger.log(`App running on http://localhost:${port}`);
}

void bootstrap();
