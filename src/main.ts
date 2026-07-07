import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { appConfig, TAppConfig } from './config/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.setGlobalPrefix('api');

  const config = app.get<TAppConfig>(appConfig.KEY);
  const port = config.port;

  await app.listen(port);

  console.log(`App running on http://localhost:${port}`);
}

void bootstrap();
