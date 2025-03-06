"use client"
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { FetchHelper } from "../FetchHelper";
import Loading from "./Loading";
import { useRouter } from "next/navigation";
import { TicketModel } from "../Models/TicketModel";
const checkCartForTicket = async (userId: string, ticketCode: string) => {
    return FetchHelper<boolean>(`http://localhost:5029/api/v1/get-ticket-in-cart/${userId}/${ticketCode}`)
};
const addToCart = async (userId: string, ticketCode: string, quantity: number) => {
    return FetchHelper(`http://localhost:5029/api/v1/book-ticket/${userId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            [{
                ticketCode: ticketCode,
                quantity: quantity
            }],
        )
    })

};
export default function Ticket({ ticket }: { ticket: TicketModel }) {
    const [hasBeenClicked, sethasBeenClicked] = useState(false)
    const [detail, showDetail] = useState(false)
    const { data: session } = useSession()
    const [loading, setLoading] = useState(false)
    const [inCart, setInCart] = useState(false)
    const [errMessage, setErrMessage] = useState("")
    const [count, setCount] = useState(0)
    const router = useRouter();
    const addAmount = () => {
        setCount(count + 1)
    }
    const subtractAmount = () => {
        if (count > 0) {
            setCount(count - 1)
        }
    }
    useEffect(() => {
        const fetchData = async () => {
            if (!session?.user) return;
            setLoading(true);
            const check = await checkCartForTicket(session.user.userId, ticket.TicketCode);
            if (check.success && check.data) {
                setInCart(check.data)
            } else {
                if (check.error) {
                    setErrMessage(check.error)
                }
            }
            setLoading(false)
        };
        if (detail) {
            fetchData();
        }

    }, [session?.user, hasBeenClicked]);
    const handleDetailClick = () => {
        if (!session?.user) {
            router.push("/SignUp")
        }
        if (!hasBeenClicked) {
            sethasBeenClicked(true)
        }
        if (detail == false) {
            showDetail(true)
        } else {
            showDetail(false)
        }
    }
    const handleAddToCart = async () => {
        if (session?.user) {
            setLoading(true);
            const data = await addToCart(session.user.userId, ticket.TicketCode, count)
            if (data.success) {
                router.push("/Cart")
            } else {
                if (data.error) {
                    console.log(data.error)
                    setErrMessage(data.error)
                }
                setLoading(false)
            }

        }
    }
    return (
        <div className="overflow-hidden text-start w-[80%] md:w-96 drop-shadow  flex flex-col justify-between bg-blurryColor/60 backdrop-blur-md p-5 rounded-md border border-blurryBorder/25" >
            <div className="cursor-pointer  flex flex-col justify-between h-96" onClick={handleDetailClick}>
                <div >
                    <h1 className="text-3xl md:text-xl font-bold">{ticket.TicketName}</h1>
                    <h1 className="text-2xl md:text-lg">{ticket.CategoryName}</h1>
                </div>
                <div>
                    <h2 className="text-2xl md:text-lg">{ticket.TicketCode}</h2>
                    <h2 className="text-xl md:text-base">{ticket.EventDate}</h2>
                    <h2 className="text-xl md:text-base">{ticket.Quota} tickets available</h2>
                    <h2 className="text-xl md:text-base">Price: {ticket.Price}</h2>
                </div>
            </div>
            {detail && session?.user ?
                <div>
                    {loading ?
                        <div className="mt-5 rounded-sm w-full h-fit flex justify-center items-center p-2">
                            <Loading />
                        </div>
                        :
                        <div>
                            {inCart ?
                                <button className="w-full bg-lightNavy  rounded  mt-5 text-lg p-5" onClick={() => router.push("/Cart")}>View in Cart</button> :
                                <div className=" flex justify-center flex-col items-center mt-5">
                                    <div className="w-full  flex h-fit text-xl justify-between items-center bg-darkNavy p-1 rounded-md">
                                        <button onClick={subtractAmount} className="w-10 h-10 md:h-8 md:w-8  rounded-md bg-lightNavy">-</button>
                                        <h4>{count}</h4>
                                        <button onClick={addAmount} className="w-10 h-10 md:h-8 md:w-8 rounded-md bg-lightNavy ">+</button>
                                    </div>
                                    <button className="w-full bg-gradient-to-r from-[#FFBDA7] via-[#ED6885] to-[#464C95]  p-1 rounded m-5 text-lg" onClick={handleAddToCart}>
                                        <h1 className="bg-lightNavy p-5 rounded">Add to cart</h1>
                                    </button>
                                </div>
                            }
                        </div>
                    }
                    {errMessage == "" ? <></> :
                        <div className="mt-2 w-full bg-lightNavy h-fit flex justify-center rounded-md items-center p-2 text-white">
                            Error: {errMessage}
                        </div>
                    }
                </div> : <></>}


        </div>
    )
}