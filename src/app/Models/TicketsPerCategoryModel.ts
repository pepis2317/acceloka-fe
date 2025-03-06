import { BookedTicketModel } from "./BookedTicketModel";

export class TicketsPerCategoryModel{
    QtyPerCategory: number;
    CategoryName: string;
    Tickets: BookedTicketModel[];
    SummaryPrice: number;
    constructor(QtyPerCategory: number, CategoryName:string, Tickets: any, SummaryPrice:number ){
        this.QtyPerCategory = QtyPerCategory;
        this.CategoryName = CategoryName;
        this.Tickets = Tickets.map((ticket:any)=> new BookedTicketModel(ticket.ticketCode, ticket.ticketName, ticket.eventDate, ticket.quantity, ticket.totalPrice))
        this.SummaryPrice = SummaryPrice
    }
}