import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { AnimalsController } from './animals.controller';
import { AnimalsService } from './animals.service';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [PrismaModule],
  controllers: [AnimalsController],
  providers: [AnimalsService],
  exports: [AnimalsService],
})
export class AnimalsModule {}
