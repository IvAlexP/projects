import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        lastActivityAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (users.length === 0) {
      return {
        data: [],
        message: 'No users found',
      };
    }

    return {
      data: users,
      message: 'Users fetched successfully',
    };
  }

  async deleteUser(id: number) {
    const deletedUser = await this.prisma.user.delete({
      where: { id },
    });
    return {
      data: deletedUser,
      message: 'User deleted successfully',
    };
  }

  async getAllBadges() {
    const badges = await this.prisma.badge.findMany({
      orderBy: { pointsReward: 'asc' },
    });
    return {
      data: badges,
      message: 'Badges fetched successfully',
    };
  }

  private async validateUniqueStreak(requiredStreak: number, excludeBadgeId?: number) {
    const whereClause: any = { requiredStreak };
    
    if (excludeBadgeId) {
      whereClause.id = { not: excludeBadgeId };
    }

    const existingBadge = await this.prisma.badge.findFirst({
      where: whereClause,
    });

    if (existingBadge) {
      throw new ConflictException(
        `There is already a badge created for ${requiredStreak} days.`
      );
    }
  }

  async createBadge(badgeData: any) {
    await this.validateUniqueStreak(badgeData.requiredStreak);
    const generatedCode = `STREAK_${badgeData.requiredStreak}`;

    const createdBadge = await this.prisma.badge.create({
      data: {
        name: badgeData.name,
        description: badgeData.description,
        icon: badgeData.icon,
        requiredStreak: badgeData.requiredStreak,
        pointsReward: badgeData.pointsReward,
        code: generatedCode,
      },
    });

    return {
      data: createdBadge,
      message: 'Badge created successfully',
    };
  }

  async updateBadge(id: number, badgeData: any) {
    if (badgeData.requiredStreak) {
      await this.validateUniqueStreak(badgeData.requiredStreak, id);
      badgeData.code = `STREAK_${badgeData.requiredStreak}`;
    }

    const updatedBadge = await this.prisma.badge.update({
      where: { id },
      data: badgeData,
    });

    return {
      data: updatedBadge,
      message: 'Badge updated successfully',
    };
  }

  async deleteBadge(id: number) {
    const deletedBadge = await this.prisma.badge.delete({
      where: { id },
    });
    return {
      data: deletedBadge,
      message: 'Badge deleted successfully',
    };
  }
}
