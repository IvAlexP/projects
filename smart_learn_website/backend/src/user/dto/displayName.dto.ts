import { IsString, MaxLength, IsNotEmpty } from 'class-validator';

export class DisplayNameDto {
  @IsString()
  @IsNotEmpty({ message: 'Display name is mandatory' })
  @MaxLength(10, { message: 'Display name must be less than 10 characters' })
  displayName!: string;
}
