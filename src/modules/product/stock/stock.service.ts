import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IStockService } from './stock.interface';
import { ProductVariant } from '@prisma/client';
import { ProductVariantService } from '../variants/product.variants.service';
import { IProductVariantService } from '../variants/product.variants.interface';

@Injectable()
export class StockService implements IStockService {
  readonly #logger: Logger = new Logger(StockService.name);

  constructor(
    @Inject(ProductVariantService)
    private readonly productVariants: IProductVariantService,
  ) {}

  async addStock(productId: number, quantity: number): Promise<ProductVariant> {
    // Obtener el producto por ID.
    const product = await this.productVariants.getVariantById(productId);

    if (!product)
      throw new NotFoundException(
        `No se encontró el producto con ID ${productId}`,
      );

    // Editar la cantidad de stock actual de la variante.
    const updatedProduct = await this.productVariants.updateVariant(productId, {
      stock: product.stock + quantity,
    });

    return updatedProduct;
  }

  async removeStock(
    productId: number,
    quantity?: number,
  ): Promise<ProductVariant> {
    // Obtener el producto por ID.
    const product = await this.productVariants.getVariantById(productId);

    if (!product)
      throw new NotFoundException(
        `No se encontró el producto con ID ${productId}`,
      );

    // Editar la cantidad de stock actual de la variante.
    const updatedProduct = await this.productVariants.updateVariant(productId, {
      stock: product.stock - (quantity ?? 1),
    });

    return updatedProduct;
  }
}
