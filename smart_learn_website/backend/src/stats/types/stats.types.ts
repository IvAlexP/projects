export interface ReviewStat {
  day: string;
  points: number;
  reviews: number;
  totalPoints: number;
  totalReviews: number;
}

export interface StabilityStat {
  stability: number;
  cards: number;
  total: number;
}

export interface ReviewHoursStat {
  hour: number;
  percentage: number;
  total: number;
}