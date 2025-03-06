
"use client"

import { useEffect, useState } from "react"
import Loading from "./Loading";
import { FetchHelper } from "../FetchHelper";

const updateBookedTicket = async (bookingId: string, ticketCode: string, quantity: number) => {
    return FetchHelper(`http://localhost:5029/api/v1/edit-booked-ticket/${bookingId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify([
            {
                ticketCode: ticketCode,
                quantity: quantity,
            },
        ]),
    })
}
const deleteBookedTicket = async (bookingId: string, ticketCode: string, quantity: number) => {
    return FetchHelper(`http://localhost:5029/api/v1/revoke-ticket/${bookingId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify([
            {
                ticketCode: ticketCode,
                quantity: quantity,
            },
        ]),
    })
}

export default function BookedTicket({ onEditClick, editable, bookingId, ticketName, ticketCode, eventDate, quantity, totalPrice }: { onEditClick: () => void, editable: boolean, bookingId: string, ticketName: string, ticketCode: string, eventDate: Date, quantity: number, totalPrice: number }) {
    const [defaultVal, setDefaultVal] = useState(quantity)
    const [count, setCount] = useState(defaultVal)
    const [errMessage, setMessage] = useState("")
    const [ticketTotal, setTicketTotal] = useState(totalPrice)
    const [loading, setLoading] = useState(false)
    const [changed, setChanged] = useState(false)
    const [deleted, setDeleted] = useState(false)

    const baseValue = totalPrice / quantity
    const addAmount = () => {
        setMessage("")
        setTicketTotal(ticketTotal + baseValue)
        setCount(count + 1)
    }
    const subtractAmount = () => {
        setMessage("")
        if (count > 0) {
            setTicketTotal(ticketTotal - baseValue)
            setCount(count - 1)
        }
    }
    const handleEdit = async () => {
        setLoading(true);
        const data = await updateBookedTicket(bookingId, ticketCode, count);
        if (data.success) {
            setDefaultVal(count)
            onEditClick()
        } else {
            setCount(defaultVal)
            if (data.error) {
                setMessage(data.error)
            }

        }
        setChanged(false);
        setLoading(false);
    };
    const handleDelete = async () => {
        setLoading(true)
        const data = await deleteBookedTicket(bookingId, ticketCode, quantity)
        if (data.success) {
            setDeleted(true)
            onEditClick()
        } else {
            setCount(defaultVal)
            if (data.error) {
                setMessage(data.error)
            }
        }
        setChanged(false);
        setLoading(false);
    }
    useEffect(() => {
        if (count == defaultVal) {
            setChanged(false)
        } else {
            setChanged(true)
        }
    }, [count])
    if (deleted) {
        return null
    }
    return (
        <div className="md:p-3 p-5 h-fit w-full  rounded-md  bg-lightNavy flex flex-col items-center ">

            <div className="flex flex-col items-center gap-5 w-full justify-between">

                <div className="w-full">
                    <h1 className="text-xl md:text-lg">{ticketName}</h1>
                    <h1 className="text-lg md:text-sm">{ticketCode}</h1>
                    <h2 className="text-lg md:text-sm">{eventDate.toString()}</h2>
                    <h2 className="text-lg md:text-sm">Total: {ticketTotal}</h2>
                </div>
                {editable ?
                    <div className="w-full flex h-fit text-xl justify-between items-center  bg-darkNavy p-1 rounded-md">
                        <button onClick={subtractAmount} className="w-10 h-10 md:h-8 md:w-8  rounded-md bg-lighterNavy">-</button>
                        <h4>{count}</h4>
                        <button onClick={addAmount} className="w-10 h-10 md:h-8 md:w-8 rounded-md bg-lighterNavy ">+</button>
                    </div>
                    : <></>}
                {errMessage == "" ? <></> :
                    <div className=" rounded-sm w-full bg-zinc-800 h-fit flex justify-center items-center p-2 text-white">
                        {errMessage}
                    </div>
                }
                {loading ?
                    <div className=" rounded-sm w-full bg-lightNavy h-fit flex justify-center items-center p-1">
                        <Loading />
                    </div>
                    :
                    <div className="w-full">
                        {changed && count > 0 ? <button className="w-full bg-darkNavy text-white rounded-md p-4" onClick={handleEdit}>Edit</button> : <></>}
                        {changed && count == 0 ? <button className="w-full  bg-red-500 text-white  rounded-md p-4" onClick={handleDelete}>Delete</button> : <></>}
                    </div>
                }

            </div>



        </div>


    )
}