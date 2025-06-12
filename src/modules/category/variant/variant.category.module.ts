import { Module } from '@nestjs/common';
import { VariantCategoryService } from './variant.category.service';
import { VariantCategoryController } from './variant.category.controller';
import { PrismaModule } from 'src/providers/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [VariantCategoryController],
  providers: [VariantCategoryService],
  exports: [VariantCategoryService],
})
export class VariantCategoryModule {}
