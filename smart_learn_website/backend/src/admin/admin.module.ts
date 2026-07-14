import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { UserCleanupCron } from './admin.cron';

@Module({
  imports: [PrismaModule],
  controllers: [AdminController],
  providers: [AdminService, UserCleanupCron],
})

export class AdminModule {}
