export class BookedTicketModel{
    TicketCode: string;
    TicketName: string;
    EventDate: Date;
    Quantity: number;
    TotalPrice: number
    constructor(TicketCode:string, TicketName:string, EventDate: Date, Quantity: number, TotalPrice:number){
        this.TicketCode = TicketCode;
        this.TicketName = TicketName;
        this.EventDate = EventDate;
        this.Quantity = Quantity;
        this.TotalPrice = TotalPrice;
    }
}