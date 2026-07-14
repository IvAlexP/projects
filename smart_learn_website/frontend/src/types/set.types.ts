import type { Card } from './card.types';
import type { PracticeCard } from './card.types';

export interface Set {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  cardCount: number;
  sourceFiles: string[];
}

export interface SetDetail extends Set {
  cards: Card[];
}

export interface PracticeSet extends Set {
  cards: PracticeCard[];
}
