import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { PrismaService } from 'src/providers/prisma.service';
import { CategoryModule } from '../category/category.module';
import { VariantCategoryModule } from '../category/variant/variant.category.module';
import { ProductController } from './product.controller';
import { ProductVariantModule } from './variants/product.variants.module';

@Module({
  imports: [CategoryModule, VariantCategoryModule, ProductVariantModule],
  providers: [ProductService, PrismaService],
  exports: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
