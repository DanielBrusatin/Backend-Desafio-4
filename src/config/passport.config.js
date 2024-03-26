import passport from 'passport'
import local from 'passport-local'
import GitHubStrategy from 'passport-github2'
import { checkPassword, hashPassword } from '../utils.js'
import Users from '../daos/models/user.model.js'
import { githubCallbackUrl, githubClientId, githubClientSecret } from './config.js'



const LocalStrategy = local.Strategy
const initializePassport = () => {
  //Estrategia de registro
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
        //Verifico que estén todos los campos obligatorios y lanzo un mensaje de error si falta alguno
        const missingFields = []
        Object.entries(newUser).forEach(([key, value]) => !value && missingFields.push(key))
        if (missingFields.length) return done(null, false, { message: missingFields.length == 1 ? `Falta el campo ${missingFields.join(', ')}` : `Faltan los campos ${missingFields.join(', ')}` })
        //Si ya existe el mail en la DB lanzo un mensaje de eror
        if (await Users.countDocuments({ email })) return done(null, false, { message: `Ya existe un usuario con el email ${email}` })
        //Si están todos los campos ok y el mail no existe en la DB hasheo la contraseña y creo el nuevo usuario 
        newUser.password = hashPassword(password)
        const result = await Users.create(newUser)
        return done(null, result)
        //Si falla el proceso en algún momento lanzo la info del error
      } catch (error) {
        return done(`Error al obtener el usuario: ${error}`)
      }
    }
  ))

  //Estrategia de login
  passport.use('login', new LocalStrategy(
    { usernameField: 'email' }, async (username, password, done) => {
      try {
        //Verifico que esté el mail y la contraseña
        if (!username || !password) return done(null, false, { message: 'Completar email y contraseña' })
        //Verifico si existe el usuario en la DB, si no existe lanzo un mensaje de error
        const user = await Users.findOne({ email: username })
        if (!user) return done(null, false, { message: `No existe un usuario con email: ${username}.` })
        //Verifico la contraseña, si es incorrecta lanzo un mensaje de error; y si es correcta devuelvo el usuario.
        if (!checkPassword(user, password)) return done(null, false, { message: 'Contraseña incorrecta' })
        return done(null, user)
        //Si falla el proceso en algún momento lanzo la info del error
      } catch (error) {
        return done(`Error al obtener el usuario: ${error}`)
      }
    }
  ))

  //Estrategia de login con Github
  passport.use('github', new GitHubStrategy({
    clientID: githubClientId,
    clientSecret: githubClientSecret,
    callbackURL: githubCallbackUrl
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      //Busco si existe un usuario ya registrado en mi DB con ese email
      const user = await Users.findOne({ email: profile._json.email })
      //Si existe, devuelvo ese usuario
      if (user) return done(null, user)
      //Si no existe creo uno nuevo con los datos obtenidos de Github y rellenando los que no me envía.
      const newUser = {
        first_name: profile._json.name,
        last_name: ' ',
        age: 18,
        email: profile._json.email,
        password: ''
      }
      const result = await Users.create(newUser)
      return done(null, result)
      //Si falla el proceso en algún momento lanzo la info del error
    } catch (error) {
      return done(`Error al obtener el usuario: ${error}`)
    }
  }))

  passport.serializeUser((user, done) => {
    done(null, user._id)
  })
  passport.deserializeUser(async (id, done) => {
    const user = await Users.findById(id)
    done(null, user)
  })
}

export default initializePassport