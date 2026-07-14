import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findById(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { password, ...result } = user;
    return result;
  }

  async updateDisplayName(id: number, displayName: string) {
    const user = await this.prisma.user.update({
      where: { id },
      data: { displayName },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { password, ...result } = user;
    return {
      message: 'Display name updated successfully',
      user: result,
    };
  }

  async updatePassword(id: number, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      dto.currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
    return {
      message: 'Password updated successfully',
    };
  }

  async searchUsers(userId: number, query: string) {
    const users = await this.prisma.user.findMany({
      where: {
        displayName: {
          contains: query,
          mode: 'insensitive',
        },
        id: {
          not: userId
        }
      },
      select: {
        id: true,
        displayName: true,
      },
    });
    return users;
  }
}
