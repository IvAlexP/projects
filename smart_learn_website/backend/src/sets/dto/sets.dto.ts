import { IsNotEmpty, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CardsDto } from '@/cards/dto/cards.dto';

export class SetsDto {
    @IsString()
    @IsNotEmpty({ message: 'Title is mandatory' })
    title!: string;

    @IsString()
    description!: string;

    @IsArray()
    @IsNotEmpty({ message: 'Cards are mandatory' })
    @ValidateNested({ each: true }) // tells Nest to validate each card in the list
    @Type(() => CardsDto)           // tells Nest what class the objects are
    cards!: CardsDto[];
}
