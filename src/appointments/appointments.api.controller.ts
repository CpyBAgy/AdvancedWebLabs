import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Patch,
  Delete,
  Query,
  UseInterceptors,
  Header,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CacheTTL } from '@nestjs/cache-manager';
import { ETagInterceptor } from '../common/interceptors/etag.interceptor';
import { LoggingCacheInterceptor } from '../common/interceptors/logging-cache.interceptor';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@ApiTags('appointments')
@UseInterceptors(ETagInterceptor, LoggingCacheInterceptor)
@Controller('api/appointments')
export class AppointmentsApiController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  @Header('Cache-Control', 'public, max-age=3600')
  @CacheTTL(5)
  @ApiOperation({ summary: 'Получить все записи' })
  @ApiResponse({ status: 200, description: 'Успешно получено' })
  findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.appointmentsService.findAllPaginated(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить запись по ID' })
  @ApiResponse({ status: 200, description: 'Найдена успешно' })
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Создать запись' })
  @ApiResponse({ status: 201, description: 'Запись создана' })
  create(@Body() dto: CreateAppointmentDto) {
    return this.appointmentsService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить запись' })
  @ApiResponse({ status: 200, description: 'Обновлено успешно' })
  update(@Param('id') id: string, @Body() dto: UpdateAppointmentDto) {
    return this.appointmentsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить запись' })
  @ApiResponse({ status: 200, description: 'Удалено успешно' })
  remove(@Param('id') id: string) {
    return this.appointmentsService.remove(id);
  }
}
