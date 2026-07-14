import { IsPassword } from '@/decorators';
import { IsString } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  currentPassword!: string;

  @IsPassword()
  newPassword!: string;
}
