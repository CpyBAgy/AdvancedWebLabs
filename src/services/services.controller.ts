import {
  Controller,
  Get,
  Delete,
  Param,
  Body,
  Sse,
  Render,
  Post,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { Observable } from 'rxjs';
import { Redirect } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get('/serviceadd')
  @Render('serviceadd')
  getManagePage() {
    return { title: 'Управление услугами' };
  }
  @Post('update')
  @Redirect('/serviceadd')
  async update(@Body() data) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
    await this.servicesService.update(data.id, {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
      name: data.name,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
      description: data.description,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      price: parseFloat(String(data.price)),
    });

    return { url: '/serviceadd' };
  }

  @Get()
  async findAll() {
    return await this.servicesService.findAll();
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.servicesService.remove(id);
  }
  @Post()
  async create(@Body() data) {
    return this.servicesService.create(data);
  }

  @Sse('events')
  getServiceEvents(): Observable<MessageEvent> {
    return this.servicesService.getSseEvents();
  }
}
