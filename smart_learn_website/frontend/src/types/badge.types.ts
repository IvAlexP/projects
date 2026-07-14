export interface Badge {
  id: number;
  code: string;
  name: string;
  description: string;
  icon: string | null;
  isUnlocked: boolean;
  earnedAt: string | null;
}
