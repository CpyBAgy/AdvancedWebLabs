import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CreatePetForUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('users')
@Controller('api/users')
export class UsersApiController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Создать нового пользователя' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'Пользователь успешно создан' })
  @ApiResponse({ status: 400, description: 'Неверный формат данных' })
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить список пользователей с пагинацией' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({ status: 200, description: 'Список пользователей' })
  findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.usersService.findAllPaginated(+page, +limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить одного пользователя по id' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 200, description: 'Пользователь найден' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить пользователя' })
  @ApiParam({ name: 'id', required: true })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'Пользователь обновлен' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }
  @Get(':id/pets')
  @ApiOperation({ summary: 'Получить список животных пользователя по id' })
  @ApiParam({ name: 'id', required: true, description: 'UUID пользователя' })
  @ApiResponse({ status: 200, description: 'Список животных пользователя' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  getUserPets(@Param('id') id: string) {
    return this.usersService.findPetsByUserId(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить пользователя' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 204, description: 'Пользователь удалён' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
  @Post(':id/pets')
  @ApiOperation({ summary: 'Создать животное для пользователя' })
  @ApiParam({ name: 'id', required: true, description: 'UUID пользователя' })
  @ApiBody({ type: CreatePetForUserDto })
  @ApiResponse({ status: 201, description: 'Животное успешно создано' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  createPetForUser(
    @Param('id') userId: string,
    @Body() dto: CreatePetForUserDto,
  ) {
    return this.usersService.createPetForUser(userId, dto);
  }
}
