import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersApiController } from './users.api.controller';
import { UsersResolver } from './users.resolver';

@Module({
  imports: [PrismaModule],
  providers: [UsersService, UsersResolver],
  controllers: [UsersController, UsersApiController],
  exports: [UsersService],
})
export class UsersModule {}
