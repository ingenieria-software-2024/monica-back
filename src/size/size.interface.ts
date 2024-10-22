import { Product, Size } from '@prisma/client';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
import { AssignSizeDto } from './dto/assign-size.dto';

export interface ISizeService {
  /**
   * Crea un nuevo tamaño
   * @param {CreateSizeDto} createSizeDto
   *
   * @returns {Promise<Size>}
   */

  createSize(createSizeDto: CreateSizeDto): Promise<Size>;

  /**
   * Obtener un listado completo de los tamaños
   *
   * @returns {Promise<Array<Size>>}
   */
  getAllSizes(): Promise<Array<Size>>;

  /**
   * Busca un tamaño por su identificador.
   *
   * @param {number} id
   *
   * @returns {Promise<Size>}
   */
  getSizeById(id: number): Promise<Size>;

  /**
   * Asigna un tamaño existente a un producto existente
   *
   * @param {AssignSizeDto} assignSizeDto
   * @param {number} productId
   *
   * @returns {Promise<Product>}
   */
  assignSizeToProduct(
    assignSizeDto: AssignSizeDto,
    productId: number,
  ): Promise<Product>;

  /**
   * Obtiene el stock de productos por tamaño
   *
   * @param id
   *
   * @returns {Promise<{ product: Product; stock: number }[]>}
   */
  getStockBySize(id: number): Promise<{ product: Product; stock: number }[]>;

  /**
   * Actualiza algun dato de un tamaño ya registrado
   *
   * @param {number} id
   * @param {UpdateSizeDto} updateSizeDto
   *
   * @returns {Promise<Size>}
   */
  updateSize(id: number, updateSizeDto: UpdateSizeDto): Promise<Size>;

  /**
   * Borra un tamaño
   *
   * @param {number} id
   *
   * @returns {Promise<Size>}
   */
  deleteSize(id: number): Promise<Size>;
}
