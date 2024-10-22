import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { PrismaService } from 'src/providers/prisma.service';
import { CategoryModule } from '../category/category.module';
import { ProductController } from './product.controller';

@Module({
  imports: [CategoryModule],
  providers: [ProductService, PrismaService],
  exports: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
