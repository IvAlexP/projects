import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { StatsService } from './stats.service';
import { User } from '@/decorators';
import { StabilityStat } from './types/stats.types';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('activity')
  getActivityStats(
    @User() user: any,
    @Query('days', new DefaultValuePipe(30), ParseIntPipe) days: number,
  ) {
    return this.statsService.getActivityStats(user.id, days);
  }

  @Get('stability')
  getStabilityStats(@User() user: any): Promise<StabilityStat[]> {
    return this.statsService.getStabilityStats(user.id);
  }

  @Get('hours')
  getReviewHours(
    @User() user: any,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ) {
    return this.statsService.getReviewHours(user.id, offset);
  }
}
