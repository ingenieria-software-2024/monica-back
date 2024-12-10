import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Session,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateQuantityDto } from './dto/update-quantity.dto';
import { ICartService } from './cart.interface';
import { AuthGuard } from 'src/pipes/auth/auth.guard';

@Controller('/cart')
@UseGuards(AuthGuard)
export class CartController {
  constructor(@Inject(CartService) private readonly service: ICartService) {}

  @Get()
  async getCart(@Session() session) {
    return this.service.getCart(session.userId);
  }

  @Post()
  async addToCart(@Body() addItemDto: AddItemDto, @Session() session) {
    return this.service.addToCart(session.userId, addItemDto);
  }

  @Put()
  async updateQuantity(
    @Body() updateQuantityDto: UpdateQuantityDto,
    @Session() session,
  ) {
    return this.service.updateQuantity(session.userId, updateQuantityDto);
  }

  @Delete()
  async clear(@Session() session) {
    return this.service.clearCart(session.userId);
  }

  @Delete('/:productId')
  async removeFromCart(
    @Param('productId', ParseIntPipe) productId: number,
    @Session() session,
  ) {
    return this.service.removeProduct(session.userId, productId);
  }
}
