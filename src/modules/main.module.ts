import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { ProductVariantModule } from './product/variants/product.variants.module';
import { CategoryModule } from './category/category.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [ProductModule, ProductVariantModule, CategoryModule, UsersModule],
})
export class MainModule {}
