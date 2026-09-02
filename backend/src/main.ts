import { NestFactory, Reflector } from '@nestjs/core';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { join } from 'path';
import { mkdirSync } from 'fs';
import type { Express } from 'express';
import express from 'express';
import { AppModule } from './app.module';
import { nestCorsOrigin } from './config/cors.config';
import { winstonLogger } from './logger/logger.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

let cachedServer: Express | undefined;

export async function createExpressServer(): Promise<Express> {
  if (cachedServer) {
    return cachedServer;
  }

  const expressApp = express();
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(expressApp),
    { logger: winstonLogger },
  );

  app.use(helmet());

  app.enableCors({
    origin: nestCorsOrigin,
    credentials: true,
  });

  const publicPath = join(process.cwd(), 'public');
  const uploadsPath = join(process.cwd(), 'public', 'uploads');
  try {
    mkdirSync(uploadsPath, { recursive: true });
    app.useStaticAssets(publicPath, { prefix: '/' });
    app.useStaticAssets(uploadsPath, { prefix: '/uploads' });
  } catch {
    // Vercel serverless filesystem is read-only except /tmp
  }

  app.use(cookieParser());
  app.setGlobalPrefix('api');

  app.useGlobalFilters(new AllExceptionsFilter());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('SkillSwap API')
    .setDescription('SkillSwap skill exchange platform API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, swaggerDocument);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  await app.init();
  cachedServer = expressApp;
  return expressApp;
}

async function bootstrap() {
  const server = await createExpressServer();
  const port = Number(process.env.PORT) || 3000;

  await new Promise<void>((resolve) => {
    server.listen(port, () => resolve());
  });

  winstonLogger.log(`App running on http://localhost:${port}`);
  winstonLogger.log(`Swagger docs: http://localhost:${port}/api/docs`);
}

if (!process.env.VERCEL) {
  void bootstrap();
}
