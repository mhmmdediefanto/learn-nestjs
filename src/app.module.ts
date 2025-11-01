import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './infra/database/prisma.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ToolsModule } from './modules/tools/tools.module';
import { RentalModule } from './modules/rental/rental.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    UserModule,
    AuthModule,
    ToolsModule,
    RentalModule,
  ],
})
export class AppModule {}
