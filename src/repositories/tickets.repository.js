import TicketDTO from "../daos/DTOs/ticket.dto.js"
import CartsDao from "../daos/Mongo/carts.dao.js";
import ProductsDao from "../daos/Mongo/products.dao.js";

export default class TicketRepository {
  constructor(dao) {
    this.dao = dao
  }

  createTicket = async (cart, user) => {

    //Verifico stock de productos
    const ticket = new TicketDTO(cart)

    //Si no hay total es porque no hay productos disponibles, no creo el ticket
    if (!ticket.total) throw new Error(('404', { cause: 'No hay stock disponible' }))

    const result = await this.dao.createTicket(user.email, ticket.total)

    //Si se creo el ticket correctamente actualizo el stock y borro del carrito los productos comprados.
    if (result) {
      for (const product of ticket.productsWithStock) {
        await ProductsDao.updateProduct(product.id, { stock: product.stock - product.quantity })
        await CartsDao.deleteProductFromCart({ cid: cart._id.toString(), pid: product.id })
      }
      return 
    }
    throw new Error(('500', { cause: 'Error al crear el ticket' }))
  }
}