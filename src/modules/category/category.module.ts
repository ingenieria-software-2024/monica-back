import { Module } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma.service';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { VariantCategoryModule } from './variant/variant.category.module';
import { SubCategoryService } from './subcategory.service';

@Module({
  imports: [VariantCategoryModule],
  providers: [CategoryService, SubCategoryService, PrismaService],
  exports: [CategoryService, SubCategoryService],
  controllers: [CategoryController],
})
export class CategoryModule {}
