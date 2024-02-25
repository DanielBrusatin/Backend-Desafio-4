import express from "express"
import axios from "axios";
import UsersDao from "../daos/Mongo/users.dao.js";
axios.defaults.baseURL = 'http://localhost:8080';
const router = express.Router()

//Redirigir a home
router.get('/', (req, res) => {
  res.redirect('/products')
})

//Homepage
router.get('/login', (req, res) => {
  if(req.session.user){
    res.redirect('/products')
  } else {
    res.render('login', {status: req.query.status, error: req.query.error})
  }
})

//Registro
router.get('/register', (req, res) => {
  res.render('register', {status: req.query.status, error: req.query.error})
})

//Mostrar lista de productos
router.get('/products', async (req, res) => {
  if(req.session.user){
    const user = await UsersDao.getUserById(req.session.user)
    axios.get('/api/products', {
      params: req.query
    })
    .then(response => res.render('products', {...response.data, ...user, isAdmin: user.rol == 'admin'}))
    .catch(error => console.log(error))
  } else {
    res.redirect('/login')
  }
})

//Mostrar carrito
router.get('/carts/:cid', async (req, res) => {
  if(req.session.user){
    axios.get(`/api/carts/${req.params.cid}`)
    .then(response => res.render('cart', response.data.payload))
    .catch(error => console.log(error))
  } else {
    res.redirect('/login')
  }
})

//Mostrar en tiempo real los productos
router.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts', {status: req.query.status, error: req.query.error})
})

//Chat con websocket
router.get('/chat', (req, res) => {
  res.render('chat')
})

export default router