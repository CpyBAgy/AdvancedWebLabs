import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as hbs from 'hbs';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { UpdatePetDto } from './pets/dto/update-pet.dto';
import { UpdateServiceDto } from './services/dto/update-service.dto';
import { UpdateAppointmentDto } from './appointments/dto/update-appointment.dto';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableCors();
  app.setViewEngine('hbs');
  app.useStaticAssets(join(__dirname, '..', 'public'));

  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  hbs.registerPartials(join(__dirname, '..', 'views', 'partials'));
  hbs.registerHelper('ifEquals', function (arg1, arg2, options) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    return arg1 === arg2 ? options.fn(this) : options.inverse(this);
  });
  hbs.registerHelper('eq', (a, b) => a === b);
  const config = new DocumentBuilder()
    .setTitle('Lapochka API')
    .setDescription('Документация к REST API приложения "Лапочка"')
    .setVersion('1.0')
    .addTag('users')
    .addTag('pets')
    .addTag('services')
    .addTag('appointments')
    .addTag('contacts')
    .build();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      validationError: {
        target: false,
        value: false,
      },
    }),
  );

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [UpdatePetDto, UpdateServiceDto, UpdateAppointmentDto],
  });

  SwaggerModule.setup('api-docs', app, document);
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();
