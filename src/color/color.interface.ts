import { Color, Product } from '@prisma/client';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { AssignColorDto } from './dto/assign-color.dto';

export interface IColorService {
  /**
   * Crea un nuevo color
   * @param {CreateColorDto} createColorDto
   *
   * @returns {Promise<Color>}
   */

  createColor(createColorDto: CreateColorDto): Promise<Color>;

  /**
   * Obtener un listado completo de los colores
   *
   * @returns {Promise<Array<Color>>}
   */
  getAllColors(): Promise<Array<Color>>;

  /**
   * Busca un color por su identificador.
   *
   * @param {number} id
   *
   * @returns {Promise<Color>}
   */
  getColorById(id: number): Promise<Color>;

  /**
   * Asigna un color existente a un producto existente
   *
   * @param {AssignColorDto} assignColorDto
   * @param {number} productId
   *
   * @returns {Promise<Product>}
   */
  assignColorToProduct(
    assignColorDto: AssignColorDto,
    productId: number,
  ): Promise<Product>;

  /**
   * Obtiene el stock de productos por color
   *
   * @param id
   *
   * @returns {Promise<{ product: Product; stock: number }[]>}
   */
  getStockByColor(id: number): Promise<{ product: Product; stock: number }[]>;

  /**
   * Actualiza algun dato de un color ya registrado
   *
   * @param {number} id
   * @param {UpdateColorDto} updateColorDto
   *
   * @returns {Promise<Color>}
   */
  updateColor(id: number, updateColorDto: UpdateColorDto): Promise<Color>;

  /**
   * Borra un color
   *
   * @param {number} id
   *
   * @returns {Promise<Color>}
   */
  deleteColor(id: number): Promise<Color>;
}
