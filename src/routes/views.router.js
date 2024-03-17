import express from 'express'
import axios from 'axios'
import UsersDao from '../daos/Mongo/users.dao.js'
axios.defaults.baseURL = 'http://localhost:8080'
const router = express.Router()

//Redirigir a home
router.get('/', (req, res) => {
  res.redirect('/products')
})

//Login
router.get('/login', (req, res) => {
  //Obtengo el ultimo mensaje de error enviado desde passport  
  const error = req.session.messages?.pop()
  res.render('login', { status: req.query.status, error })
})

//Registro
router.get('/register', (req, res) => {
  //Obtengo el ultimo mensaje de error enviado desde passport
  const error = req.session.messages?.pop()
  res.render('register', { status: req.query.status, error: error })
})

//Mostrar lista de productos
router.get('/products', async (req, res) => {
  if (req.session.user) {
    const user = await UsersDao.getUserById(req.session.user)
    axios.get('/api/products', {
      params: req.query
    })
      .then(response => res.render('products', { ...response.data, ...user, isAdmin: user.role == 'admin' }))
      .catch(error => console.log(error))
  } else {
    res.redirect('/login')
  }
})

//Mostrar carrito
router.get('/carts/:cid', async (req, res) => {
  if (req.session.user) {
    axios.get(`/api/carts/${req.params.cid}`)
      .then(response => res.render('cart', response.data.payload))
      .catch(error => console.log(error))
  } else {
    res.redirect('/login')
  }
})

//Mostrar en tiempo real los productos
router.get('/realtimeproducts', async (req, res) => {
  if (req.session.user) {
    const user = await UsersDao.getUserById(req.session.user)
    if (user.role == 'admin') {
      res.render('realTimeProducts')
    } else {
      res.render('403')
    }
  } else {
    res.redirect('/login')
  }
})

//Chat con websocket
router.get('/chat', (req, res) => {
  res.render('chat')
})

export default router