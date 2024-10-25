import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { SubCategoryService } from './subcategory.service';
import { PrismaService } from 'src/providers/prisma.service';
import { VariantCategoryModule } from './variant/variant.category.module';
import { CategoryController } from './category.controller';

@Module({
  imports: [VariantCategoryModule],
  providers: [CategoryService, SubCategoryService, PrismaService],
  exports: [CategoryService, SubCategoryService],
  controllers: [CategoryController],
})
export class CategoryModule {}
