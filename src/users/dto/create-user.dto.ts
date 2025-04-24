import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'Анна', description: 'Имя пользователя' })
  @IsNotEmpty({ message: 'Имя обязательно' })
  @IsString({ message: 'Имя должно быть строкой' })
  name: string;

  @ApiProperty({
    example: 'barsuk@email.com',
    description: 'Email пользователя',
  })
  @IsNotEmpty({ message: 'Email обязателен' })
  @IsEmail({}, { message: 'Некорректный формат email' })
  email: string;
}

export class CreatePetForUserDto {
  @ApiProperty({ example: 'Барсик', description: 'Имя животного' })
  @IsNotEmpty({ message: 'Имя не может быть пустым' })
  name: string;

  @ApiProperty({ example: 'Кошка', description: 'Тип животного' })
  @IsNotEmpty({ message: 'Тип не может быть пустым' })
  type: string;
}
