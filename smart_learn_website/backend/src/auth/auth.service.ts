import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { type Request, type Response } from 'express';
import { MailService } from '@/mail/mail.service';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
    private mailService: MailService,
  ) {}

  async getMe(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        displayName: true,
        currentStreak: true,
        points: true,
        role: true,
        isEmailVerified: true,
      },
    });

    return { user: user };
  }

  async register(dto: RegisterDto) {
    const userExists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (userExists) {
      throw new ConflictException('This email is already registered.');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const newUser = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        displayName: dto.email.split('@')[0].substring(0, 10),
        emailVerificationToken: verificationToken,
      },
    });

    await this.mailService.sendVerificationEmail(
      newUser.email,
      newUser.displayName,
      verificationToken,
    );

    return {
      message:
        'Registration successful! Please check your email to verify your account.',
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    const correctPassword = user
      ? await bcrypt.compare(dto.password, user.password)
      : false;

    if (!user || !correctPassword) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isEmailVerified) {
      throw new UnauthorizedException(
        'Please verify your email before logging in. Check your inbox.',
      );
    }

    const tokens = await this.getTokens(user.id, user.email, user.role);

    return {
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        currentStreak: user.currentStreak,
        points: user.points,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
      tokens,
    };
  }

  async logout(userId: number) {
    if (userId) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { refreshToken: null },
      });
    }

    return { message: 'Logged out successfully' };
  }

  async deleteAccount(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    await this.prisma.user.delete({
      where: { id: userId },
    });
    return { message: 'Account deleted successfully' };
  }

  async getTokens(userId: number, email: string, role: string) {
    const payload = { id: userId, email, role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.get('JWT_ACCESS_SECRET'),
        expiresIn: '1h',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
        expiresIn: '30d',
      }),
    ]);

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashedRefreshToken, lastActivityAt: new Date() },
    });

    return { accessToken, refreshToken };
  }

  async refreshTokens(refreshTokenString: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshTokenString, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.id },
        select: {
          id: true,
          email: true,
          refreshToken: true,
          role: true,
        },
      });

      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const isRefreshTokenValid = await bcrypt.compare(
        refreshTokenString,
        user.refreshToken,
      );

      if (!isRefreshTokenValid) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const tokens = await this.getTokens(user.id, user.email, user.role);
      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Refresh token expired or invalid');
    }
  }

  async verifyEmailToken(token: string) {
    const user = await this.prisma.user.findFirst({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid or expired verification token.');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        emailVerificationToken: null,
      },
    });

    return { message: 'Email verified successfully! You can now log in.' };
  }
}
