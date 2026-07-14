import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { SetsModule } from './sets/sets.module';
import { CardsModule } from './cards/cards.module';
import { SpacedRepetitionModule } from './spaced-repetition/spaced-repetition.module';
import { StatsModule } from './stats/stats.module';
import { GamificationModule } from './gamification/gamification.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MailModule } from './mail/mail.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
    }),
    AuthModule,
    UserModule,
    SetsModule,
    CardsModule,
    SpacedRepetitionModule,
    StatsModule,
    GamificationModule,
    ScheduleModule.forRoot(),
    MailModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [],
})

export class AppModule {}
