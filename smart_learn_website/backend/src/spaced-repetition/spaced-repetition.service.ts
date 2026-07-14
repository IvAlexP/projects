import { Injectable } from '@nestjs/common';
import { fsrs, FSRS, Card, Rating, createEmptyCard , ReviewLog} from 'ts-fsrs';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class SpacedRepetitionService {
  constructor(private prisma: PrismaService) {}
  private fsrsTracker: FSRS = fsrs();

  getNewCardState(): Card {
    return createEmptyCard();
  }

  async submitReview(userCardDataId: number, rating: Rating) {
    const existingRecord = await this.prisma.userCardMetadata.findUnique({
      where: { id: userCardDataId },
    });

    if (!existingRecord) throw new Error('Card not found');

    const currentCard: Card = {
      due: existingRecord.due,
      stability: existingRecord.stability,
      difficulty: existingRecord.difficulty,
      elapsed_days: existingRecord.elapsed_days,
      scheduled_days: existingRecord.scheduled_days,
      lapses: existingRecord.lapses,
      learning_steps: existingRecord.learning_steps,
      reps: existingRecord.reps,
      state: existingRecord.state,
    };

    const now = new Date();
    const schedulingCards = this.fsrsTracker.repeat(currentCard, now);
    const newCardState = schedulingCards[rating].card;

    return await this.prisma.$transaction(async (tx) => {
      const updatedMetadata = tx.userCardMetadata.update({
        where: { id: userCardDataId },
        data: {
          due: newCardState.due,
          stability: newCardState.stability,
          difficulty: newCardState.difficulty,
          elapsed_days: newCardState.elapsed_days,
          scheduled_days: newCardState.scheduled_days,
          reps: newCardState.reps,
          state: newCardState.state,
          lapses: newCardState.lapses,
          learning_steps: newCardState.learning_steps,
        },
      });

      await tx.reviewLog.create({
        data: {
          userCardMetadataId: userCardDataId,
          rating: rating,
          state: existingRecord.state, // state BEFORE the review
          stability: newCardState.stability,
          difficulty: newCardState.difficulty,
          scheduled_days: newCardState.scheduled_days,
        },
      });

      return updatedMetadata;
    });
  }

  rollbackReview(dbCard: any, dbLog: any): Card {    
    const currentCard: Card = {
      due: dbCard.due,
      stability: dbCard.stability,
      difficulty: dbCard.difficulty,
      elapsed_days: dbCard.elapsed_days,
      scheduled_days: dbCard.scheduled_days,
      reps: dbCard.reps,
      lapses: dbCard.lapses,
      state: dbCard.state,
      learning_steps: dbCard.learning_steps || 0,
    };

    const log: ReviewLog = {
      rating: dbLog.rating,
      state: dbLog.state,
      due: dbLog.createdAt,
      stability: dbLog.stability,
      difficulty: dbLog.difficulty,
      elapsed_days: dbCard.elapsed_days,
      last_elapsed_days: 0,
      scheduled_days: dbLog.scheduled_days,
      review: dbLog.createdAt,
      learning_steps: 0,
    };

    const previousCardState = this.fsrsTracker.rollback(currentCard, log);

    return previousCardState;
  }
}
