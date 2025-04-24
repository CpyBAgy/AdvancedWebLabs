import {
  Controller,
  Get,
  Delete,
  Param,
  Body,
  Sse,
  Post,
  Render,
} from '@nestjs/common';
import { PetsService } from './pets.service';
import { Observable } from 'rxjs';
import { Redirect } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Get('/addpet')
  @Render('addpet') // services.hbs
  getManagePage() {
    return { title: 'Управление gbnjvwfvb' };
  }
  @Get('owner/:ownerId')
  async findByOwner(@Param('ownerId') ownerId: string) {
    return await this.petsService.findByOwnerId(ownerId);
  }
  @Post()
  async create(@Body() data) {
    return this.petsService.create(data);
  }
  @Post('update')
  @Redirect('/addpet') // потом мы допишем redirect с userId
  async update(
    @Body() data: { id: string; name: string; type: string; ownerId: string },
  ) {
    await this.petsService.update(data.id, {
      name: data.name,
      type: data.type,
    });

    return { url: `/addpet?userId=${data.ownerId}` };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.petsService.remove(id);
  }

  @Sse('events')
  getPetEvents(): Observable<MessageEvent> {
    return this.petsService.getSseEvents();
  }
}
