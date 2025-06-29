import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../providers/prisma.service';
import { ProductVariantService } from './product.variants.service';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';

describe('Variantes de Producto y Productos', () => {
  let productVariantService: ProductVariantService;
  let prismaService: PrismaService;

  // Configuración del módulo de pruebas antes de cada test
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductVariantService,
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

    productVariantService = module.get<ProductVariantService>(
      ProductVariantService,
    );
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('Definición y gestión de variantes de productos', () => {
    it('las variantes deben ser guardadas correctamente para el producto "Camiseta"', async () => {
      const createVariantDto: CreateVariantDto = {
        name: ' Rojo ',
        price: 500,
        imageUrl: 'https://example.com/image.jpg',
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

      const result =
        await productVariantService.createVariant(createVariantDto);

      // Verificación de las llamadas y resultados
      expect(prismaService.product.findUnique).toHaveBeenCalledWith({
        where: { id: createVariantDto.productId },
      });
      expect(prismaService.productVariant.create).toHaveBeenCalledWith({
        data: {
          name: createVariantDto.name,
          price: createVariantDto.price,
          imageUrl: createVariantDto?.imageUrl,
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
        price: 500,
        imageUrl: 'https://example.com/image.jpg',
        stock: 10,
        stockMin: 5,
        description: 'Camiseta roja tamaño M',
        productId: 1,
        variantCategoryId: 2,
      };

      // Mock para simular que el producto no existe
      prismaService.product.findUnique = jest.fn().mockResolvedValue(null);

      await expect(
        productVariantService.createVariant(createVariantDto),
      ).rejects.toThrow(NotFoundException);
      expect(prismaService.product.findUnique).toHaveBeenCalledWith({
        where: { id: createVariantDto.productId },
      });
    });
  });

  describe('Niveles de inventario por variante', () => {
    it('cada variante debe tener su propio nivel de inventario reflejado correctamente', async () => {
      const updateVariantDto: UpdateVariantDto = {
        name: 'Camiseta Roja',
        description: 'Camiseta roja tamaño M',
        price: 300,
        imageUrl: 'https://example.com/image_new.jpg',
        stock: 5,
        stockMin: 3,
      };

      const variantId = 1;

      // Mock del fetch de la variante
      prismaService.productVariant.findUnique = jest.fn().mockResolvedValue({
        id: variantId,
        name: 'Camiseta - L',
        price: 500,
        imageUrl: 'https://example.com/image.jpg',
        productId: 1,
        variantCategoryId: 2,
        stock: 10,
        stockMin: 1,
      });

      // Mock de la actualización de variante
      prismaService.productVariant.update = jest.fn().mockResolvedValue({
        id: variantId,
        name: 'Camiseta - L',
        price: 300,
        imageUrl: 'https://example.com/image_new.jpg',
        productId: 1,
        variantCategoryId: 2,
        stock: 5,
        stockMin: 1,
      });

      const result = await productVariantService.updateVariant(
        variantId,
        updateVariantDto,
      );

      // Verificación de las llamadas y resultados
      expect(prismaService.productVariant.update).toHaveBeenCalledWith({
        where: { id: variantId },
        data: {
          ...(updateVariantDto.name && { name: updateVariantDto.name }),
          ...(updateVariantDto.price !== undefined && {
            price: updateVariantDto.price,
          }),
          ...(updateVariantDto.imageUrl && {
            imageUrl: updateVariantDto.imageUrl,
          }),
          ...(updateVariantDto.description && {
            description: updateVariantDto.description,
          }),
          ...(updateVariantDto.stock !== undefined && {
            stock: updateVariantDto.stock,
          }),
          ...(updateVariantDto.stockMin !== undefined && {
            stockMin: updateVariantDto.stockMin,
          }),
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

      const result = await productVariantService.getAllVariants();

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

      const result = await productVariantService.deleteVariant(1);

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

      await expect(productVariantService.getVariantById(99)).rejects.toThrow(
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

      const result = await productVariantService.getVariantById(1);

      // Verificación de las llamadas y resultados
      expect(prismaService.productVariant.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { variantCategory: { select: { name: true } } },
      });
      expect(result).toEqual(mockVariant);
    });
  });
});
