import express from 'express'
import upload from "../utils/upload.middleware.js";
import ProductsDao from '../daos/Mongo/products.dao.js'
import io from '../app.js';
const router = express.Router()

//Obtener productos con querys
router.get('/', async (req, res) => {
  try {
    const response = await ProductsDao.getProducts(req.query)
    res.status(200).send(response)
  } catch (error) {
    res.status(error.message).send({ status: `error ${error.message}`, error: error.cause })
  }
})

//Obtener un producto por su ID
router.get('/:pid', async (req, res) => {
  try {
    const product = await ProductsDao.getProductById(req.params.pid)
    res.status(200).send({ status: 'success', payload: product })
  } catch (error) {
    res.status(error.message).send({ status: `error ${error.message}`, error: error.cause })
  }
})

//Agregar un producto
router.post('/', upload.single('thumbnails'), async (req, res) => {
  let thumbnails = req.file?.filename
  try {
    await ProductsDao.addProduct({ ...req.body, thumbnails })
    io.emit('products', await ProductsDao.getProducts({}))
    res.redirect('/realtimeproducts?status=success')
  } catch (error) {
    res.redirect(`/realtimeproducts?status=error&error=${error.cause}`)
  }
})

//Modificar un producto
router.put('/:pid', async (req, res) => {
  try {
    await ProductsDao.updateProduct(req.params.pid, req.body)
    res.status(200).send({ status: 'success', message: 'Producto actualizado correctamente' })
  } catch (error) {
    res.status(error.message).send({ status: `error ${error.message}`, error: error.cause })
  }
})

//Eliminar un producto
router.delete('/:pid', async (req, res) => {
  try {
    await ProductsDao.deleteProduct(req.params.pid)
    res.status(200).send({ status: 'success', message: 'Producto eliminado correctamente' })
  } catch (error) {
    res.status(error.message).send({ status: `error ${error.message}`, error: error.cause })
  }
})

export default router