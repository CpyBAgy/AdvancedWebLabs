import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ServicesService } from './services.service';
import { Service } from './entities/service.model';
import { CreateServiceInput } from './dto/create-service.input';

@Resolver(() => Service)
export class ServicesResolver {
  constructor(private readonly servicesService: ServicesService) {}

  @Query(() => [Service], { name: 'services' })
  findAll() {
    return this.servicesService.findAll();
  }

  @Query(() => Service, { name: 'service' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.servicesService.findOne(id);
  }

  @Mutation(() => Service)
  NewService(@Args('createServiceInput') input: CreateServiceInput) {
    return this.servicesService.create(input);
  }

  @Mutation(() => Boolean)
  DeleteService(@Args('id', { type: () => String }) id: string) {
    return this.servicesService.remove(id).then(() => true);
  }
}
