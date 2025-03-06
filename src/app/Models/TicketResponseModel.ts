import { TicketModel } from "./TicketModel";


export class TicketResponseModel{
    Tickets: TicketModel[];
    TotalTickets: number;
    constructor(Tickets: any, TotalTickets:number){
        this.Tickets = Tickets.map((ticket:any)=> new TicketModel(ticket.eventDate, ticket.quota, ticket.ticketCode, ticket.ticketName,ticket.categoryName, ticket.price))
        this.TotalTickets = TotalTickets
    }
}
