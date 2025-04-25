import { Module } from '@nestjs/common';
import { PetsService } from './pets.service';
import { PetsController } from './pets.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PetsApiController } from './pets.api.controller';
import { PetsResolver } from './pets.resolver';
import { UsersModule } from '../users/users.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    CacheModule.register({
      ttl: 5,
      max: 100,
    }),
  ],
  controllers: [PetsController, PetsApiController],
  providers: [PetsService, PetsResolver],
  exports: [PetsService],
})
export class PetsModule {}
