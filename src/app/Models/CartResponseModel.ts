import { TicketsPerCategoryModel } from "./TicketsPerCategoryModel";


export class CartResponseModel{
    BookingId: string;
    BookedTickets: TicketsPerCategoryModel[];
    constructor(BookingId:string, BookedTickets:any){
        this.BookingId = BookingId;
        this.BookedTickets = BookedTickets.map((item:any)=> new TicketsPerCategoryModel(
            item.qtyPerCategory,
            item.categoryName,
            item.tickets,
            item.summaryPrice
        ))
    }
}