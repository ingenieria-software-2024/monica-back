import { Injectable, Logger } from '@nestjs/common';
import { IAuditProductService } from './audit.products.interface';
import { PrismaService } from 'src/providers/prisma.service';
import {
  Product,
  User,
  AuditProductCreation,
  AuditProductEdit,
} from '@prisma/client';

@Injectable()
export class AuditProductService implements IAuditProductService {
  readonly #logger = new Logger(AuditProductService.name);

  constructor(private readonly prisma: PrismaService) {}

  async logProductCreation(
    product: Product,
    user: User,
  ): Promise<AuditProductCreation> {
    this.#logger.debug(
      `Product '${product?.name ?? 'N/A'}' created at ${new Date().toISOString()} by ${user?.email ?? user?.username ?? 'Unknown'}`,
    );

    return await this.prisma.auditProductCreation.create({
      data: {
        productId: product.id,
        createdById: user.id,
      },
    });
  }

  async logProductUpdate(
    oldProduct: Product,
    product: Product,
    user: User,
  ): Promise<AuditProductEdit> {
    this.#logger.debug(
      `Product '${product?.name ?? 'N/A'}' updated at ${new Date().toISOString()} by ${
        user?.email ?? user?.username ?? 'Unknown'
      }`,
    );

    return await this.prisma.auditProductEdit.create({
      data: {
        productId: product.id,
        modifiedById: user.id,
        nameBefore: oldProduct?.name,
        nameAfter: product?.name,
        descriptionBefore: oldProduct?.description,
        descriptionAfter: product?.description,
      },
    });
  }
}
