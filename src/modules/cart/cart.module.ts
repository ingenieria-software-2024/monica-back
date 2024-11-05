import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { ProductVariantModule } from '../product/variants/product.variants.module';

@Module({
  imports: [ProductVariantModule],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
