import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { AppointmentsService } from './appointments.service';
import { Appointment } from './entities/appointment.model';
import { CreateAppointmentInput } from './dto/create-appointment.input';
import { Pet } from '../pets/entities/pet.model';
import { Service } from '../services/entities/service.model';
import { PetsService } from '../pets/pets.service';
import { ServicesService } from '../services/services.service';

@Resolver(() => Appointment)
export class AppointmentsResolver {
  constructor(
    private readonly appointmentsService: AppointmentsService,
    private readonly petsService: PetsService,
    private readonly servicesService: ServicesService,
  ) {}

  @Query(() => [Appointment], { name: 'appointments' })
  findAll() {
    return this.appointmentsService.findAll();
  }

  @Query(() => Appointment, { name: 'appointment' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.appointmentsService.findOne(id);
  }

  @Mutation(() => Appointment)
  MakeAppointment(
    @Args('createAppointmentInput')
    createAppointmentInput: CreateAppointmentInput,
  ) {
    return this.appointmentsService.create(createAppointmentInput);
  }

  @Mutation(() => Boolean)
  DeleteAppointment(@Args('id', { type: () => String }) id: string) {
    return this.appointmentsService.remove(id).then(() => true);
  }

  @ResolveField(() => Pet, { name: 'pet', nullable: true })
  async resolvePet(@Parent() appointment: Appointment): Promise<Pet | null> {
    return this.petsService.findOne(appointment.petId);
  }

  @ResolveField(() => Service, { name: 'service', nullable: true })
  async resolveService(
    @Parent() appointment: Appointment,
  ): Promise<Service | null> {
    return this.servicesService.findOne(appointment.serviceId);
  }
}
