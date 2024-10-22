import { Product } from '@prisma/client';
import { CreateProductDto } from './dto/create.product.dto';
import { UpdateProductDto } from './dto/update.producto.dto';

export interface IProductService {
  /**
   * Crea un nuevo producto del dominio.
   *
   * @param {CreateProductDto} createProductDto
   * @returns {Promise<Product>}
   */
  createProduct(createProductDto: CreateProductDto): Promise<Product>;

  /**
   * Obtiene un producto del dominio.
   *
   * @param {number} id El identificador del producto.
   *
   * @returns {Promise<Product>}
   */
  getProductById(id: number): Promise<Product>;

  /**
   * Obtiene un listado completo de las Products.
   *
   * @returns {Promise<Array<Product>>}
   */
  getProducts(): Promise<Array<Product>>;
  
    /**
   * Actualiza un producto por su identificador.
   *
   * @param {number} id 
   * @param {UpdateProductDto} updateProductDto 
   *
   * @returns {Promise<Product>}
   */
    updateProductById(id: number, updateProductDto: UpdateProductDto): Promise<Product>;
}
