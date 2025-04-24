import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Pet } from '../../pets/entities/pet.model';
import { Service } from '../../services/entities/service.model';

@ObjectType()
export class Appointment {
  @Field(() => ID)
  id: string;

  @Field()
  date: string;

  @Field()
  petId: string;

  @Field()
  serviceId: string;

  @Field(() => Pet, { nullable: true })
  pet?: Pet;

  @Field(() => Service, { nullable: true })
  service?: Service;
}