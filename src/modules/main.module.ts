import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [ProductModule, CategoryModule, UsersModule],
})
export class MainModule {}
