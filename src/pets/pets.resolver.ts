import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { PetsService } from './pets.service';
import { Pet } from './entities/pet.model';
import { CreatePetInput } from './dto/create-pet.input';
import { UpdatePetInput } from './dto/update-pet.input';
import { User } from '../users/entities/user.model';
import { UsersService } from '../users/users.service';

@Resolver(() => Pet)
export class PetsResolver {
  constructor(private readonly petsService: PetsService,
              private readonly usersService: UsersService,) {}

  @Query(() => [Pet], { name: 'pets' })
  findAll() {
    return this.petsService.findAll();
  }

  @Mutation(() => Pet)
  AddPet(@Args('createPetInput') createPetInput: CreatePetInput) {
    return this.petsService.create(createPetInput);
  }

  @Mutation(() => Pet)
  UpdatePetInfo(@Args('input') input: UpdatePetInput) {
    return this.petsService.update(input.id, input);
  }

  @Query(() => Pet, { name: 'pet' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.petsService.findOne(id);
  }

  @Mutation(() => Boolean)
  DeletePet(@Args('id', { type: () => String }) id: string) {
    return this.petsService.remove(id).then(() => true);
  }

  @ResolveField(() => User, { name: 'owner', nullable: true })
  async resolveOwner(@Parent() pet: Pet): Promise<User | null> {
    return this.usersService.findOne(pet.ownerId);
  }
}
