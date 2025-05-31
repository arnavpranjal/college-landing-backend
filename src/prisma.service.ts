// src/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      // Optional: Add Prisma client options here if needed
      // log: ['query', 'info', 'warn', 'error'], // Example: logging all queries
    });
  }

  async onModuleInit() {
    // The PrismaClient constructor typically handles the initial connection setup.
    // This explicit call ensures it's connected or initiates the connection.
    await this.$connect();
    console.log('PrismaService has connected to the database.');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('PrismaService has disconnected from the database.');
  }
}
