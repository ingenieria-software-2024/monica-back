import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { StockModule } from './stock/stock.module';
import { CategoryModule } from './category/category.module';
import { VariantCategoryModule } from './variantCategory/variantCategory.module';

@Module({
  imports: [ProductModule, StockModule, CategoryModule, VariantCategoryModule],
})
export class MainModule {}
