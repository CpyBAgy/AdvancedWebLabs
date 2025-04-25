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
  UploadedFile,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CacheTTL } from '@nestjs/cache-manager';
import { ETagInterceptor } from '../common/interceptors/etag.interceptor';
import { LoggingCacheInterceptor } from '../common/interceptors/logging-cache.interceptor';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('users')
@UseInterceptors(ETagInterceptor, LoggingCacheInterceptor)
@Controller('api/users')
export class UsersApiController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Get()
  @Header('Cache-Control', 'public, max-age=3600')
  @CacheTTL(5)
  @ApiOperation({ summary: 'Получить всех пользователей (с пагинацией)' })
  @ApiResponse({ status: 200, description: 'Пользователи получены' })
  findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.usersService.findAllPaginated(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить пользователя по ID' })
  @ApiResponse({ status: 200, description: 'Пользователь найден' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Создать пользователя' })
  @ApiResponse({ status: 201, description: 'Пользователь создан' })
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить пользователя' })
  @ApiResponse({ status: 200, description: 'Пользователь обновлён' })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить пользователя' })
  @ApiResponse({ status: 200, description: 'Пользователь удалён' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
