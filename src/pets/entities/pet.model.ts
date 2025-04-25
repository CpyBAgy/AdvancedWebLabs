import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '../../users/entities/user.model';

@ObjectType()
export class Pet {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  type: string;

  @Field()
  ownerId: string;

  @Field(() => User, { nullable: true })
  owner?: User;
}
