import { Router } from 'express'
import UsersDao from '../daos/Mongo/users.dao.js'
import passport from 'passport'

const router = Router()

//Ruta de registro
router.post('/register', (req, res) => {
  passport.authenticate('register', (error, user, info) => {
    if (error) {
      return res.redirect(`/register?status=error&error=${error}`)
    }
    if (!user) {
      return res.redirect(`/register?status=error&error=${info}`)
    }
    return res.redirect('/register?status=success')
  })(req, res)
})

//Ruta para login
router.post('/login', async (req, res) => {
  try {
    const user = await UsersDao.getUserByCreds(req.body)
    req.session.user = user._id
    res.redirect('/login?status=success')
  } catch (error) {
    res.redirect(`/login?status=error&error=${error.cause}`)
  }
})

//Ruta de logout
router.get('/logout', async (req, res) => {
  req.session.destroy((err) => {
    res.redirect('/login')
  })
})

export default router