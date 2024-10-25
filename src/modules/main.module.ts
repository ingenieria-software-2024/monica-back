import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { StockModule } from './stock/stock.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [ProductModule, StockModule, CategoryModule],
})
export class MainModule {}
