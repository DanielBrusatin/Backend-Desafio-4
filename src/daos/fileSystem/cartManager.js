import fs from 'fs'
import productManager from './productManager.js'
import __dirname from '../../utils.js'

class cartManager {
  constructor(path) {
    this.path = __dirname + path
    this.carts = this.readFile()
    this.id = this.carts.reduce((idMax, cart) => idMax > cart.id ? idMax : cart.id, 0)
  }

  readFile = () => {
    try {
      const res = fs.readFileSync(this.path, 'utf-8')
      return JSON.parse(res)
    }
    catch {
      throw new Error('404', { cause: `Can't find the file '${this.path}'` })
    }
  }

  createCart = async() => {
    this.id++
    const newCart = { id: this.id, products: [] }
    this.carts.push(newCart)
    try {
      await fs.promises.writeFile(this.path, JSON.stringify(this.carts))
    } catch {
      throw new Error('500', { cause: 'No se pudo crear el carrito, intentar nuevamente.' })
    }
  }

  getCartById = (id) => {
    //Verifico que se haya pasado un ID válido
    if (Number.isInteger(Number(id)) && Number(id) > 0) {
      const response = this.readFile()
      //Compruebo que exista el carrito con ese ID
      if (response.find( cart => cart.id == id )) {
        const productsInCart = response.find( cart => cart.id == id ).products
        const products = []
        productsInCart.forEach( productInCart => {
          //Busco el producto con el product manager, traigo todas sus propiedades y le agrego la propiedad quantity
          const product = { ...productManager.getProductById(productInCart.productId), quantity: productInCart.quantity }
          products.push(product)
        })
        return products
      } else {
        throw new Error('404', { cause: `No existe el carrito con ID = ${id}` })
      }
    } else {
      throw new Error('400', { cause: `Ingresaste el ID '${id}' que es inválido. El ID debe ser un numero entero mayor 0.` })
    }
  }

  addProductToCart = async({ cid, pid }) => {
    //Verifico que se haya pasado un ID de carrito válido
    if (Number.isInteger(Number(cid)) && Number(cid) > 0) {
      //Compruebo que exista el carrito con ese CID
      const cartIndex = this.carts.findIndex( cart => cart.id == cid )
      if (cartIndex !== -1) {
        //Compruebo que el ID de producto sea valido y que exista el producto con ese PID
        try {
          productManager.getProductById(pid)
        } catch (error) {
          throw new Error(error.message, { cause: error.cause })
        }
        //Compruebo si ya existe el producto en el carrito para agregarlo o sumarle uno a la cantidad
        const productsInCart = this.carts[cartIndex].products
        const productIndex = productsInCart.findIndex( cartItem => cartItem.productId == pid )
        if (productIndex !== -1) {
          productsInCart[productIndex].quantity++
        } else {
          const newProduct = { productId: pid, quantity: 1 }
          productsInCart.push(newProduct)
        }
        //Guardo las modificaciones en el archivo
        try {
          await fs.promises.writeFile(this.path, JSON.stringify(this.carts))
        } catch {
          throw new Error('500', { cause: 'No se pudo crear el carrito, intentar nuevamente.' })
        }
      } else {
        throw new Error('404', { cause: `No existe el carrito con ID = ${cid}` })
      }
    } else {
      throw new Error('400', { cause: `Ingresaste el ID de carrito '${cid}' que es inválido. El ID debe ser un numero entero mayor 0.` })
    }
  }
}

export default new cartManager('/carts.json')

