import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Начинаем заполнение базы данных...');

    // Создаем категории животных
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
      }
    ];

    console.log('Создаем категории...');
    for (const category of categories) {
      await prisma.category.upsert({
        where: { name: category.name },
        update: {},
        create: category,
      });
    }

    console.log('Категории успешно созданы!');

    // Создаем тестовое животное
    const reptileCategory = await prisma.category.findFirst({
      where: { name: 'Рептилии' },
    });

    if (reptileCategory) {
      console.log('Создаем тестовое животное...');

      await prisma.animal.create({
        data: {
          name: 'Игуана зеленая',
          species: 'Игуана',
          price: 15000,
          age: 2,
          gender: 'male',
          description: 'Красивая зеленая игуана в отличном состоянии',
          status: 'available',
          categoryId: reptileCategory.id,
        },
      });

      console.log('Тестовое животное создано!');
    }

    console.log('База данных успешно заполнена!');
  } catch (error) {
    console.error('Ошибка при заполнении базы данных:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
