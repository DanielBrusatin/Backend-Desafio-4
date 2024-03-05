import { Router } from 'express'
import passport from 'passport'

const router = Router()

//Ruta de registro
router.post('/register', passport.authenticate('register', {
  successRedirect: '/register?status=success',
  failureRedirect: '/register?status=error',
  failureMessage: true
}))

//Ruta para login
router.post('/login', passport.authenticate('login', {failureRedirect: '/login?status=error', failureMessage: true}), (req, res) => {
  req.session.user = req.user._id
  return res.redirect('/login?status=success')
})

//Ruta de logout
router.get('/logout', async (req, res) => {
  req.session.destroy((err) => {
    res.redirect('/login')
  })
})

export default router