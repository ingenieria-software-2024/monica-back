import { SubCategory } from '@prisma/client';

export interface ISubCategoryService {
  /**
   * Crea una subcategoria.
   *
   * @param {string} name El nombre de la subcategoria.
   * @param {number} parent El ID de la categoria padre.
   * @param {string} [description] Opcional. Una descripcion asociada a esta subcategoria.
   *
   * @returns {Promise<SubCategory>}
   */
  createSubCategory(
    name: string,
    parent: number,
    description?: string,
  ): Promise<SubCategory>;

  /**
   * Obtiene un listado completo de todas las subcategorias.
   *
   * @returns {Promise<Array<SubCategory>>}
   */
  getSubCategories(): Promise<Array<SubCategory>>;

  /**
   * Busca una subcategoria por su identificador.
   *
   * @param {number} id El identificador de la subcategoria.
   *
   * @returns {Promise<SubCategory>}
   */
  getSubCategoryById(id: number): Promise<SubCategory>;
}