import { applyDecorators } from '@nestjs/common';
import { IsString, MinLength, Matches, IsNotEmpty } from 'class-validator';

export function IsPassword() {
  return applyDecorators(
    IsString(),
    IsNotEmpty({ message: 'Password is mandatory' }),
    MinLength(8, { message: 'Password must be at least 8 characters long' }),
    Matches(/[a-z]/, { message: 'Password must contain at least one lowercase letter' }),
    Matches(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' }),
    Matches(/\d/, { message: 'Password must contain at least one number' }),
    Matches(/[^a-zA-Z0-9]/, { message: 'Password must contain at least one symbol' })
  );
}