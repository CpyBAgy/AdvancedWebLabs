import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsISO8601 } from 'class-validator';

export class CreateAppointmentDto {
  @ApiProperty({
    example: '2025-04-10T14:00:00Z',
    description: 'Дата и время записи',
  })
  @IsNotEmpty({ message: 'Дата и время обязательны' })
  @IsISO8601({}, { message: 'Дата должна быть в формате ISO 8601' })
  date: string;

  @ApiProperty({ example: 'uuid-pet-id', description: 'ID животного' })
  @IsNotEmpty({ message: 'ID животного обязателен' })
  petId: string;

  @ApiProperty({ example: 'uuid-service-id', description: 'ID услуги' })
  @IsNotEmpty({ message: 'ID услуги обязателен' })
  serviceId: string;
}
