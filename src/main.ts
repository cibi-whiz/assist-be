import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { validationPipe } from './middleware/exception-filter.middleware';
import { loggerMiddleware } from './middleware/logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.setGlobalPrefix('api');
  app.use(helmet());
  app.useGlobalPipes(validationPipe);
  app.use(loggerMiddleware);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
