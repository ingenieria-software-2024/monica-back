import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    session({
      secret: 'mi-secreto',
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false }, // Asegúrate de usar `true` en producción con HTTPS
    }),
  );

  await app.listen(3000);
}
bootstrap();
