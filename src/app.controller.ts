import { Controller, Get, Query, Render, Res } from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users/users.service';
import { PetsService } from './pets/pets.service';
import { ServicesService } from './services/services.service';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller()
export class AppController {
  constructor(
    private readonly usersService: UsersService,
    private readonly petsService: PetsService,
    private readonly servicesService: ServicesService,
  ) {}

  @Get('/')
  @Render('index')
  getLoginPage(@Query('error') error: string) {
    return { error };
  }

  @Get('/login')
  async login(@Query('email') email: string, @Res() res: Response) {
    if (!email) {
      return res.redirect('/?error=Введите email');
    }

    const user = await this.usersService.findByEmail(email);
    if (user) {
      res.redirect(`/pet_shop_main?userId=${user.id}`);
    } else {
      res.redirect('/?error=Пользователь не найден');
    }
  }

  private async getUserData(userId: string) {
    if (!userId) return null;
    return await this.usersService.findById(userId);
  }

  @Get('/pet_shop_main')
  @Render('pet_shop_main')
  async getHome(@Query('userId') userId: string) {
    const user = await this.getUserData(userId);
    return { title: 'Главная страница', user };
  }

  @Get('/animals')
  @Render('animals')
  async getAnimals(@Query('userId') userId: string) {
    const user = await this.getUserData(userId);
    return { title: 'Животные', user };
  }

  @Get('/services')
  @Render('services')
  async getServices(@Query('userId') userId: string) {
    const user = await this.getUserData(userId);
    return { title: 'Услуги', user };
  }

  @Get('/about')
  @Render('about')
  async getAbout(@Query('userId') userId: string) {
    const user = await this.getUserData(userId);
    return { title: 'О нас', user };
  }

  @Get('/contacts')
  @Render('contacts')
  async getContacts(@Query('userId') userId: string) {
    const user = await this.getUserData(userId);
    return { title: 'Контакты', user };
  }

  @Get('/userlist')
  @Render('userlist')
  async getUserList(@Query('userId') userId: string) {
    const user = await this.getUserData(userId);
    return { title: 'Пользователи', user };
  }

  @Get('/form')
  @Render('form')
  async getForms(@Query('userId') userId: string) {
    const user = await this.getUserData(userId);
    return { title: 'Форма', user };
  }

  @Get('/appointments')
  @Render('appointments')
  async getAppointments(@Query('userId') userId: string) {
    const user = await this.usersService.findById(userId);
    const pets = await this.petsService.findByOwnerId(userId);
    const services = await this.servicesService.findAll();

    return { title: 'Запись', user, pets, services };
  }

  @Get('/serviceadd')
  @Render('serviceadd')
  async getServiceAddPage(@Query('userId') userId: string) {
    const user = await this.getUserData(userId);
    return { title: 'Управление услугами', user };
  }

  @Get('/addpet')
  @Render('addpet')
  async getAddPetPage(@Query('userId') userId: string) {
    const user = await this.getUserData(userId);
    return { title: 'Добавить питомца', user };
  }

  @Get('/logout')
  logout(@Res() res: Response) {
    res.redirect('/');
  }
}