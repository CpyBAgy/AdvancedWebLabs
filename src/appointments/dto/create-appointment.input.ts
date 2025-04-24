import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsISO8601 } from 'class-validator';

@InputType()
export class CreateAppointmentInput {
  @Field()
  @IsISO8601()
  date: string;

  @Field()
  @IsNotEmpty()
  petId: string;

  @Field()
  @IsNotEmpty()
  serviceId: string;
}
