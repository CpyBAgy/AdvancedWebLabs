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
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CacheTTL } from '@nestjs/cache-manager';
import { ETagInterceptor } from '../common/interceptors/etag.interceptor';
import { LoggingCacheInterceptor } from '../common/interceptors/logging-cache.interceptor';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@ApiTags('services')
@UseInterceptors(ETagInterceptor, LoggingCacheInterceptor)
@Controller('api/services')
export class ServicesApiController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  @Header('Cache-Control', 'public, max-age=3600')
  @CacheTTL(5)
  @ApiOperation({ summary: 'Получить все услуги (с пагинацией)' })
  @ApiResponse({ status: 200, description: 'Услуги получены' })
  findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.servicesService.findAllPaginated(+page, +limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить услугу по ID' })
  @ApiResponse({ status: 200, description: 'Услуга найдена' })
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Создать услугу' })
  @ApiResponse({ status: 201, description: 'Услуга создана' })
  create(@Body() dto: CreateServiceDto) {
    return this.servicesService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить услугу' })
  @ApiResponse({ status: 200, description: 'Услуга обновлена' })
  update(@Param('id') id: string, @Body() dto: UpdateServiceDto) {
    return this.servicesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить услугу' })
  @ApiResponse({ status: 200, description: 'Услуга удалена' })
  remove(@Param('id') id: string) {
    return this.servicesService.remove(id);
  }
}