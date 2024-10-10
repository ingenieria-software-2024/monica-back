import { Module } from '@nestjs/common';
import { CartController } from './cart.controller'; // Asegúrate de que la ruta sea correcta
import { CartService } from './cart.service';

@Module({
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
