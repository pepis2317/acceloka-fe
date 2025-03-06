"use client"
import { useEffect, useState } from "react"
import { FetchHelper } from "../FetchHelper"
import { CartResponseModel } from "../Models/CartResponseModel"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import BookedTicketWrapper from "../Components/BookedTicketWrapper"
import Loading from "../Components/Loading"
import Link from "next/link"
import Footer from "../Components/Footer"

const getData = async (userId: string) => {
    return FetchHelper(`http://localhost:5029/api/v1/get-cart-completed/${userId}`)
}
export default function transactionHistory() {
    const [transactions, setTransactions] = useState<CartResponseModel[]>()
    const [loading, setLoading] = useState(false)
    const [errMessage, setErrMessage] = useState("")
    const { data: session } = useSession()

    useEffect(() => {
        const fetchData = async () => {
            if (session?.user) {
                setLoading(true)
                const data = await getData(session?.user.userId)
                if (data.success) {
                    const fetchedData = data.data
                    if (fetchedData.length != 0) {
                        let cartData: CartResponseModel[] = fetchedData.map((cartItem: any) => new CartResponseModel(cartItem.bookingId, cartItem.bookedTickets))
                        setTransactions(cartData)
                    }
                } else {
                    if (data.error) {
                        setErrMessage(data.error)
                    }
                }
            }
            setLoading(false)
        };
        fetchData()
    }, [session])

    return (
        <div className="w-full overflow-hidden relative">
            <img src="/purpleLight.svg" className="z-0 absolute -left-full top-0 -translate-y-1/2 translate-x-1/2 opacity-80" />
            <img src="/blueLight.svg" className="z-0 absolute top-0 right-0 translate-x-1/2" />
            {errMessage == "" ? <></> :
                <div className=" w-full bg-black h-fit flex justify-center items-center p-2 text-white">
                    {errMessage}
                </div>
            }
            <div className="flex justify-start items-center md:pl-16 pl-5 h-32 relative ">
                <Link href="/" className="text-2xl mr-2">Home</Link>
                <h1 className="text-2xl    ">/ Transaction History</h1>
            </div>
            {loading ?
                <div className="mt-5 rounded-sm w-full h-[50vh] flex justify-center items-center">
                    <Loading />
                </div> :
                <div>
                    {transactions ?
                        <div className="grid grid-cols-1 lg:grid-cols-2 w-full gap-5  items-center p-5 md:p-16 pt-0 md:pt-0">
                            {transactions?.map((transaction, index) => {
                                let total = 0
                                transaction.BookedTickets.map((ticket) => total += ticket.SummaryPrice)
                                return (
                                    <div key={index} className="z-10 w-full h-full rounded-md overflow-hidden bg-blurryColor/60 backdrop-blur-md p-2 border border-blurryBorder/25">
                                        <h1 className="text-lg  p-2 pl-5  ">{transaction.BookingId}</h1>
                                        <div className="mt-5 p-2 pt-7 pb-0 bg-darkerNavy rounded h-full">
                                            <BookedTicketWrapper onEditClick={() => { }} editable={false} bookingId={transaction.BookingId} bookedTickets={transaction.BookedTickets} />
                                            <div className="w-full flex justify-center flex-col items-end pb-5 pr-2">
                                                <h1 className="text-lg font-bold">Grand Total:</h1>
                                                <h1 className="text-xl w-fit">{total}</h1>
                                            </div>

                                        </div>
                                    </div>
                                )
                            })}

                        </div> :
                        <div className="mt-5 rounded-sm w-full gap-5 h-full flex flex-col justify-center items-center p-2 ">
                            <h1 className="text-4xl font-bold">You have made no transactions yet</h1>
                            <h1 className="text-xl ">Go make some</h1>
                        </div>
                    }
                </div>
            }
            <Footer/>
        </div>
    )
}