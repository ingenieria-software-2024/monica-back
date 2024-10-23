import { Module } from '@nestjs/common';
import { ColorController } from './color.controller';
import { ColorService } from './color.service';
import { PrismaService } from 'src/providers/prisma.service';

@Module({
  controllers: [ColorController],
  providers: [ColorService, PrismaService],
  exports: [ColorService],
})
export class ColorModule {}
