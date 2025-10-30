import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    console.log('Attempting to connect Prisma...');
    try {
      await this.$connect();
      console.log('Prisma connected successfully!');
    } catch (error) {
      console.error('*** PRISMA CONNECTION FAILED! ***');
      console.error('Check your DATABASE_URL in .env file.');
      console.error(error);
      throw new Error(
        'Database connection failed during module initialization.',
      );
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('Prisma disconnected.');
  }
}
