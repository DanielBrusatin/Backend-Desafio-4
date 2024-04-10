import mongoose from 'mongoose'

const ticketCollection = 'ticket'

const ticketSchema = new mongoose.Schema({
  code: String,
  purchase_datetime: Date,
  amount: Number,
  purchaser: String
})

export default mongoose.model(ticketCollection, ticketSchema)