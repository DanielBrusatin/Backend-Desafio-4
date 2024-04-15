import ticketSchema from "./models/ticket.model.js"
import { v4 as uuidv4 } from 'uuid'

export default class Tickets {
  constructor() {}

  createTicket = async (email, total) => {
    const ticket = {
      code: uuidv4(),
      purchase_datetime: new Date(),
      amount: total,
      purchaser: email
    }
    try {
      let result = await new ticketSchema(ticket).save()
      return result
    } catch (error) {
      return null
    }
  }
}