import { TestingModule, Test } from '@nestjs/testing';
import { ProductVariantService } from '../variants/product.variants.service';
import { IStockService } from './stock.interface';
import { StockService } from './stock.service';
import { ProductVariant } from '@prisma/client';
import { PrismaService } from '../../../providers/prisma.service';

describe('Registro de entradas y salidas de stock (Aceptacion)', () => {
  let service: IStockService;
  let productVariantService: ProductVariantService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StockService,
        {
          provide: PrismaService,
          useValue: {
            product: {
              findUnique: jest.fn(),
            },
            productVariant: {
              findUnique: jest.fn(),
              update: jest.fn(),
            },
            historicStockLog: {
              create: jest.fn(),
            },
          },
        },
        {
          provide: ProductVariantService,
          useValue: {
            getVariantById: jest.fn(),
            updateVariant: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<IStockService>(StockService);
    productVariantService = module.get<ProductVariantService>(
      ProductVariantService,
    );
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('Registro manual de entradas y salidas de inventario', () => {
    it('el registro debe ser guardado correctamente', async () => {
      const variant: ProductVariant = {
        id: 1,
        name: 'Producto de Test',
        description: 'test 123',
        price: 500,
        imageUrl: 'https://example.com/image.jpg',
        stock: 10,
        stockMin: 5,
        productId: 1,
        variantCategoryId: 1,
      };

      // Mock de la búsqueda de variante
      jest
        .spyOn(productVariantService, 'getVariantById')
        .mockResolvedValue(variant);

      // Mock de la actualización de variante
      jest
        .spyOn(productVariantService, 'updateVariant')
        .mockResolvedValue({ ...variant, stock: 15 });

      // Mock de la creación de registro de stock
      prismaService.historicStockLog.create = jest.fn().mockResolvedValue({
        id: 1,
        productVariantId: 1,
        isIngress: true,
        quantity: 5,
        createdAt: new Date(),
        createdBy: null,
        reason: null,
      });

      const result = await service.addStock(1, 5);
      expect(result).toEqual({ ...variant, stock: 15 });
    });

    it('el registro debe incluir el ID del producto, la cantidad ajustada y la razón para el ajuste', async () => {
      const variant: ProductVariant = {
        id: 1,
        name: 'Producto de Test',
        description: 'test 123',
        price: 500,
        imageUrl: 'https://example.com/image.jpg',
        stock: 10,
        stockMin: 5,
        productId: 1,
        variantCategoryId: 1,
      };

      const stockReason = 'Ajuste de inventario';

      // Mock de la búsqueda de variante
      jest
        .spyOn(productVariantService, 'getVariantById')
        .mockResolvedValue(variant);

      // Mock de la actualización de variante
      jest
        .spyOn(productVariantService, 'updateVariant')
        .mockResolvedValue({ ...variant, stock: 15 });

      // Mock de la creación de registro de stock
      prismaService.historicStockLog.create = jest.fn().mockResolvedValue({
        id: 1,
        productVariantId: 1,
        isIngress: true,
        quantity: 5,
        createdAt: new Date(),
        createdBy: null,
        reason: stockReason,
      });

      const result = await service.addStock(1, 5, stockReason);
      expect(result).toEqual({ ...variant, stock: 15 });
    });
  });
});
