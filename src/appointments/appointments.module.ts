import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { PetsModule } from '../pets/pets.module';
import { ServicesModule } from '../services/services.module';
import { AppointmentsApiController } from './appointments.api.controller';
import { AppointmentsResolver } from './appointments.resolver';
@Module({
  imports: [PrismaModule, UsersModule, PetsModule, ServicesModule],
  controllers: [AppointmentsController, AppointmentsApiController],
  providers: [AppointmentsService, AppointmentsResolver],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
