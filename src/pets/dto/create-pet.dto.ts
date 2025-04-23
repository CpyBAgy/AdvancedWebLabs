import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreatePetDto {
  @ApiProperty({ example: 'Барсик', description: 'Имя животного' })
  @IsNotEmpty({ message: 'Имя животного обязательно' })
  name: string;

  @ApiProperty({ example: 'Кошка', description: 'Тип животного' })
  @IsNotEmpty({ message: 'Тип животного обязателен' })
  type: string;

  @ApiProperty({ example: 'uuid-строка', description: 'ID владельца' })
  @IsNotEmpty({ message: 'ID владельца обязателен' })
  ownerId: string;
}
