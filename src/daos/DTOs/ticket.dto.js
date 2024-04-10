export default class TicketDTO {
  constructor(cart) {
    this.products = cart.products.map(item => { return { id: item.product._id.toString(), price: item.product.price, stock: item.product.stock, quantity: item.quantity } })
    this.productsWithStock = []
    this.total = 0
    this.verifyStock()
  }

  verifyStock() {
    this.products.forEach(product => {
      if (product.stock >= product.quantity) {
        this.productsWithStock.push(product)
        this.total += product.quantity * product.price
      }
    })
  }

}