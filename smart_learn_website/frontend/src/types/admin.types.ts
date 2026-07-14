export interface AdminUser {
  id: number;
  email: string;
  role: 'USER' | 'ADMIN';
  lastActivityAt: string;
  createdAt: string;
}

export interface Badge {
  id: number;
  code: string;
  name: string;
  description: string;
  requiredStreak: number;
  icon: string;
  pointsReward: number;
  createdAt: string;
}
