"use client"

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import Loading from "./Loading";
import { FetchHelper } from "../FetchHelper";

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
const checkCartForTicket = async (userId: string, ticketCode: string) => {
    return FetchHelper<boolean>(`http://localhost:5029/api/v1/get-ticket-in-cart/${userId}/${ticketCode}`)
};
export default function TicketDetail({ ticketName, categoryName, ticketCode, eventDate, quota }: { ticketName: string, categoryName: string, ticketCode: string, eventDate: string, quota: number }) {
    const { data: session } = useSession()
    const router = useRouter();
    const [count, setCount] = useState(0)
    const [loading, setLoading] = useState(false)
    const [inCart, setInCart] = useState(false)
    const [errMessage, setErrMessage] = useState("")

    const addAmount = () => {
        setCount(count + 1)
    }
    const subtractAmount = () => {
        if (count > 0) {
            setCount(count - 1)
        }
    }
    const handleAddToCart = async () => {
        if (session?.user) {
            setLoading(true);
            const data = await addToCart(session.user.userId, ticketCode, count)
            if (data.success) {
                router.push("/Cart")
            } else {
                if (data.error) {
                    setErrMessage(data.error)
                }
                setLoading(false)
            }

        }
    }

    useEffect(() => {
        const fetchData = async () => {
            if (!session?.user) return;
            setLoading(true);
            const check = await checkCartForTicket(session.user.userId, ticketCode);
            if (check.success && check.data) {
                setInCart(check.data)
            } else {
                if (check.error) {
                    setErrMessage(check.error)
                }
            }
            setLoading(false)
        };

        fetchData();
    }, [session?.user, ticketCode]);

    return (
        <div className="p-5 bg-white rounded-sm drop-shadow ">
            <div className="p-5">
                <div>
                    <h1 className="text-3xl font-bold">{ticketName}</h1>
                    <h1 className="text-2xl">{categoryName}</h1>
                </div>
                <div className="mt-10">
                    <h2 className="text-2xl">{ticketCode}</h2>
                    <h2 className="text-lg">{eventDate}</h2>
                    <h2 className="text-xl">{quota} tickets available</h2>
                </div>
            </div>

            {loading ?
                <div className="mt-5 rounded-sm w-full bg-black h-fit flex justify-center items-center p-2">
                    <Loading />
                </div>
                :
                <div>
                    {inCart ? <button className="w-full bg-black text-white p-2 mt-5" onClick={() => router.push("/Cart")}>View in Cart</button> :
                        <div>
                            <div className="p-2 flex justify-between text-2xl">
                                <button onClick={subtractAmount}>-</button>
                                <h4>{count}</h4>
                                <button onClick={addAmount}>+</button>
                            </div>
                            <button className="w-full bg-black text-white p-3 rounded-md mt-5 text-lg" onClick={handleAddToCart}>Add to cart</button>
                        </div>
                    }
                </div>
            }
            {errMessage == "" ? <></> :
                <div className="mt-4 w-full bg-black h-fit flex justify-center rounded-md items-center p-2 text-white">
                    Error: {errMessage}
                </div>
            }
        </div>
    )
}