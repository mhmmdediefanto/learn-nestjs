import { defineConfig, env } from 'prisma/config';
import dotEnv from 'dotenv';
dotEnv.config();

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  engine: 'classic',
  datasource: {
    url: env('DATABASE_URL'),
  },
});
