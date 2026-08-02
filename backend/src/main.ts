import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { join } from 'path';
import { AppModule } from './app.module';
import { appConfig, TAppConfig } from './config/app.config';
import { winstonLogger } from './logger/logger.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: winstonLogger,
  });

  app.enableCors({
    origin: ['http://localhost:5173'],
    credentials: true,
  });

  // Статика ДО глобального префикса
  const publicPath = join(process.cwd(), 'public');
  const uploadsPath = join(process.cwd(), 'public', 'uploads');

  console.log('Public path:', publicPath);
  console.log('Uploads path:', uploadsPath);

  app.useStaticAssets(publicPath, { prefix: '/' });
  app.useStaticAssets(uploadsPath, { prefix: '/uploads' });

  app.use(cookieParser());
  app.setGlobalPrefix('api');

  app.useGlobalFilters(new AllExceptionsFilter());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('SkillSwap API')
    .setDescription('API платформы обмена навыками SkillSwap')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, swaggerDocument);

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
  winstonLogger.log(`Swagger docs: http://localhost:${port}/api/docs`);
}

void bootstrap();