import mongoose from 'mongoose'

const messagesCollection = 'messages'

const messageSchema = new mongoose.Schema({
  user: String,
  message: String
})

export default mongoose.model(messagesCollection, messageSchema)