import {
  Product,
  User,
  AuditProductCreation,
  AuditProductEdit,
} from '@prisma/client';

export interface IAuditProductService {
  /**
   * Registra la creacion de un nuevo producto en el auditing log.
   *
   * @param {Product} product El producto creado.
   * @param {User} user El usuario que ha creado el producto.
   *
   * @returns {Promise<AuditProductCreation>} La entrada de auditoria creada.
   */
  logProductCreation(
    product: Product,
    user: User,
  ): Promise<AuditProductCreation>;

  /**
   * Registra la actualizacion de un producto en el auditing log.
   *
   * @param {Product} oldProduct El producto antes de la actualizacion.
   * @param {Product} product El producto actualizado.
   * @param {User} user El usuario que ha actualizado el producto.
   *
   * @returns {Promise<AuditProductEdit>} La entrada de auditoria creada.
   */
  logProductUpdate(
    oldProduct: Product,
    product: Product,
    user: User,
  ): Promise<AuditProductEdit>;
}
