import passport from "passport";
import local from "passport-local";
import { hashPassword } from "../utils.js";
import Users from '../daos/models/user.model.js'

const LocalStrategy = local.Strategy
const initializePassport = () => {
  passport.use('register', new LocalStrategy(
    { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
      const { first_name, last_name, age, email } = req.body
      try {
        const newUser = {
          first_name,
          last_name,
          age,
          email,
          password
        }
        //Verifico que estén todos los campos obligatorios y lanzo un error si falta alguno
        const missingFields = []
        Object.entries(newUser).forEach(([key, value]) => !value && missingFields.push(key))
        if (missingFields.length) {
          return done(null, false, missingFields.length == 1 ? `Falta el campo ${missingFields.join(', ')}` : `Faltan los campos ${missingFields.join(', ')}` )
        }
        //Verifico que no exista el email
        if (await Users.countDocuments({ email })) {
          return done(null, false, `Ya existe un usuario con el email ${email}`)
        } else {
          newUser.password = hashPassword(password)
          const result = await Users.create(newUser)
          return done(null, result)
        }
      } catch (error) {
        return done(`Error al obtener el usuario: ${error}`)
      }
    }
  ))
  passport.serializeUser((user, done) => {
    done(null, user._id)
  })
  passport.deserializeUser(async (id, done) => {
    const user = await Users.findById(id)
    done(null, user)
  })
}

export default initializePassport