import { Router } from 'express'
import passport from 'passport'
import Users from '../daos/models/user.model.js'

const router = Router()

//Ruta de registro
router.post('/register', passport.authenticate('register', {
  successRedirect: '/register?status=success',
  failureRedirect: '/register?status=error',
  failureMessage: true
}))

//Ruta para login
router.post('/login', passport.authenticate('login', { failureRedirect: '/login?status=error', failureMessage: true }), (req, res) => {
  req.session.user = req.user._id
  return res.redirect('/login?status=success')
})

//Ruta para login con Github
router.get('/github', passport.authenticate('github', { scope: ['user: email'] }), async (req, res) => { })

//Ruta callback de Github
router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login?status=error', failureMessage: true }), (req, res) => {
  req.session.user = req.user._id
  return res.redirect('/login?status=success')
})

//Ruta de logout
router.get('/logout', async (req, res) => {
  req.session.destroy((err) => {
    res.redirect('/login')
  })
})

//Ruta del usuario actual
router.get('/current', async (req,res) => {
  const userId = req.session.user
  if(!userId) {
    res.status(401).send({ status: 'error 401', error: 'No hay usuario logueado' })
  } else{
    const user = await Users.findById(userId, {first_name: 1, last_name: 1, age: 1, email: 1, role: 1})
    res.status(200).send({ status: 'success', message: user })
  }
})

export default router