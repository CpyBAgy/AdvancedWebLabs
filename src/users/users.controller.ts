import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Sse,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Observable } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly prisma: PrismaService,
  ) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateData: any) {
    return await this.usersService.update(id, updateData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.usersService.remove(id);
  }

  @Get('/email')
  async findByEmail(@Query('email') email: string) {
    return await this.usersService.findByEmail(email);
  }

  @Sse('events')
  getUserEvents(): Observable<MessageEvent> {
    return this.usersService.getSseEvents();
  }
}
