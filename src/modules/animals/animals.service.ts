import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Animal } from './entities/animal.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AnimalsService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2
  ) {}

  // Получить всех животных
  async findAll() {
    return this.prisma.animal.findMany({
      include: {
        category: true,
      },
    });
  }

  // Получить животных по категории
  async findByCategory(categoryId: string) {
    return this.prisma.animal.findMany({
      where: {
        categoryId: categoryId,
      },
      include: {
        category: true,
      },
    });
  }

  // Получить животное по ID
  async findOne(id: string) {
    const animal = await this.prisma.animal.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!animal) {
      throw new NotFoundException(`Животное с ID ${id} не найдено`);
    }

    return animal;
  }

  // Создать новое животное
  async create(data: {
    name: string;
    species: string;
    price: number;
    age?: number;
    gender?: string;
    description?: string;
    categoryId: string;
  }) {
    const animal = await this.prisma.animal.create({
      data: {
        ...data,
        status: 'available', // По умолчанию животное доступно
      },
    });

    // Emitting an event that a new animal has been added
    this.eventEmitter.emit('animal.created', animal);

    return animal;
  }

  // Обновить животное
  async update(
    id: string,
    data: {
      name?: string;
      species?: string;
      price?: number;
      age?: number;
      gender?: string;
      description?: string;
      status?: string;
      categoryId?: string;
    },
  ) {
    // Проверяем, существует ли животное
    await this.findOne(id);

    return this.prisma.animal.update({
      where: { id },
      data,
      include: {
        category: true,
      },
    });
  }

  // Удалить животное
  async remove(id: string) {
    // Проверяем, существует ли животное
    await this.findOne(id);

    return this.prisma.animal.delete({
      where: { id },
    });
  }

  // Получить категории животных
  async getCategories() {
    return this.prisma.category.findMany();
  }
}
