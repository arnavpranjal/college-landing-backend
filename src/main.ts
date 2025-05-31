// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { PrismaClientExceptionFilter } from './common/filters/prisma-client-exception.filter'; // <--- Import

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS to allow frontend requests
  app.enableCors({
    origin: [
      'http://localhost:3001', // Next.js dev server
      'http://localhost:3000', // Alternative local port
      'https://college-landing-frontend.vercel.app', // Production frontend
      'https://landingpage-frontend.vercel.app', // Alternative frontend URL
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Methods'
    ],
    exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 200,
  });

  // Enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Apply global Prisma exception filter
  // The HttpAdapterHost is needed if your filter extends BaseExceptionFilter,
  // but for a simple filter like this, direct registration is fine.
  // For more complex scenarios, you might get HttpAdapterHost from app.get(HttpAdapterHost)
  app.useGlobalFilters(new PrismaClientExceptionFilter()); // <--- Apply Filter

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();