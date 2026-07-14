import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { PrismaService } from './prisma.service';
import { ConfigService } from '@nestjs/config/dist/config.service';
import * as bcrypt from 'bcrypt';

async function main() {
  console.log('Booting NestJS Standalone Context for seeding...');

  const app = await NestFactory.createApplicationContext(AppModule);
  const prisma = app.get(PrismaService);
  const configService = app.get(ConfigService);

  console.log('Connected to database. Starting badge seeding...');

  const adminEmail = configService.get<string>('ADMIN_EMAIL');
  const adminPassword = configService.get<string>('ADMIN_PASSWORD');

  if (!adminEmail || !adminPassword) {
    throw new Error('ADMIN_EMAIL or ADMIN_PASSWORD missing from .env!');
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashedPassword,
      displayName: 'Admin',
      role: 'ADMIN',
      isEmailVerified: true,
    },
  });

  console.log('Admin user seeded. Starting badge seeding...');

  const streakBadges = [
    {
      code: 'STREAK_3',
      name: '3-Day Starter',
      description: 'Great job on building that initial habit!',
      requiredStreak: 3,
      icon: '🥉',
      pointsReward: 50,
    },
    {
      code: 'STREAK_7',
      name: '7-Day Warrior',
      description: 'Congratulations for a full week of dedication!',
      requiredStreak: 7,
      icon: '🥈',
      pointsReward: 100,
    },
    {
      code: 'STREAK_30',
      name: '30-Day Master',
      description: 'Awarded for a month of unstoppable learning!.',
      requiredStreak: 30,
      icon: '🥇',
      pointsReward: 200,
    },
    {
      code: 'STREAK_50',
      name: '50-Day Grandmaster',
      description: 'Your memory is becoming stronger!',
      requiredStreak: 50,
      icon: '🏆',
      pointsReward: 500,
    },
    {
      code: 'STREAK_100',
      name: '100-Day Legend',
      description: '100 days of unbroken focus. You are a true legend!',
      requiredStreak: 100,
      icon: '👑',
      pointsReward: 1000,
    },
  ];

  for (const badge of streakBadges) {
    // to ensure we do not create duplicates at re-run
    await prisma.badge.upsert({
      where: { code: badge.code },
      update: badge, // exists -> update
      create: badge, // does not exist -> create
    });
  }

  console.log('Badge seeding finished successfully.');
  await app.close();
  process.exit(0);
}

main().catch((e) => {
  console.error('Seeding failed:');
  console.error(e);
  process.exit(1);
});
