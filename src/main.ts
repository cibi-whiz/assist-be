import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { loggerMiddleware } from './middleware/logger.middleware';
import { ZodValidationPipe } from 'nestjs-zod';
import { AllExceptionsFilter } from './middleware/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ZodValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter());
  app.setGlobalPrefix('api');
  app.use(helmet());
  app.use(loggerMiddleware);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
