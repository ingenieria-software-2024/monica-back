import { Module } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma.service';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { CategoryModule } from '../category/category.module';
import { VariantCategoryModule } from '../category/variant/variant.category.module';

@Module({
  imports: [CategoryModule, VariantCategoryModule],
  providers: [ProductService, PrismaService],
  exports: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
