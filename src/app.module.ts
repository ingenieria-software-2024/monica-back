import { Module } from '@nestjs/common';
import { SizeController } from './size/size.controller';
import { ColorController } from './color/color.controller';
import { SizeService } from './size/size.service';
import { ColorService } from './color/color.service';
import { PrismaService } from './providers/prisma.service';
import { SizeModule } from './size/size.module';
import { ColorModule } from './color/color.module';

@Module({
  controllers: [SizeController, ColorController],
  providers: [SizeService, ColorService, PrismaService],
  imports: [SizeModule, ColorModule],
})
export class AppModule {}
