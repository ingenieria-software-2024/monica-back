import { Module } from '@nestjs/common';
import { SizeController } from "./size.controller";
import { SizeService } from './size.service';
import { PrismaService } from 'src/providers/prisma.service';

@Module({
  controllers: [SizeController],
  providers: [SizeService, PrismaService],
  exports: [SizeService],
})
export class SizeModule {}