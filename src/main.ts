import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import 'reflect-metadata';

async function bootstrap() {
  console.log('DB from env:', process.env.DATABASE_URL);
  console.log('DB name from env:', process.env.POSTGRES_DB);

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()); // Add any global pipes if needed
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
