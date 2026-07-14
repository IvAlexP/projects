import {
  Controller,
  Body,
  Patch,
  Post,
  Param,
  ParseIntPipe,
  Delete,
  Get,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsDto } from './dto/cards.dto';
import { User } from '@/decorators';

@Controller('cards')
export class CardsController {
  constructor(private cardsService: CardsService) {}

  @Post(':setId')
  createCard(
    @User() user: any,
    @Param('setId', ParseIntPipe) setId: number,
    @Body() dto: CardsDto,
  ) {
    return this.cardsService.createCard(user.id, setId, dto);
  }

  @Patch(':cardId')
  updateCard(
    @User() user: any,
    @Param('cardId', ParseIntPipe) cardId: number,
    @Body() dto: Partial<CardsDto>,
  ) {
    return this.cardsService.updateCard(user.id, cardId, dto);
  }

  @Delete(':cardId')
  deleteCard(@User() user: any, @Param('cardId', ParseIntPipe) cardId: number) {
    return this.cardsService.deleteCard(user.id, cardId);
  }

  @Get(':cardId/answer')
  getCardAnswer(
    @User() user: any,
    @Param('cardId', ParseIntPipe) cardId: number,
  ) {
    return this.cardsService.getCardAnswer(user.id, cardId);
  }

  @Post(':cardId/rate')
  rateCard(
    @User() user: any,
    @Param('cardId', ParseIntPipe) cardId: number,
    @Body() body: { rating: number},
  ) {
    return this.cardsService.rateCard(user.id, cardId, body.rating);
  }

  @Post(':cardId/check')
  checkAnswer(
    @User() user: any,
    @Param('cardId', ParseIntPipe) cardId: number,
    @Body() body: { userAnswer: string; timeTaken: number },
  ) {
    return this.cardsService.checkAnswer(
      user.id,
      cardId,
      body.userAnswer,
      body.timeTaken,
    );
  }

  @Post(':cardId/override')
  overrideRating(
    @User() user: any,
    @Param('cardId', ParseIntPipe) cardId: number,
    @Body() body: { rating: number },
  ) {
    return this.cardsService.overrideRating(user.id, cardId, body.rating);
  }

  @Get('due/count')
  getDueCardsCount(@User() user: any) {
    return this.cardsService.getDueCardsCount(user.id);
  }

  @Get('due/notif')
  async getDueCardsForNotification(
    @User() user: any,
    @Body() body: { lastNotificationTime: string },
  ) {
    return this.cardsService.getDueCardsForNotification(
      user.id,
      body.lastNotificationTime,
    );
  }
}
