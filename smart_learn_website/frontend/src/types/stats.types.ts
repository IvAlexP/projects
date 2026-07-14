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

export interface ActivityStat {
  day: string;
  points: number;
  reviews: number;
  totalPoints: number;
  totalReviews: number;
}

export type StabilityStats = StabilityStat[];
export type ReviewHoursStats = ReviewHoursStat[];
export type ActivityStats = ActivityStat[];
