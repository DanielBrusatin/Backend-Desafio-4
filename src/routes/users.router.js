import { Router } from 'express'
import UsersDao from '../daos/Mongo/users.dao.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const users = await UsersDao.getAll()
    res.status(200).send({
      status: 200,
      result: 'success',
      payload: users
    })
  } catch (error) {
    console.log('Cannot get users whit mongoose' + error)
    res.status(500).send({
      status: 500,
      result: 'error',
      error: 'Error connection to db'
    })
  }
})

router.post('/', async (req, res) => {
  const user = req.body
  await UsersDao.add(user)
  res.send(user)
})

export default router