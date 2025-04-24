import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Patch,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiExtraModels,
} from '@nestjs/swagger';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@ApiTags('services')
@ApiExtraModels(UpdateServiceDto)
@Controller('api/services')
export class ServicesApiController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  @ApiOperation({ summary: 'Получить все услуги с пагинацией' })
  @ApiResponse({ status: 200, description: 'Список услуг.' })
  @ApiResponse({ status: 404, description: 'Не найдены услуги.' })
  findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.servicesService.findAllPaginated(+page, +limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить услугу по id' })
  @ApiParam({ name: 'id', required: true, description: 'id услуги' })
  @ApiResponse({ status: 200, description: 'Услуга найдена.' })
  @ApiResponse({ status: 404, description: 'Услуга не найдена.' })
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Создать услугу' })
  @ApiBody({ type: CreateServiceDto })
  @ApiResponse({ status: 201, description: 'Услуга создана.' })
  @ApiResponse({ status: 400, description: 'Неверные данные при создании.' })
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.servicesService.create(createServiceDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить услугу' })
  @ApiParam({ name: 'id', required: true, description: 'id услуги' })
  @ApiBody({ type: UpdateServiceDto })
  @ApiResponse({ status: 200, description: 'Услуга обновлена.' })
  @ApiResponse({ status: 404, description: 'Услуга не найдена.' })
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.servicesService.update(id, updateServiceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить услугу' })
  @ApiParam({ name: 'id', required: true, description: 'id услуги' })
  @ApiResponse({ status: 200, description: 'Услуга удалена.' })
  @ApiResponse({ status: 404, description: 'Услуга не найдена.' })
  remove(@Param('id') id: string) {
    return this.servicesService.remove(id);
  }
}
