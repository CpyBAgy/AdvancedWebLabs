import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Patch,
  Delete,
  Query,
  Header,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { CacheTTL } from '@nestjs/common/cache';
import { ETagInterceptor } from '../common/interceptors/etag.interceptor';
import { LoggingCacheInterceptor } from '../common/interceptors/logging-cache.interceptor';

@ApiTags('pets')
@UseInterceptors(ETagInterceptor, LoggingCacheInterceptor)
@Controller('api/pets')
export class PetsApiController {
  constructor(private readonly petsService: PetsService) {}

  @Get()
  @CacheTTL(5)
  @Header('Cache-Control', 'public, max-age=3600')
  @ApiOperation({ summary: 'Получить всех животных (с пагинацией)' })
  @ApiResponse({ status: 200, description: 'Успешно получено' })
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.petsService.findAllPaginated(+page, +limit);
  }

  @Get(':id')
  @CacheTTL(5)
  @Header('Cache-Control', 'public, max-age=3600')
  @ApiOperation({ summary: 'Получить животное по ID' })
  @ApiResponse({ status: 200, description: 'Найдено успешно' })
  async findOne(@Param('id') id: string) {
    return this.petsService.findOne(id);
  }

  @Post()
  @CacheTTL(5)
  @ApiOperation({ summary: 'Создать животное' })
  @ApiResponse({ status: 201, description: 'Создано успешно' })
  async create(@Body() dto: CreatePetDto) {
    return this.petsService.create(dto);
  }

  @Patch(':id')
  @CacheTTL(5)
  @ApiOperation({ summary: 'Обновить животное' })
  async update(@Param('id') id: string, @Body() dto: UpdatePetDto) {
    return this.petsService.update(id, dto);
  }

  @Delete(':id')
  @CacheTTL(5)
  @ApiOperation({ summary: 'Удалить животное' })
  @ApiResponse({ status: 200, description: 'Удалено успешно' })
  async remove(@Param('id') id: string) {
    return this.petsService.remove(id);
  }
}
