import { Module } from '@nestjs/common';
import { VariantCategoryService } from './variantCategory.service';
import { VariantCategoryController } from './variantCategory.controller';
import { PrismaModule } from 'src/providers/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [VariantCategoryController],
  providers: [VariantCategoryService],
  exports: [VariantCategoryService],
})
export class VariantCategoryModule {}