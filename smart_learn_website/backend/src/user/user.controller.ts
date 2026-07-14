import { Controller, Get, Patch, Body, Query } from '@nestjs/common';
import { User } from '../decorators';
import { UserService } from './user.service';
import { ChangePasswordDto, DisplayNameDto } from './dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async getProfile(@User() user: any) {
    return await this.userService.findById(user.id);
  }

  @Patch('update/displayName')
  async updateDisplayName(@User() user: any, @Body() dto: DisplayNameDto) {
    return await this.userService.updateDisplayName(user.id, dto.displayName);
  }

  @Patch('update/password')
  async updatePassword(@User() user: any, @Body() dto: ChangePasswordDto) {
    return await this.userService.updatePassword(user.id, dto);
  }

  @Get('search')
  async searchUsers(@User() user: any, @Query('q') query: string) {
    return await this.userService.searchUsers(user.id, query);
  }
}
