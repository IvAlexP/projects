import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { IsPassword } from '@/decorators';

export class RegisterDto {
  @IsString()
  @IsNotEmpty({ message: 'Email is mandatory' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email!: string;

  @IsPassword()
  password!: string;
}
