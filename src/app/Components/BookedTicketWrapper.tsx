"use client"
import { useEffect, useState } from "react";
import { TicketsPerCategoryModel } from "../Models/TicketsPerCategoryModel";
import BookedTicket from "./BookedTicket";

export default function BookedTicketWrapper({ onEditClick, editable, bookingId, bookedTickets }: { onEditClick: () => void, editable: boolean, bookingId: string, bookedTickets: TicketsPerCategoryModel[] }) {
    const [columns, setColumns] = useState(3); // Default to large screen

    // Function to determine column count dynamically
    useEffect(() => {
        const updateColumns = () => {
            if (window.innerWidth < 768) setColumns(1); // Mobile
            else if (window.innerWidth < 1024) setColumns(2); // Tablet
            else setColumns(3); // Large screen
        };

        updateColumns();
        window.addEventListener("resize", updateColumns);
        return () => window.removeEventListener("resize", updateColumns);
    }, []);

    // Determine total slots based on screen width
    const totalSlots = Math.ceil(bookedTickets.length / columns) * columns;
    const emptySlots = totalSlots - bookedTickets.length;
    return (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1  ">
            {bookedTickets.map((category, index) => (
                <div key={index} className="relative -top-5 h-full overflow-hidden rounded-md bg-blurryColor/60 backdrop-blur-md border border-blurryBorder/25" >
                    <h1 className="text-lg p-2 rounded pl-0 rounded-b-none w-full text-center  pt-3">{category.CategoryName}</h1>
                    <div className="flex flex-col h-full p-2 gap-2  rounded rounded-t-none ">
                        {category.Tickets.map((ticket, index) => (
                            <BookedTicket onEditClick={onEditClick} editable={editable} key={index} bookingId={bookingId} ticketName={ticket.TicketName} ticketCode={ticket.TicketCode} eventDate={ticket.EventDate} quantity={ticket.Quantity} totalPrice={ticket.TotalPrice} />
                        ))}
                    </div>

                </div>
            ))}
            {Array.from({ length: emptySlots }).map((_, index) => (
                <div key={index} className="bg-blurryColor/60 backdrop-blur-md p-5 rounded-md border border-blurryBorder/25  relative -top-5  flex items-center justify-center ">
                    
                </div>
            ))}
        </div>
    )
}