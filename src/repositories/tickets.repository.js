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
    console.log(ticket.productsWithStock);
    console.log('---------------------');
    console.log(ticket.total);

    if (!ticket.total) return null

    const result = await this.dao.create(user.email, ticket.total)

    if (result) {
      for (const product of ticket.productsWithStock) {
        await ProductsDao.updateProduct(product.id, { stock: product.stock - product.quantity })
        await CartsDao.deleteProductFromCart({ cid: cart._id.toString(), pid: product.id })
      }
      return 
    }
    //resto stock de productos
    //devuelvo los productos no agregados
  }
}