import { forwardRef, Module } from '@nestjs/common';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { SpacedRepetitionModule } from '@/spaced-repetition/spaced-repetition.module';
import { GamificationModule } from '@/gamification/gamification.module';

@Module({
  imports: [
    PrismaModule,
    SpacedRepetitionModule,
    forwardRef(() => GamificationModule),
  ],
  controllers: [CardsController],
  providers: [CardsService],
  exports: [CardsService],
})

export class CardsModule {}
