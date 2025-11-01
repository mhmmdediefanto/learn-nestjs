import { Module } from '@nestjs/common';
import { ToolsService } from './tools.service';
import { ToolsController } from './tools.controller';
import { PrismaModule } from 'src/infra/database/prisma.module';

@Module({
  controllers: [ToolsController],
  providers: [ToolsService],
  imports: [PrismaModule],
})
export class ToolsModule {}
