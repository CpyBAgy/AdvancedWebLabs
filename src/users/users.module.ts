import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersApiController } from './users.api.controller';
import { UsersResolver } from './users.resolver';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    PrismaModule,
    CacheModule.register({
      ttl: 5,
      max: 100,
    }),
  ],

  providers: [UsersService, UsersResolver],
  controllers: [UsersController, UsersApiController],
  exports: [UsersService],
})
export class UsersModule {}
