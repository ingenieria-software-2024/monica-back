import { Module } from '@nestjs/common';
import { ProductVariantService } from './product.variants.service';
import { ProductVariantController } from './product.variants.controller';
import { PrismaModule } from 'src/providers/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProductVariantController],
  providers: [ProductVariantService],
})
export class ProductVariantModule {}
