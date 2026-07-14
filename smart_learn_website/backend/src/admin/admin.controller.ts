import {
  Controller,
  Get,
  Delete,
  Post,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from '@/decorators';
import { RolesGuard } from '@/auth/roles.guard';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('users')
  async getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Delete('users/:id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteUser(id);
  }

  @Get('badges')
  async getAllBadges() {
    return this.adminService.getAllBadges();
  }

  @Patch('badges/:id')
  async updateBadge(
    @Param('id', ParseIntPipe) id: number,
    @Body() badgeData: any,
  ) {
    return this.adminService.updateBadge(id, badgeData);
  }

  @Post('badges')
  async createBadge(@Body() badgeData: any) {
    return this.adminService.createBadge(badgeData);
  }

  @Delete('badges/:id')
  async deleteBadge(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteBadge(id);
  }
}
