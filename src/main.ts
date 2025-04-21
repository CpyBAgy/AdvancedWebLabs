import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as hbs from 'hbs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'public'));

  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  // Регистрируем партиалы
  hbs.registerPartials(join(__dirname, '..', 'views/partials'));

  // Регистрируем хелперы для Handlebars
  hbs.registerHelper('contentFor', function(name, options) {
    const blocks = this._blocks || (this._blocks = {});
    const block = blocks[name] || (blocks[name] = []);
    block.push(options.fn(this));
  });

  hbs.registerHelper('block', function(name) {
    const val = (this._blocks || {})[name] || [];
    return val.join('\n');
  });

  // Добавляем хелпер для сравнения значений
  hbs.registerHelper('ifEquals', function(arg1, arg2, options) {
    return (arg1 === arg2) ? options.fn(this) : options.inverse(this);
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
