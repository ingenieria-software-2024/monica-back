import { Module } from '@nestjs/common';
import { SizeModule } from './size/size.module';
import { ColorModule } from './color/color.module';

@Module({
  imports: [SizeModule, ColorModule],
})
export class StockModule {}
