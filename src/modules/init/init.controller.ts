import { Controller, Get, Render } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Controller('init-db')
export class InitDbController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @Render('init')
  async initializeDb() {
    try {
      const categories = [
        {
          name: 'Рептилии',
          description: 'Экзотические рептилии различных видов',
        },
        {
          name: 'Птицы',
          description: 'Экзотические и редкие виды птиц',
        },
        {
          name: 'Млекопитающие',
          description: 'Экзотические млекопитающие',
        },
        {
          name: 'Паукообразные',
          description: 'Пауки, скорпионы и другие паукообразные',
        },
      ];

      const createdCategories: Array<{ id: string; name: string; description: string | null }> = [];

      for (const category of categories) {
        const createdCategory = await this.prisma.category.upsert({
          where: { name: category.name },
          update: {},
          create: category,
        });

        createdCategories.push(createdCategory);
      }

      return {
        title: 'Инициализация базы данных',
        success: true,
        message: 'База данных успешно инициализирована',
        categories: createdCategories,
      };
    } catch (error) {
      return {
        title: 'Ошибка инициализации',
        success: false,
        message: `Ошибка при инициализации базы данных: ${error.message}`,
        error: error,
      };
    }
  }
}