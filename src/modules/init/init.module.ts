import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { InitDbController } from './init.controller';

@Module({
  imports: [PrismaModule],
  controllers: [InitDbController],
})
export class InitModule {}