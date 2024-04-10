import Messages from './models/message.model.js'

class MessagesDao {
  static async getMessages() {
    return await Messages.find().lean()
  }
  static async addMessage(message) {
    return await new Messages(message).save()
  }
}

export default MessagesDao