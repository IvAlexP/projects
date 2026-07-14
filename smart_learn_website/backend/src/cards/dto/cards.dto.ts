import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CardsDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsString()
  @IsNotEmpty({ message: 'Question is mandatory' })
  question!: string;

  @IsString()
  @IsNotEmpty({ message: 'Answer is mandatory' })
  answer!: string;
}
