import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  Req,
  UnauthorizedException,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import { Public, User } from '@/decorators';
import { type Request, type Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('me')
  getMe(@User() user: any) {
    return this.authService.getMe(user.id);
  }

  @Public()
  @Post('register')
  handleRegister(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, tokens } = await this.authService.login(loginDto);
    this.setTokenCookies(res, tokens);
    return {
      message: 'Logged in successfully!',
      user: user,
    };
  }

  @Post('logout')
  async handleLogout(
    @User() user: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const id = user.id;
    if (id) {
      await this.authService.logout(id);
    }
    this.clearTokenCookies(res);
    return { message: 'Logged out successfully!' };
  }

  @Post('delete')
  async deleteAccount(@User() user: any) {
    return this.authService.deleteAccount(user.id);
  }

  @Public()
  @Post('refresh')
  async refreshTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshTokenString = req.cookies?.['refreshToken'];

    if (!refreshTokenString) {
      throw new UnauthorizedException('No refresh token found');
    }

    try {
      const tokens = await this.authService.refreshTokens(refreshTokenString);
      this.setTokenCookies(res, tokens);
      return { message: 'Tokens refreshed successfully' };
    } catch (error) {
      this.clearTokenCookies(res);
      throw new UnauthorizedException('Refresh token expired or invalid');
    }
  }

  private setTokenCookies(
    res: Response,
    tokens: { accessToken: string; refreshToken: string },
  ) {
    const isProd = process.env.NODE_ENV === 'production';
    const shortExpiration = 60 * 60 * 1000; // 1 hour
    const longExpiration = 30 * 24 * 60 * 60 * 1000; // 30 days

    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: isProd,
      maxAge: shortExpiration,
      path: '/',
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: isProd,
      maxAge: longExpiration,
      path: '/auth/refresh',
    });
  }

  private clearTokenCookies(res: Response) {
    const isProd = process.env.NODE_ENV === 'production';

    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: isProd,
      path: '/',
    });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: isProd,
      path: '/auth/refresh',
    });
  }

  @Public()
  @Get('verifyEmail')
  async verifyEmail(@Query('token') token: string) {
    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }
    return this.authService.verifyEmailToken(token);
  }
}
