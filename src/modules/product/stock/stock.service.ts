import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IStockService } from './stock.interface';
import { Prisma, ProductVariant } from '@prisma/client';
import { ProductVariantService } from '../variants/product.variants.service';
import { IProductVariantService } from '../variants/product.variants.interface';
import { PrismaService } from 'src/providers/prisma.service';

@Injectable()
export class StockService implements IStockService {
  readonly #logger: Logger = new Logger(StockService.name);

  /** Accesor para las operaciones CRUD de los logs de stock. */
  readonly #stockLog: Prisma.HistoricStockLogDelegate;

  constructor(
    private readonly prisma: PrismaService,
    @Inject(ProductVariantService)
    private readonly productVariants: IProductVariantService,
  ) {
    this.#stockLog = prisma.historicStockLog;
  }

  async addStock(
    productId: number,
    quantity: number,
    reason?: string,
  ): Promise<ProductVariant> {
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

    // Si todo salio bien, crear una entrada de stock.
    await this.#stockLog.create({
      data: {
        productVariantId: productId,
        isIngress: true,
        quantity,
        reason: reason ?? Prisma.skip,
      },
    });

    return updatedProduct;
  }

  async removeStock(
    productId: number,
    quantity?: number,
    reason?: string,
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

    // Si todo salio bien, crear una entrada de stock.
    await this.#stockLog.create({
      data: {
        productVariantId: productId,
        isIngress: false,
        quantity: quantity ?? 1,
        reason: reason ?? Prisma.skip,
      },
    });

    return updatedProduct;
  }
}
