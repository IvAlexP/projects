import {
  ForbiddenException,
  Inject,
  forwardRef,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CardsDto } from './dto/cards.dto';
import { evaluateUserAnswer } from './utils/evaluation.util';
import { Rating } from 'ts-fsrs';
import { GamificationService } from '@/gamification/gamification.service';
import { SpacedRepetitionService } from '@/spaced-repetition/spaced-repetition.service';

@Injectable()
export class CardsService {
  constructor(
    private prisma: PrismaService,
    private fsrsService: SpacedRepetitionService,
    @Inject(forwardRef(() => GamificationService))
    private gamificationService: GamificationService,
  ) {}

  async createCard(userId: number, setId: number, dto: CardsDto) {
    const newCard = await this.prisma.card.create({
      data: {
        question: dto.question,
        answer: dto.answer,
        set: {
          connect: { id: setId, userId: userId },
        },
      },
    });

    if (!newCard) {
      throw new InternalServerErrorException('Could not create card');
    }

    return {
      message: 'Card created successfully',
      data: newCard,
    };
  }

  async updateCard(userId: number, cardId: number, dto: Partial<CardsDto>) {
    const card = await this.prisma.card.findFirst({
      where: {
        id: cardId,
        set: {
          userId: userId,
        },
      },
    });

    if (!card) {
      throw new ForbiddenException(
        'You do not have permission to edit this card or it does not exist',
      );
    }

    try {
      const updatedCard = await this.prisma.card.update({
        where: { id: cardId },
        data: { ...dto },
      });

      return {
        message: 'Card updated successfully',
        data: updatedCard,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while saving the card',
      );
    }
  }

  async deleteCard(userId: number, cardId: number) {
    const result = await this.prisma.card.deleteMany({
      where: {
        id: cardId,
        set: {
          userId: userId,
        },
      },
    });

    if (result.count === 0) {
      throw new ForbiddenException(
        'You do not have permission to delete this card or it does not exist',
      );
    }

    return { message: 'Card deleted successfully' };
  }

  async getCardAnswer(userId: number, cardId: number) {
    const card = await this.prisma.card.findUnique({
      where: { id: cardId, set: { userId: userId } },
      select: { answer: true },
    });

    if (!card) {
      throw new NotFoundException('Card not found');
    }
    return { answer: card.answer };
  }

  async rateCard(userId: number, cardId: number, rating: number) {
    await this.processCardReview(userId, cardId, rating);
    const { pointsEarned, isCombo } =
      await this.gamificationService.recordCardPoints(userId, rating);
    return { success: true, pointsEarned, isCombo };
  }

  async overrideRating(userId: number, cardId: number, newRating: number) {
    // most recent review log for this card
    const userCardMetadata = await this.prisma.userCardMetadata.findUnique({
      where: { userId_cardId: { userId, cardId } },
      include: {
        reviewLogs: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!userCardMetadata) {
      throw new NotFoundException('Card metadata not found');
    }

    const lastLog = userCardMetadata.reviewLogs[0];

    if (lastLog) {
      const rolledBackCard = this.fsrsService.rollbackReview(
        userCardMetadata,
        lastLog,
      );

      await this.prisma.reviewLog.delete({
        where: { id: lastLog.id },
      });

      await this.prisma.userCardMetadata.update({
        where: { id: userCardMetadata.id },
        data: {
          due: rolledBackCard.due,
          stability: rolledBackCard.stability,
          difficulty: rolledBackCard.difficulty,
          elapsed_days: rolledBackCard.elapsed_days,
          scheduled_days: rolledBackCard.scheduled_days,
          reps: rolledBackCard.reps,
          lapses: rolledBackCard.lapses,
          state: rolledBackCard.state,
        },
      });
    }

    await this.processCardReview(userId, cardId, newRating);

    return { success: true, pointsEarned: 0, isCombo: false };
  }

  async checkAnswer(
    userId: number,
    cardId: number,
    userAnswer: string,
    timeTakenMs: number,
  ) {
    const card = await this.prisma.card.findUnique({
      where: {
        id: cardId,
        set: { userId: userId },
      },
    });

    if (!card) {
      throw new NotFoundException('Card not found');
    }

    const evaluation = evaluateUserAnswer(card.answer, userAnswer, timeTakenMs);
    await this.processCardReview(userId, cardId, evaluation.rating);

    const { pointsEarned, isCombo } =
      await this.gamificationService.recordCardPoints(
        userId,
        evaluation.rating,
      );

    return {
      correctAnswer: card.answer,
      rating: evaluation.rating,
      feedback: evaluation.feedback,
      pointsEarned: pointsEarned,
      isCombo: isCombo,
    };
  }

  private async processCardReview(
    userId: number,
    cardId: number,
    rating: number,
  ) {
    let userCardMetadata = await this.prisma.userCardMetadata.findUnique({
      where: { userId_cardId: { userId, cardId } },
    });

    if (!userCardMetadata) {
      const emptyCard = this.fsrsService.getNewCardState();
      userCardMetadata = await this.prisma.userCardMetadata.create({
        data: {
          userId,
          cardId,
          ...emptyCard,
        },
      });
    }

    this.fsrsService.submitReview(userCardMetadata.id, rating as Rating);

    return {
      success: true,
    };
  }

  async getDueCardsCount(userId: number) {
    const now = new Date();

    const totalDueCards = await this.prisma.card.count({
      where: {
        set: {
          userId: userId,
        },
        OR: [
          {
            userData: {
              none: { userId }, // new card (no overdue history)
            },
          },
          {
            userData: {
              some: {
                userId,
                due: { lte: now }, // overdue card
              },
            },
          },
        ],
      },
    });

    return { currentDueCount: totalDueCards };
  }

  async getDueCardsForNotification(userId: number, lastNotification: string) {
    const now = new Date();
    const lastNotificationTime = new Date(lastNotification);

    const newAndOverdueCount = await this.prisma.card.count({
      where: {
        set: {
          userId: userId,
        },
        OR: [
          // created since the last notification
          {
            createdAt: {
              gt: lastNotificationTime,
              lte: now,
            },
            userData: {
              none: { userId },
            },
          },
          // became due strictly within this time window
          {
            userData: {
              some: {
                userId,
                due: {
                  gt: lastNotificationTime,
                  lte: now,
                },
              },
            },
          },
        ],
      },
    });

    return { currentDueCount: newAndOverdueCount };
  }
}
