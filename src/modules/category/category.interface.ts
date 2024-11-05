import { Category } from '@prisma/client';

export interface ICategoryService {
  /**
   * Crea una nueva categoria.
   *
   * @param {string} name El nombre de la categoria.
   * @param {string} [description] Opcional. Una descripcion asociada a esta categoria.
   *
   * @returns {Promise<Category>}
   */
  createCategory(name: string, description?: string): Promise<Category>;

  /**
   * Obtiene un listado completo de las categorias.
   *
   * @returns {Promise<Array<Category>>}
   */
  getCategories(): Promise<Array<Category>>;

  /**
   * Busca una categoria por su identificador.
   *
   * @param {number} id El identificador de la categoria.
   *
   * @returns {Promise<Category>}
   */
  getCategoryById(id: number): Promise<Category>;

  /**
   * Actualiza una categoria por su identificador.
   *
   * @param {number} id El identificador de la categoria.
   * @param {Category} data Los datos para actualizar la categoria.
   *
   * @returns {Promise<Category>}
   */
  updateCategoryByid(id: number, data: Category): Promise<Category>;

  /**
   * Realiza un borrado lógico de una categoría y todas sus subcategorías.
   *
   * @param {number} id El identificador de la categoría.
   *
   * @returns {Promise<Category>}
   */
  DeleteCategory(id: number): Promise<Category>;
}
