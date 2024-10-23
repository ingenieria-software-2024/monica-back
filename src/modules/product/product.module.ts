import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { PrismaService } from 'src/providers/prisma.service';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [CategoryModule],
  providers: [ProductService, PrismaService],
  exports: [ProductService],
})
export class ProductModule {}
