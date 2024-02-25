import { Router } from "express";
import UsersDao from "../daos/Mongo/users.dao.js";

const router = Router()

//Ruta de registro
router.post('/register', async (req, res) => {
  try {
    await UsersDao.addUser(req.body)
    res.redirect('/register?status=success')
  } catch (error) {
    res.redirect(`/register?status=error&error=${error.cause}`)
  }
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