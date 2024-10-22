import { Product } from '@prisma/client';
import { UpdateProductDto } from './dto/update.producto.dto';

export interface IProductService {
  /**
   * Crea un nuevo producto del dominio.
   *
   * @param {string} name Nombre del producto.
   * @param {number} price El precio a asignar al producto.
   * @param {string} image Una direccion URI en donde se aloja la imagen principal de un producto.
   * @param {number} category El ID de categoria o subcategoria a la cual pertenecera el producto.
   * @param {boolean} isSubCategory Especifica si el ID propuesto pertenece a una sub-categoria y no a una categoria comun.
   * @param {string} [description] Opcional. Una descripcion asociada a este producto.
   *
   * @returns {Promise<Product>}
   */
  createProduct(
    name: string,
    price: number,
    image: string,
    category: number,
    isSubCategory: boolean,
    description?: string,
  ): Promise<Product>;

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
   * Actualiza una Product por su identificador.
   *
   * @param {number} id 
   * @param {UpdateProductDto} updateProductDto 
   *
   * @returns {Promise<Product>}
   */
    updateProductById(id: number, updateProductDto: UpdateProductDto): Promise<Product>;
}
