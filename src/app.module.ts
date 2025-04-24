import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AnimalsModule } from './modules/animals/animals.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { CustomersModule } from './modules/customers/customers.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ServicesModule } from './modules/services/services.module';
import { ContactsModule } from './modules/contacts/contacts.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { InitModule } from './modules/init/init.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    PrismaModule,
    AnimalsModule,
    CategoriesModule,
    CustomersModule,
    OrdersModule,
    ServicesModule,
    ContactsModule,
    AppointmentsModule,
    InitModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}