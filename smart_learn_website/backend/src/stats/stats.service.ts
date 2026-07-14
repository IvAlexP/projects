import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { format } from 'date-fns';
import {
  ReviewStat,
  StabilityStat,
  ReviewHoursStat,
} from './types/stats.types';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async getActivityStats(userId: number, days: number) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const activities = await this.prisma.dailyActivity.findMany({
      where: { userId, date: { gte: startDate } },
      orderBy: { date: 'asc' },
    });

    const statsMap = new Map<string, any>();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = format(date, 'dd-MM-yyyy');
      statsMap.set(dateString, {
        day: dateString,
        points: 0,
        reviews: 0,
        totalPoints: 0,
      });
    }

    activities.forEach((act) => {
      const dateString = format(act.date, 'dd-MM-yyyy');
      if (statsMap.has(dateString)) {
        statsMap.get(dateString).points += act.pointsEarned;
        statsMap.get(dateString).reviews += act.cardsReviewed;
      }
    });

    const result: ReviewStat[] = [];
    let totalPoints = 0;
    let totalReviews = 0;

    for (const data of statsMap.values()) {
      totalPoints += data.points;
      totalReviews += data.reviews;

      result.push({
        ...data,
        totalPoints: totalPoints,
        totalReviews: totalReviews,
      });
    }

    return result;
  }

  async getStabilityStats(userId: number) {
    const cards = await this.prisma.userCardMetadata.findMany({
      where: { userId: userId },
      select: { stability: true },
    });

    if (cards.length === 0) {
      return [];
    }

    const frequencyMap = new Map<number, number>();
    let maxS = 0;

    cards.forEach((card) => {
      const s = Math.round(card.stability);
      frequencyMap.set(s, (frequencyMap.get(s) || 0) + 1);
      if (s > maxS) maxS = s;
    });

    let runningTotal = 0;
    const stats: StabilityStat[] = [];

    // fill in the gaps
    for (let i = 0; i <= maxS; i++) {
      const count = frequencyMap.get(i) || 0;
      runningTotal += count;

      stats.push({
        stability: i,
        cards: count,
        total: runningTotal,
      });
    }

    return stats;
  }

  async getReviewHours(userId: number, timezoneOffset: number) {
    const logs = await this.prisma.reviewLog.findMany({
      where: { userCardMetadata: { userId: userId } },
      select: { createdAt: true },
    });

    const totalLogs = logs.length;

    if (totalLogs === 0) {
      return [];
    }

    const hoursMap = new Map<number, number>();
    logs.forEach((log) => {
      const localTime = new Date(log.createdAt.getTime() - timezoneOffset * 60000);      
      const hour = localTime.getUTCHours(); 
      hoursMap.set(hour, (hoursMap.get(hour) || 0) + 1);
    });

    const result: ReviewHoursStat[] = [];
    let runningTotal = 0;

    for (let i = 0; i < 24; i++) {
      const countForThisHour = hoursMap.get(i) || 0;
      runningTotal += countForThisHour;

      result.push({
        hour: i,
        percentage: parseFloat(((countForThisHour / totalLogs) * 100).toFixed(2)),
        total: parseFloat(((runningTotal / totalLogs) * 100).toFixed(2)),
      });
    }

    return result;
  }
}
