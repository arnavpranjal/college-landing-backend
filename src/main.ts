// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { PrismaClientExceptionFilter } from './common/filters/prisma-client-exception.filter'; // <--- Import

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS - Very explicit configuration
  app.enableCors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      const allowedOrigins = [
        'http://localhost:3001',
        'http://localhost:3000',
        'https://college-landing-frontend.vercel.app',
        'https://landingpage-frontend.vercel.app'
      ];
      
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        // For debugging, allow any origin for now
        callback(null, true);
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'Cache-Control',
      'Pragma'
    ],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 200,
  });

  // Add explicit CORS headers middleware
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
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