import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { UsersModule } from './users/users.module';
import { PetsModule } from './pets/pets.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { ServicesModule } from './services/services.module';
import { ContactsModule } from './contacts/contacts.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ComplexityPlugin } from './complexity.plugin';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ElapsedTimeInterceptor } from './common/interceptors/elapsed-time.interceptor';
import { StorageModule } from './storage/storage.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({
      ttl: 5,
      isGlobal: true,
    }),
    StorageModule,
    PrismaModule,
    UserModule,
    UsersModule,
    PetsModule,
    AppointmentsModule,
    ServicesModule,
    ContactsModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'schema.gql'),
      playground: true,
      sortSchema: true,
      path: '/graphql',
      introspection: true,
      debug: false,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ComplexityPlugin,
    {
      provide: APP_INTERCEPTOR,
      useClass: ElapsedTimeInterceptor,
    },
  ],
})
export class AppModule {}
