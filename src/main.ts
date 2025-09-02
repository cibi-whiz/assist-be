import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { loggerMiddleware } from './middleware/logger.middleware';
import { ZodValidationPipe } from 'nestjs-zod';
import { AllExceptionsFilter } from './middleware/all-exceptions.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ZodValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter());
  app.setGlobalPrefix('api');
  app.use(helmet());
  app.use(loggerMiddleware);

  const config = new DocumentBuilder()
    .setTitle('Whizlabs API')
    .setDescription('API documentation for Whizlabs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
