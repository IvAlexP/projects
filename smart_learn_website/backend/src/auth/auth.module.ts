import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { AuthGuard } from './auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const duration = config.get('JWT_EXPIRATION') || '3600'; 
        return {
          secret: config.get('JWT_SECRET'),
          signOptions: { expiresIn: `${duration}s` },
        };
      },
    })
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
],
  exports: [JwtModule]
})

export class AuthModule {}
