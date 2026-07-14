import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '@/prisma/prisma.service';
import { CardsService } from '@/cards/cards.service';

@Injectable()
export class StreakCronService {
  private readonly logger = new Logger(StreakCronService.name);
  constructor(
    private prisma: PrismaService,
    private cardsService: CardsService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async evaluateDailyStreaks() {
    this.logger.log('Starting midnight streak evaluation...');
    const users = await this.prisma.user.findMany();

    for (const user of users) {
      if (user.streakSecuredToday) {
        await this.prisma.user.update({
          where: { id: user.id },
          data: { streakSecuredToday: false },
        });
      } else {
        const response = await this.cardsService.getDueCardsCount(user.id);
        if (response.currentDueCount > 0) {
          await this.prisma.user.update({
            where: { id: user.id },
            data: {
              currentStreak: 0,
              streakSecuredToday: false,
            },
          });
        }
      }
    }
    
    this.logger.log('Midnight streak evaluation completed.');
  }
}
