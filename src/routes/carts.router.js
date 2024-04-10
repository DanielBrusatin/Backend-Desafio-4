import express from 'express'
import CartsDao from '../daos/Mongo/carts.dao.js'
import { ticketsService } from "../repositories/index.js";
import ProductsDao from '../daos/Mongo/products.dao.js';
import Users from "../daos/Mongo/models/user.model.js";
const router = express.Router()

//Crear carrito
router.post('/', async(req, res) => {
  try {
    await CartsDao.createCart()
    res.status(201).send({ status: 'success', message: 'Carrito creado correctamente' })
  } catch (error) {
    res.status(error.message).send({ status: `error ${error.message}`, error: error.cause })
  }
})

//Obtener productos de un carrito
router.get('/:cid', async(req, res) => {
  try {
    const cart = await CartsDao.getCartById(req.params.cid) 
    res.status(200).send({ status: 'success', payload: cart })
  } catch (error) {
    res.status(error.message).send({ status: `error ${error.message}`, error: error.cause })
  }
})

//Agregar un producto al carrito
router.post('/:cid/product/:pid', async(req, res) => {
  try {
    await CartsDao.addProductToCart(req.params)
    res.status(201).send({ status: 'success', message: 'Producto agregado al carrito correctamente' })
  } catch (error) {
    res.status(error.message).send({ status: `error ${error.message}`, error: error.cause })
  }
})

//Eliminar un producto del carrito
router.delete('/:cid/product/:pid', async(req, res) => {
  try {
    await CartsDao.deleteProductFromCart(req.params)
    res.status(200).send({ status: 'success', message: 'Producto eliminado del carrito correctamente' })
  } catch (error) {
    res.status(error.message).send({ status: `error ${error.message}`, error: error.cause })
  }
})

//Actualizar carrito
router.put('/:cid', async(req, res) => {
  try {
    await CartsDao.updateCart(req.params.cid, req.body.products)
    res.status(201).send({ status: 'success', message: 'Carrito actualizado correctamente' })
  } catch (error) {
    res.status(error.message).send({ status: `error ${error.message}`, error: error.cause })
  }
})

//Actualizar cantidad de producto en carrito
router.put('/:cid/product/:pid', async(req, res) => {
  try {
    await CartsDao.updateQuantity(req.params, req.body.quantity)
    res.status(201).send({ status: 'success', message: 'Cantidad actualizada correctamente' })
  } catch (error) {
    res.status(error.message).send({ status: `error ${error.message}`, error: error.cause })
  }
})  

//Vaciar carrito
router.delete('/:cid', async(req, res) =>{
  try {
    await CartsDao.clearCart(req.params.cid)
    res.status(200).send({ status: 'success', message: 'Carrito vaciado correctamente' })
  } catch (error) {
    res.status(error.message).send({ status: `error ${error.message}`, error: error.cause })
  }
})

//Crear ticket
router.get('/:cid/purchase', async(req, res) =>{
  try {
    const cart = await CartsDao.getCartById(req.params.cid)
    const user = await Users.findById(req.session.user, { email: 1})
    await ticketsService.createTicket(cart, user)
    res.status(200).send({ status: 'success', message: 'Ticket creado correctamente' })
  } catch (error) {
    res.status(error.message).send({ status: `error ${error.message}`, error: error.cause })
  }
})

export default router