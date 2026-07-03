import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appConfig, TAppConfig } from './config/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get<TAppConfig>(appConfig.KEY);
  const port = config.port;

  await app.listen(port);

  console.log(`App running on http://localhost:${port}`);
}

bootstrap();
