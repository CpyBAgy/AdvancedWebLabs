
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Render,
  Redirect,
  Req,
  NotFoundException,
  Sse
} from '@nestjs/common';
import { Request } from 'express';
import { AnimalsService } from './animals.service';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable, fromEvent, map } from 'rxjs';

@Controller('animals')
export class AnimalsController {
  constructor(
    private readonly animalsService: AnimalsService,
    private eventEmitter: EventEmitter2
  ) {}

  // Получить все животные (список)
  @Get()
  @Render('animals/index')
  async findAll(@Req() req: Request) {
    const animals = await this.animalsService.findAll();
    const categories = await this.animalsService.getCategories();

    // Получаем параметры из URL
    const isAuthenticated = req.query.auth === 'true';
    const username = req.query.username || null;

    return {
      title: 'Экзотические животные',
      animals,
      categories,
      isAuthenticated,
      username
    };
  }

  // Страница с формой добавления нового животного
  @Get('add')
  @Render('animals/add')
  async renderAddForm(@Req() req: Request) {
    const categories = await this.animalsService.getCategories();

    // Получаем параметры из URL
    const isAuthenticated = req.query.auth === 'true';
    const username = req.query.username || null;

    return {
      title: 'Добавление нового животного',
      categories,
      isAuthenticated,
      username
    };
  }

  // Получить подробности о конкретном животном
  @Get(':id')
  @Render('animals/detail')
  async findOne(@Param('id') id: string, @Req() req: Request) {
    try {
      const animal = await this.animalsService.findOne(id);

      // Получаем параметры из URL
      const isAuthenticated = req.query.auth === 'true';
      const username = req.query.username || null;

      return {
        title: animal.name,
        animal,
        isAuthenticated,
        username
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        return {
          title: 'Животное не найдено',
          errorMessage: error.message,
          isAuthenticated: req.query.auth === 'true',
          username: req.query.username || null
        };
      }
      throw error;
    }
  }

  // Страница редактирования животного
  @Get(':id/edit')
  @Render('animals/edit')
  async renderEditForm(@Param('id') id: string, @Req() req: Request) {
    try {
      const animal = await this.animalsService.findOne(id);
      const categories = await this.animalsService.getCategories();

      // Получаем параметры из URL
      const isAuthenticated = req.query.auth === 'true';
      const username = req.query.username || null;

      return {
        title: `Редактирование ${animal.name}`,
        animal,
        categories,
        isAuthenticated,
        username
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        return {
          title: 'Животное не найдено',
          errorMessage: error.message,
          isAuthenticated: req.query.auth === 'true',
          username: req.query.username || null
        };
      }
      throw error;
    }
  }

  // Обработка создания нового животного
  @Post()
  @Redirect('/animals')
  async create(@Body() createAnimalDto: CreateAnimalDto, @Req() req: Request) {
    const animal = await this.animalsService.create(createAnimalDto);

    // Передаем параметры авторизации в редирект
    const redirectUrl = '/animals';
    const isAuthenticated = req.query.auth === 'true';
    const username = req.query.username;

    if (isAuthenticated && username) {
      return { url: `${redirectUrl}?auth=true&username=${username}` };
    }

    return { url: redirectUrl };
  }

  // Обработка обновления животного
  @Post(':id')
  @Redirect('/animals')
  async update(
    @Param('id') id: string,
    @Body() updateAnimalDto: UpdateAnimalDto,
    @Req() req: Request
  ) {
    await this.animalsService.update(id, updateAnimalDto);

    // Передаем параметры авторизации в редирект
    const redirectUrl = '/animals';
    const isAuthenticated = req.query.auth === 'true';
    const username = req.query.username;

    if (isAuthenticated && username) {
      return { url: `${redirectUrl}?auth=true&username=${username}` };
    }

    return { url: redirectUrl };
  }

  // Обработка удаления животного
  @Post(':id/delete')
  @Redirect('/animals')
  async remove(@Param('id') id: string, @Req() req: Request) {
    await this.animalsService.remove(id);

    // Передаем параметры авторизации в редирект
    const redirectUrl = '/animals';
    const isAuthenticated = req.query.auth === 'true';
    const username = req.query.username;

    if (isAuthenticated && username) {
      return { url: `${redirectUrl}?auth=true&username=${username}` };
    }

    return { url: redirectUrl };
  }

  @Sse('events')
  events(): Observable<MessageEvent> {
    // Отправляем тестовое сообщение при подключении
    this.eventEmitter.emit('animal.created', {
      name: 'Тестовое животное',
      species: 'Тестовый вид',
      id: 'test-id',
    });

    return fromEvent(this.eventEmitter, 'animal.created').pipe(
      map((data) => {
        // Безопасное получение данных животного
        const animal = data as any;
        const name = animal && animal.name ? animal.name : 'неизвестное животное';

        return {
          data: {
            message: `Добавлено новое животное: ${name}`,
            animal: animal,
          },
        } as MessageEvent;
      }),
    );
  }
}
