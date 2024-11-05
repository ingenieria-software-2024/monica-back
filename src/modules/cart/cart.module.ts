import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { ProductVariantModule } from '../product/variants/product.variants.module';
import { PrismaService } from '../../providers/prisma.service';

@Module({
  imports: [ProductVariantModule],
  controllers: [CartController],
  providers: [CartService, PrismaService],
})
export class CartModule {}
