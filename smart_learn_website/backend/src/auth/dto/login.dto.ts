import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
    @IsString()
    @IsNotEmpty({ message: 'Email is mandatory' })
    @IsEmail({}, { message: 'Email must be a valid email address' })
    email!: string;

    @IsString()
    @IsNotEmpty({ message: 'Password is mandatory' })
    password!: string;
}