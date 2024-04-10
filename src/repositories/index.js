import Tickets from "../daos/Mongo/tickets.dao.js";
import TicketRepository from "./tickets.repository.js";

export const ticketsService = new TicketRepository(new Tickets())