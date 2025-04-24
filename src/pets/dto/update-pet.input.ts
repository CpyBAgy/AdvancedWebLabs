import { CreatePetInput } from './create-pet.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class UpdatePetInput extends PartialType(CreatePetInput) {
  @Field()
  @IsUUID()
  id: string;
}
