import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../providers/prisma.service';
import { StockService } from './stock.service';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';

describe('StockService', () => {
  let stockService: StockService;
  let prismaService: PrismaService;

  // Configuración del módulo de pruebas antes de cada test
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
              create: jest.fn(),
              update: jest.fn(),
              findMany: jest.fn(),
              delete: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    stockService = module.get<StockService>(StockService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('Definición y gestión de variantes de productos', () => {
    it('las variantes deben ser guardadas correctamente para el producto "Camiseta"', async () => {
      const createVariantDto: CreateVariantDto = {
        name: ' Rojo ',
        stock: 10,
        stockMin: 5,
        description: 'Camiseta roja ',
        productId: 1,
        variantCategoryId: 1,
      };

      // Mock de la búsqueda de producto
      prismaService.product.findUnique = jest
        .fn()
        .mockResolvedValue({ id: 1, name: 'Camiseta' });
      // Mock de la creación de variante
      prismaService.productVariant.create = jest
        .fn()
        .mockResolvedValue(createVariantDto);

      const result = await stockService.createVariant(createVariantDto);

      // Verificación de las llamadas y resultados
      expect(prismaService.product.findUnique).toHaveBeenCalledWith({
        where: { id: createVariantDto.productId },
      });
      expect(prismaService.productVariant.create).toHaveBeenCalledWith({
        data: {
          name: createVariantDto.name,
          stock: createVariantDto.stock,
          stockMin: createVariantDto.stockMin,
          description: createVariantDto.description,
          product: { connect: { id: createVariantDto.productId } },
          variantCategory: {
            connect: { id: createVariantDto.variantCategoryId },
          },
        },
      });
      expect(result).toEqual(createVariantDto);
    });

    it('debe lanzar un error si el producto no existe', async () => {
      const createVariantDto: CreateVariantDto = {
        name: 'Camiseta - Rojo - M',
        stock: 10,
        stockMin: 5,
        description: 'Camiseta roja tamaño M',
        productId: 1,
        variantCategoryId: 2,
      };

      // Mock para simular que el producto no existe
      prismaService.product.findUnique = jest.fn().mockResolvedValue(null);

      await expect(
        stockService.createVariant(createVariantDto),
      ).rejects.toThrow(NotFoundException);
      expect(prismaService.product.findUnique).toHaveBeenCalledWith({
        where: { id: createVariantDto.productId },
      });
    });
  });

  describe('Niveles de inventario por variante', () => {
    it('cada variante debe tener su propio nivel de inventario reflejado correctamente', async () => {
      const updateVariantDto: UpdateVariantDto = {
        id: 1,
        productId: 1,
        variantCategoryId: 2,
        stock: 5,
      };

      // Mock de la actualización de variante
      prismaService.productVariant.update = jest.fn().mockResolvedValue({
        id: 1,
        name: 'Camiseta - L',
        productId: 1,
        variantCategoryId: 2,
        stock: 5,
        stockMin: 1,
      });

      const result = await stockService.updateVariant(1, updateVariantDto);

      // Verificación de las llamadas y resultados
      expect(prismaService.productVariant.update).toHaveBeenCalledWith({
        where: { id: updateVariantDto.id },
        data: {
          ...(updateVariantDto.name && { name: updateVariantDto.name }),
          ...(updateVariantDto.description && {
            description: updateVariantDto.description,
          }),
          ...(updateVariantDto.stock !== undefined && {
            stock: updateVariantDto.stock,
          }),
          ...(updateVariantDto.stockMin !== undefined && {
            stockMin: updateVariantDto.stockMin,
          }),
          productId: updateVariantDto.productId, // Incluye el productId
          variantCategoryId: updateVariantDto.variantCategoryId, // Incluye el variantCategoryId
        },
      });
      expect(result.stock).toEqual(updateVariantDto.stock);
    });
  });

  describe('Visibilidad de variantes en la página de producto', () => {
    it('debe obtener todas las variantes con la categoría visible para seleccionar', async () => {
      const mockVariants = [
        {
          id: 1,
          name: 'Camiseta M',
          variantCategory: { name: 'Tamaño' },
        },
        {
          id: 2,
          name: 'Camiseta Azul',
          variantCategory: { name: 'Color' },
        },
      ];

      // Mock de la búsqueda de variantes
      prismaService.productVariant.findMany = jest
        .fn()
        .mockResolvedValue(mockVariants);

      const result = await stockService.getAllVariants();

      // Verificación de las llamadas y resultados
      expect(prismaService.productVariant.findMany).toHaveBeenCalledWith({
        include: { variantCategory: { select: { name: true } } },
      });
      expect(result).toEqual(mockVariants);
    });
  });

  describe('Eliminar una variante existente', () => {
    it('debe eliminar una variante correctamente', async () => {
      const mockVariant = { id: 1, name: 'Camiseta - Rojo - M' };

      // Mock de la eliminación de variante
      prismaService.productVariant.delete = jest
        .fn()
        .mockResolvedValue(mockVariant);

      const result = await stockService.deleteVariant(1);

      // Verificación de las llamadas y resultados
      expect(prismaService.productVariant.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockVariant);
    });
  });

  describe('Buscar una variante por ID', () => {
    it('debe lanzar una excepción si no encuentra la variante', async () => {
      // Mock para simular que la variante no existe
      prismaService.productVariant.findUnique = jest
        .fn()
        .mockResolvedValue(null);

      await expect(stockService.getVariantById(99)).rejects.toThrow(
        NotFoundException,
      );
      expect(prismaService.productVariant.findUnique).toHaveBeenCalledWith({
        where: { id: 99 },
        include: { variantCategory: { select: { name: true } } },
      });
    });

    it('debe devolver la variante si la encuentra', async () => {
      const mockVariant = {
        id: 1,
        name: 'Camiseta M',
        variantCategory: { name: 'Tamaño' },
      };

      // Mock de la búsqueda de variante
      prismaService.productVariant.findUnique = jest
        .fn()
        .mockResolvedValue(mockVariant);

      const result = await stockService.getVariantById(1);

      // Verificación de las llamadas y resultados
      expect(prismaService.productVariant.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { variantCategory: { select: { name: true } } },
      });
      expect(result).toEqual(mockVariant);
    });
  });
});
