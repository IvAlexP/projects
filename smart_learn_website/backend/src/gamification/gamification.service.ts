import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CardsService } from '@/cards/cards.service';
import { Badge } from '@prisma/client';
import { GAME_RULES } from './gamification.constants';

@Injectable()
export class GamificationService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => CardsService))
    private cardsService: CardsService,
  ) {}

  async recordDailyCheckIn(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    if (user.streakSecuredToday) {
      return { success: true, alreadySecured: true, newBadges: [] };
    }

    const response = await this.cardsService.getDueCardsCount(userId);
    if (response.currentDueCount > 0) {
      return {
        success: true,
        alreadySecured: false,
        message: 'Keep studying!',
      };
    }

    const newStreak = user.currentStreak + 1;
    const newLongest = Math.max(newStreak, user.longestStreak);

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        streakSecuredToday: true,
        currentStreak: newStreak,
        longestStreak: newLongest,
      },
    });

    const newBadges = await this.evaluateStreakBadges(userId, newStreak);

    return {
      success: true,
      alreadySecured: false,
      effectiveStreak: newStreak,
      newBadges,
    };
  }

  private async evaluateStreakBadges(userId: number, currentStreak: number) {
    const eligibleBadges = await this.prisma.badge.findMany({
      where: {
        requiredStreak: {
          lte: currentStreak,
        },
      },
    });

    if (eligibleBadges.length === 0) {
      return [];
    }

    const newlyAwardedBadges: Badge[] = [];
    let bonusPointsToAward = 0;

    for (const badge of eligibleBadges) {
      try {
        await this.prisma.userBadge.create({
          data: {
            userId,
            badgeId: badge.id,
          },
        });

        newlyAwardedBadges.push(badge);
        bonusPointsToAward += badge.pointsReward;
      } catch (error) {}
    }

    if (bonusPointsToAward > 0) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { points: { increment: bonusPointsToAward } },
      });
    }

    return newlyAwardedBadges;
  }

  async getUserBadges(userId: number) {
    const allBadges = await this.prisma.badge.findMany({
      orderBy: {
        requiredStreak: 'asc',
      },
    });

    const earnedBadges = await this.prisma.userBadge.findMany({
      where: { userId },
      orderBy: {
        badge: {
          requiredStreak: 'asc',
        },
      },
    });

    return allBadges.map((badge) => {
      const earnedRecord = earnedBadges.find((ub) => ub.badgeId === badge.id);

      return {
        ...badge,
        isUnlocked: !!earnedRecord, // true if they have it, false if they don't
        earnedAt: earnedRecord ? earnedRecord.earnedAt : null,
      };
    });
  }

  async recordCardPoints(userId: number, rating: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new Error('User not found');
    }

    let easyStreak = user.currentEasyStreak;
    let pointsToAdd = GAME_RULES.BASE_POINTS;
    let isCombo = false;

    if (rating === 4) {
      easyStreak += 1;
      if (easyStreak > 0 && easyStreak % GAME_RULES.COMBO_THRESHOLD === 0) {
        pointsToAdd += GAME_RULES.COMBO_BONUS;
        isCombo = true;
      }
    } else {
      easyStreak = 0; // streak broken
    }

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const [updatedUser, dailyActivity] = await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: userId },
        data: {
          points: { increment: pointsToAdd },
          currentEasyStreak: easyStreak,
        },
      }),

      this.prisma.dailyActivity.upsert({
        where: {
          userId_date: { userId: userId, date: today },
        },
        update: {
          pointsEarned: { increment: pointsToAdd },
          cardsReviewed: { increment: 1 },
        },
        create: {
          userId: userId,
          date: today,
          pointsEarned: pointsToAdd,
          cardsReviewed: 1,
        },
      }),
    ]);

    return {
      pointsEarned: pointsToAdd,
      isCombo: isCombo,
      totalUserPoints: updatedUser.points,
    };
  }

  async resetComboStreak(userId: number) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { currentEasyStreak: 0 },
    });
    return { message: 'Combo reset successfully' };
  }

  async getPersonalTop(userId: number) {
    return this.prisma.dailyActivity.findMany({
      where: { userId },
      orderBy: { pointsEarned: 'desc' },
      take: 3,
      select: {
        id: true,
        date: true,
        pointsEarned: true,
      },
    });
  }
}
