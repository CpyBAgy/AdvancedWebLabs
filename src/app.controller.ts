import { Controller, Get, Query, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getIndexPage(@Query('login') login: string, @Query('logout') logout: string) {
    const isAuthenticated = login === 'true' || (login !== 'false' && logout !== 'true');
    const username = isAuthenticated ? 'Иван' : '';

    return {
      title: 'Главная',
      isActiveHome: true,
      featuredAnimals: [
        {
          image: 'pics/memes/tralalelo-tralala.webp',
          title: 'Редкие рептилии',
          description: 'Игуаны, хамелеоны, гекконы и другие уникальные рептилии со всего мира.',
          link: '/animals#reptiles'
        },
        {
          image: 'pics/memes/bombombini-gusini.webp',
          title: 'Экзотические птицы',
          description: 'Яркие попугаи, туканы и другие экзотические птицы, обученные общению с человеком.',
          link: '/animals#birds'
        },
        {
          image: 'pics/memes/orangutini-ananasini.jpeg',
          title: 'Экзотические млекопитающие',
          description: 'Редкие виды обезьян, сурикаты и другие необычные питомцы для вашего дома.',
          link: '/animals#mammals'
        }
      ],
      whyUsItems: [
        {
          icon: 'fas fa-award',
          title: 'Опыт и экспертиза',
          description: 'Более 10 лет работы с экзотическими животными. Наши специалисты регулярно проходят обучение за рубежом.'
        },
        {
          icon: 'fas fa-certificate',
          title: 'Гарантия качества',
          description: 'Мы продаем только здоровых, адаптированных животных с полным комплектом документов и ветеринарных сертификатов.'
        },
        {
          icon: 'fas fa-hands-helping',
          title: 'Поддержка после покупки',
          description: 'Наша забота не заканчивается после продажи. Мы консультируем по всем вопросам содержания и доступны 7 дней в неделю.'
        },
        {
          icon: 'fas fa-graduation-cap',
          title: 'Образовательные программы',
          description: 'Регулярные семинары и мастер-классы для владельцев экзотических питомцев. Обучение основам правильного ухода.'
        }
      ],
      testimonials: [
        {
          text: 'Благодаря "Два Холма" я стал счастливым обладателем редкого вида хамелеона. Консультации по уходу оказались бесценными!',
          name: 'Иван К.'
        },
        {
          text: 'Приобрели здесь экзотического попугая для дочери. Поражены уровнем сервиса и заботой о животных!',
          name: 'Елена М.'
        }
      ],
      isAuthenticated,
      username
    };
  }

  @Get('animals')
  @Render('animals')
  getAnimalsPage(@Query('login') login: string) {
    const isAuthenticated = login === 'true';
    const username = isAuthenticated ? 'Иван' : '';

    return {
      title: 'Животные',
      isActiveAnimals: true,
      featuredAnimals: [
        {
          image: 'pics/memes/burbaloni-lulioli.jpg',
          title: 'Хамелеон'
        },
        {
          image: 'pics/memes/chimpanzini-bananini.jpeg',
          title: 'Попугай'
        },
        {
          image: 'pics/memes/frigo-camelo.jpeg',
          title: 'Обезьяна'
        },
        {
          image: 'pics/memes/golubiro-shpioniro.jpg',
          title: 'Верблюд'
        },
        {
          image: 'pics/memes/il-cacto-hippopotamo.jpeg',
          title: 'Игуана'
        },
        {
          image: 'pics/memes/lirili-larila.webp',
          title: 'Тукан'
        },
        {
          image: 'pics/memes/octopusini-blueberriny.jpeg',
          title: 'Паук-птицеед'
        }
      ],
      animals: [
        {
          category: 'reptiles',
          image: 'pics/memes/orangutini-ananasini.jpeg',
          name: 'Зеленая игуана',
          description: 'Крупная травоядная ящерица с уникальной окраской и дружелюбным характером.',
          price: '65,000',
          size: 'До 2 м',
          lifespan: '15-20 лет'
        },
        {
          category: 'reptiles',
          image: 'pics/memes/penguinator-termoregulator.jpeg',
          name: 'Йеменский хамелеон',
          description: 'Удивительная рептилия, способная менять окраску в зависимости от настроения.',
          price: '45,000',
          size: 'До 60 см',
          lifespan: '5-8 лет'
        },
        {
          category: 'birds',
          image: 'pics/memes/tung-tung-tung-sahur.jpg',
          name: 'Сине-жёлтый ара',
          description: 'Яркий и интеллектуальный попугай, способный к обучению речи и трюкам.',
          price: '180,000',
          size: 'До 90 см',
          lifespan: '50-60 лет'
        },
        {
          category: 'birds',
          image: 'pics/memes/bobritto-bandito.jpeg',
          name: 'Африканский серый попугай',
          description: 'Один из самых умных и разговорчивых попугаев. Способен запоминать сотни слов.',
          price: '150,000',
          size: 'До 35 см',
          lifespan: '40-60 лет'
        },
        {
          category: 'mammals',
          image: 'pics/memes/boneca-ambalabu.webp',
          name: 'Капуцин',
          description: 'Умная и социальная обезьяна, легко поддающаяся дрессировке.',
          price: '450,000',
          size: '30-45 см',
          lifespan: '35-45 лет'
        }
      ],
      isAuthenticated,
      username
    };
  }

  @Get('about')
  @Render('about')
  getAboutPage(@Query('login') login: string) {
    const isAuthenticated = login === 'true';
    const username = isAuthenticated ? 'Иван' : '';

    return {
      title: 'О нас',
      isActiveAbout: true,
      isAuthenticated,
      username
    };
  }

  @Get('services')
  @Render('services')
  getServicesPage(@Query('login') login: string) {
    const isAuthenticated = login === 'true';
    const username = isAuthenticated ? 'Иван' : '';

    return {
      title: 'Услуги',
      isActiveServices: true,
      isAuthenticated,
      username
    };
  }

  @Get('contacts')
  @Render('contacts')
  getContactsPage(@Query('login') login: string) {
    const isAuthenticated = login === 'true';
    const username = isAuthenticated ? 'Иван' : '';

    return {
      title: 'Контакты',
      isActiveContacts: true,
      isAuthenticated,
      username
    };
  }

  @Get('form')
  @Render('form')
  getFormPage(@Query('login') login: string) {
    const isAuthenticated = login === 'true';
    const username = isAuthenticated ? 'Иван' : '';

    return {
      title: 'Вход/Регистрация',
      isAuthenticated,
      username
    };
  }

  @Get('users')
  @Render('users')
  getUsersPage(@Query('login') login: string) {
    const isAuthenticated = login === 'true';
    const username = isAuthenticated ? 'Иван' : '';

    return {
      title: 'Пользователи',
      isActiveUsers: true,
      isAuthenticated,
      username
    };
  }
}
