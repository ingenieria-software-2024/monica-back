import { TestingModule, Test } from '@nestjs/testing';
import { ProductVariantService } from '../variants/product.variants.service';
import { IStockService } from './stock.interface';
import { StockService } from './stock.service';
import { ProductVariant } from '@prisma/client';

describe('Registro de entradas y salidas de stock', () => {
  let service: IStockService;
  let productVariantService: ProductVariantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StockService,
        {
          provide: ProductVariantService,
          useValue: {
            getVariantById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<IStockService>(StockService);
    productVariantService = module.get<ProductVariantService>(
      ProductVariantService,
    );
  });

  describe('Registro manual de entradas y salidas de inventario', () => {
    it('el registro debe ser guardado correctamente', async () => {
      const variant: ProductVariant = {
        id: 1,
        name: 'Producto de Test',
        description: 'test 123',
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

      const result = await service.addStock(1, 5);
      expect(result).toEqual({ ...variant, stock: 15 });
    });
  });
});
