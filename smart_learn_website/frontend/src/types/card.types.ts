export interface Card {
  id: number;
  question: string;
  answer: string;
}

export type PracticeCard = Omit<Card, 'answer'>;
