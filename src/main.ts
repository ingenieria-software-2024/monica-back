import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configura el middleware de sesión
  app.use(
    session({
      secret: 'mi-secreto',
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false }, // Asegúrate de usar `true` en producción con HTTPS
    }),
  );

  // Habilita el ValidationPipe para la validación automática de DTOs
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
