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
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Whizlabs API')
    .setDescription('API documentation for Whizlabs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const port = process.env.PORT ?? 4000;
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`, {
    port,
    environment: process.env.NODE_ENV || 'development',
  });
}
bootstrap();
