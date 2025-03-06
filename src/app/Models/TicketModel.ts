
export class TicketModel{
    EventDate: string;
    Quota: number;
    TicketCode: string;
    TicketName: string;
    CategoryName: string;
    Price: number;

    constructor(EventDate:string, Quota:number, TicketCode:string, TicketName:string, CategoryName:string, Price:number){
        this.EventDate = EventDate;
        this.Quota = Quota;
        this.TicketCode = TicketCode;
        this.TicketName = TicketName;
        this.CategoryName = CategoryName;
        this.Price = Price;
    }
}