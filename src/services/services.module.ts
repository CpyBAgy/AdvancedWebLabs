import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ServicesController } from './services.controller';
import { ServicesApiController } from './services.api.controller';
import { ServicesResolver } from './services.resolver';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    PrismaModule,
    CacheModule.register({
      ttl: 5,
      max: 100,
    }),
  ],
  controllers: [ServicesController, ServicesApiController],
  providers: [ServicesService, ServicesResolver],
  exports: [ServicesService],
})
export class ServicesModule {}
