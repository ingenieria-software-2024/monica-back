import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { StockModule } from './stock/stock.module';
import { CategoryModule } from './category/category.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [ProductModule, StockModule, CategoryModule, UsersModule],
})
export class MainModule {}
