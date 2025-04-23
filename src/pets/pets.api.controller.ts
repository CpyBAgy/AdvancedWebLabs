import {
  Controller, Get, Post, Param, Body, Patch, Delete, Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';

@ApiTags('pets')
@Controller('api/pets')
export class PetsApiController {
  constructor(private readonly petsService: PetsService) {}

  @Get()
  @ApiOperation({ summary: 'Получить всех животных (с пагинацией)' })
  @ApiResponse({ status: 200, description: 'Успешно получено' })
  findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.petsService.findAllPaginated(+page, +limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить одно животное по ID' })
  @ApiResponse({ status: 200, description: 'Животное найдено' })
  @ApiResponse({ status: 404, description: 'Животное не найдено' })
  findOne(@Param('id') id: string) {
    return this.petsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Создать новое животное' })
  @ApiResponse({ status: 201, description: 'Животное создано' })
  create(@Body() dto: CreatePetDto) {
    return this.petsService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить животное' })
  update(@Param('id') id: string, @Body() dto: UpdatePetDto) {
    return this.petsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить животное' })
  @ApiResponse({ status: 200, description: 'Удалено успешно' })
  remove(@Param('id') id: string) {
    return this.petsService.remove(id);
  }
}
