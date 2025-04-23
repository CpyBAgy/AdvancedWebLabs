import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as hbs from 'hbs';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(cookieParser());

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  
  hbs.registerPartials(join(__dirname, '..', 'views/partials'));
  
  hbs.registerHelper('json', function(context) {
    return JSON.stringify(context);
  });
  
  hbs.registerHelper('eq', function(a, b) {
    return a === b;
  });
  
  hbs.registerHelper('typeof', function(value) {
    return typeof value;
  });

  app.use((req, res, next) => {
    const path = req.path;
    
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(req.query)) {
      params.set(key, value as string);
    }
    const queryString = params.toString() ? `?${params.toString()}` : '';
    
    if (path === '/index.html' || path === '/') {
      return res.redirect(`/${queryString}`);
    } else if (path === '/animals.html') {
      return res.redirect(`/animals${queryString}`);
    } else if (path === '/services.html') {
      return res.redirect(`/services${queryString}`);
    } else if (path === '/contacts.html') {
      return res.redirect(`/contacts${queryString}`);
    } else if (path === '/about.html') {
      return res.redirect(`/about${queryString}`);
    }
    
    next();
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap(); 