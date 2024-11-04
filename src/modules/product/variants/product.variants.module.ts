import { Module } from '@nestjs/common';
import { ProductVariantService } from './product.variants.service';
import { ProductVariantController } from './product.variants.controller';
import { PrismaModule } from 'src/providers/prisma.module';
import { StockService } from '../stock/stock.service';

@Module({
  imports: [PrismaModule],
  controllers: [ProductVariantController],
  providers: [ProductVariantService, StockService],
  exports: [ProductVariantService],
})
export class ProductVariantModule {}
