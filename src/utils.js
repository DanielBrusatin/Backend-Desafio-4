import { fileURLToPath } from 'url'
import { dirname } from 'path'
import bcrypt from 'bcrypt'

//Función para hashear contraseña
export const hashPassword = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
//Función para chequear contraseña
export const checkPassword = (user, password) => bcrypt.compareSync(password, user.password)

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default __dirname