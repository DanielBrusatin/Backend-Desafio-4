import mongoose from 'mongoose'

const usersCollection = 'users'

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    require: true
  },
  role: {
    type: String,
    default: 'usuario'
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'carts'
  },
})

export default mongoose.model(usersCollection, userSchema)