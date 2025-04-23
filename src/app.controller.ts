import { Controller, Get, Query, Render, Redirect, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Получение контекста авторизации
  private getAuthContext(req: Request): any {
    const authFromUrl = req.query.auth === 'true';
    const usernameFromUrl = req.query.username as string;
    const authFromCookie = req.cookies && req.cookies.isAuthenticated === 'true';
    const usernameFromCookie = req.cookies ? req.cookies.username : null;

    const isAuthenticated = authFromUrl || authFromCookie;
    const username = usernameFromUrl || usernameFromCookie || 'Пользователь';

    return {
      isAuthenticated,
      username: isAuthenticated ? username : null,
    };
  }

  // Редиректы с HTML файлов
  @Get('index.html')
  @Redirect()
  redirectIndex(@Query() query: any) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      params.set(key, value as string);
    }
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return { url: `/${queryString}` };
  }

  @Get('about.html')
  @Redirect()
  redirectAbout(@Query() query: any) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      params.set(key, value as string);
    }
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return { url: `/about${queryString}` };
  }

  @Get('animals.html')
  @Redirect()
  redirectAnimals(@Query() query: any) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      params.set(key, value as string);
    }
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return { url: `/animals${queryString}` };
  }

  @Get('services.html')
  @Redirect()
  redirectServices(@Query() query: any) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      params.set(key, value as string);
    }
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return { url: `/services${queryString}` };
  }

  @Get('contacts.html')
  @Redirect()
  redirectContacts(@Query() query: any) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      params.set(key, value as string);
    }
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return { url: `/contacts${queryString}` };
  }

  // Основные страницы
  @Get()
  @Render('index')
  getIndex(@Req() req: Request) {
    const authContext = this.getAuthContext(req);
    
    return {
      title: 'Главная',
      ...authContext,
      featuredPets: [
        {
          id: 1,
          name: 'Игуана',
          species: 'Рептилия',
          age: '2 года',
          price: 25000,
          image: '/pics/iguana.jpg'
        },
        {
          id: 2,
          name: 'Попугай Жако',
          species: 'Птица',
          age: '1 год',
          price: 50000,
          image: '/pics/parrot.jpg'
        },
        {
          id: 3,
          name: 'Паук-птицеед',
          species: 'Паукообразные',
          age: '3 года',
          price: 15000,
          image: '/pics/spider.jpg'
        }
      ],
      featuredServices: [
        {
          id: 1,
          name: 'Ветеринарный осмотр',
          description: 'Полный осмотр животного ветеринаром',
          price: 2000,
          image: '/pics/vet.jpg'
        },
        {
          id: 2,
          name: 'Груминг',
          description: 'Полный уход за внешним видом питомца',
          price: 1500,
          image: '/pics/grooming.jpg'
        },
        {
          id: 3,
          name: 'Обучение',
          description: 'Дрессировка и обучение базовым командам',
          price: 3000,
          image: '/pics/training.jpg'
        }
      ]
    };
  }

  @Get('animals')
  @Render('animals')
  getAnimals(@Req() req: Request) {
    const authContext = this.getAuthContext(req);
    
    return {
      title: 'Животные',
      ...authContext
    };
  }

  @Get('services')
  @Render('services')
  getServices(@Req() req: Request) {
    const authContext = this.getAuthContext(req);
    
    return {
      title: 'Услуги',
      ...authContext
    };
  }

  @Get('contacts')
  @Render('contacts')
  getContacts(@Req() req: Request) {
    const authContext = this.getAuthContext(req);
    
    return {
      title: 'Контакты',
      ...authContext
    };
  }

  @Get('about')
  @Render('about')
  getAbout(@Req() req: Request) {
    const authContext = this.getAuthContext(req);
    
    return {
      title: 'О нас',
      ...authContext
    };
  }
}
