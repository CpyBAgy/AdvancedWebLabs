import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { PetsModule } from '../pets/pets.module';
import { ServicesModule } from '../services/services.module';
import { AppointmentsApiController } from './appointments.api.controller';
import { AppointmentsResolver } from './appointments.resolver';
import { CacheModule } from '@nestjs/cache-manager';
@Module({
  imports: [
    PrismaModule,
    UsersModule,
    PetsModule,
    ServicesModule,
    CacheModule.register({
      ttl: 5,
      max: 100,
    }),
  ],
  controllers: [AppointmentsController, AppointmentsApiController],
  providers: [AppointmentsService, AppointmentsResolver],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
