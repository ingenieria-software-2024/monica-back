import { Module } from '@nestjs/common';
import { AppController } from './app.controllers'; // Importa el controlador
import { CartModule } from './cart/cart.module';

@Module({
  imports: [CartModule], // Módulo del carrito
  controllers: [AppController], // Registra el controlador
  providers: [],
})
export class AppModule {}
