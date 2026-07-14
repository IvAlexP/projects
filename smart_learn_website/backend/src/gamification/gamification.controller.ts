import { Controller, Post, Body, Get, Req } from '@nestjs/common';
import { User } from '@/decorators';
import { GamificationService } from './gamification.service';

@Controller('gamification')
export class GamificationController {
  constructor(private readonly gamificationService: GamificationService) {}

  @Post('check-in')
  async checkIn(@User() user: any) {
    return await this.gamificationService.recordDailyCheckIn(user.id);
  }

  @Get('badges')
  async getUserBadges(@User() user: any) {
    return await this.gamificationService.getUserBadges(user.id);
  }

  @Post('reset-combo')
  async resetCombo(@User() user: any) {
    return this.gamificationService.resetComboStreak(user.id);
  }

  @Get('personal-top')
  async getPersonalTop(@User() user: any) {
    return await this.gamificationService.getPersonalTop(user.id);
  }
}
