import { Module, forwardRef } from '@nestjs/common';
import { GamificationController } from './gamification.controller';
import { GamificationService } from './gamification.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { StreakCronService } from './streak.con';
import { CardsModule } from '@/cards/cards.module';

@Module({
  imports: [PrismaModule, forwardRef(() => CardsModule)],
  controllers: [GamificationController],
  providers: [GamificationService, StreakCronService],
  exports: [GamificationService],
})

export class GamificationModule {}
