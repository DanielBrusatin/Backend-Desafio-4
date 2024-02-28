import express from 'express'
import handlebars from 'express-handlebars'
import __dirname from './utils.js'
import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js'
import viewsRouter from './routes/views.router.js'
import usersRouter from './routes/users.router.js'
import sessionsRouter from './routes/sessions.router.js'
import { Server } from 'socket.io'
import ProductsDao from './daos/Mongo/products.dao.js'
import MessagesDao from './daos/Mongo/messages.dao.js'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import MongoStore from 'connect-mongo'

//Inicializo app y creo los servidores http y socket
const app = express()
const port = 8080
const httpServer = app.listen(port, () => {
  console.log(`example listen in port ${port}`)
})
const io = new Server(httpServer)

//Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(session({
  store: MongoStore.create({
    mongoUrl:'mongodb+srv://danielbrusatindb:36262146@cluster0.ks7k4pq.mongodb.net/ecommerce?retryWrites=true&w=majority',
    ttl: 1500
  }),
  secret: 'S3CR3TC0D3',
  resave: true,
  saveUninitialized:false
}))

//Rutas para los diferentes router
app.use('/api/users', usersRouter)
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/api/sessions', sessionsRouter)
app.use('/', viewsRouter)

//Mongo
mongoose.connect('mongodb+srv://danielbrusatindb:36262146@cluster0.ks7k4pq.mongodb.net/ecommerce?retryWrites=true&w=majority')

//Handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

//Indico ruta para archivos estáticos
app.use(express.static(__dirname + '/public'))

//Escucho evento de nueva conexión
io.on('connection', async socket => {
  console.log('nuevo cliente conectado') 
  //Envio evento para renderizar la lista de productos a la nueva conexion
  const resp = await ProductsDao.getProducts({limit: 200})
  socket.emit('products', resp.payload)

  //Escucho evento de nuevo mensaje
  socket.on('message', async message => {
    //Guardo mensaje en la base de datos
    await MessagesDao.addMessage(message)
    //Envío evento a todos los sockets para actualizar el chat
    io.emit('messages', await MessagesDao.getMessages())
  })
  //Envio evento para renderizar el historial del chat a la nueva conexion
  socket.emit('messages', await MessagesDao.getMessages())
})

export default io