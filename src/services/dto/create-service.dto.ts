import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({ description: 'Название услуги', example: 'Услуга 1' })
  @IsNotEmpty({ message: 'Название услуги обязательно' })
  @IsString({ message: 'Название должно быть строкой' })
  name: string;

  @ApiProperty({ description: 'Описание услуги', example: 'Описание услуги 1' })
  @IsNotEmpty({ message: 'Описание услуги обязательно' })
  @IsString({ message: 'Описание должно быть строкой' })
  description: string;

  @ApiProperty({ description: 'Цена услуги', example: 100.0 })
  @IsNotEmpty({ message: 'Цена обязательна' })
  @IsNumber({}, { message: 'Цена должна быть числом' })
  @Min(0, { message: 'Цена не может быть отрицательной' })
  price: number;
}
