import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Sse,
  Query,
  Render,
  BadRequestException,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { Observable, map } from 'rxjs';
import { Redirect } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  async findAll(@Query('userId') userId: string) {
    if (!userId) {
      throw new BadRequestException('Ошибка: userId не передан!');
    }
    const appointments = await this.appointmentsService.findByUserId(userId);
    return appointments;
  }

  @Sse('events')
  getAppointmentEvents(): Observable<MessageEvent> {
    return this.appointmentsService
      .getSseEvents()
      .pipe(
        map(
          (event) =>
            new MessageEvent('message', { data: JSON.stringify(event) }),
        ),
      );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.appointmentsService.findOne(id);
  }

  @Post()
  async create(@Body() createAppointmentDto: CreateAppointmentDto) {
    const appointment =
      await this.appointmentsService.create(createAppointmentDto);

    this.appointmentsService.broadcastEvent({
      action: 'created',
      appointment,
    });

    return appointment;
  }

  @Post('update')
  @Redirect('/appointments')
  async update(@Body() data) {
    await this.appointmentsService.update(data.id, {
      date: data.date,
      petId: data.petId,
      serviceId: data.serviceId,
    });

    return { url: `/appointments?userId=${data.userId}` };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.appointmentsService.remove(id);

    this.appointmentsService.broadcastEvent({
      action: 'deleted',
      deletedId: id,
    });

    return { message: 'Deleted' };
  }

  @Get('view')
  @Render('appointments')
  async getAppointments(@Query('userId') userId: string) {
    if (!userId) {
      throw new BadRequestException('Ошибка: userId не передан!');
    }

    const appointments = await this.appointmentsService.findByUserId(userId);
    return { title: 'Запись на приём', appointments };
  }
}
