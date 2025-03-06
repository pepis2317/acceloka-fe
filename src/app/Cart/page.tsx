"use client"
import { useEffect, useState } from "react"
import BookedTicketWrapper from "../Components/BookedTicketWrapper"
import { useSession } from "next-auth/react"

import { FetchHelper } from "../FetchHelper"
import { useRouter } from "next/navigation"
import Loading from "../Components/Loading"
import { TicketsPerCategoryModel } from "../Models/TicketsPerCategoryModel"
import Link from "next/link"
import Footer from "../Components/Footer"

const getData = async (userId: string) => {
    return FetchHelper(`http://localhost:5029/api/v1/get-cart-incomplete/${userId}`)
}
const finishTransaction = async (userId: string, bookingId: string) => {
    return FetchHelper(`http://localhost:5029/api/v1/finish-transaction/${userId}/${bookingId}`, {
        method: 'PUT'
    })
}

export default function Cart() {
    const [booking, setBooking] = useState<TicketsPerCategoryModel[]>()
    const [categories, setCategories] = useState<any[]>()
    const [bookingId, setBookingId] = useState("")
    const [loading, setLoading] = useState(false)
    const [total, setTotal] = useState(0)
    const [errMessage, setErrMessage] = useState("")
    const { data: session } = useSession()
    const router = useRouter()
    const fetchData = async () => {
        if (session?.user) {
            setLoading(true)
            const data = await getData(session?.user.userId)
            if (data.success) {
                const fetchedData = data.data[0]
                if (fetchedData.bookedTickets.length != 0) {
                    setBookingId(fetchedData.bookingId)
                    let fetchedCategories: any = []
                    let bookingData: TicketsPerCategoryModel[] = fetchedData.bookedTickets.map(
                        (item: any) => {
                            fetchedCategories.push({
                                name: item.categoryName,
                                total: item.summaryPrice
                            })
                            console.log(item)
                            setTotal((prevTotal) => prevTotal + item.summaryPrice)
                            return new TicketsPerCategoryModel(item.qtyPerCategory, item.categoryName, item.tickets, item.summaryPrice)
                        }
                    );
                    setBooking(bookingData);
                    setCategories(fetchedCategories)
                } else {
                    setBooking([])
                }
            } else {
                if (data.error) {
                    setErrMessage(data.error)
                }
            }
            setLoading(false)
        } else {
            router.push("/SignIn")
        }
    };

    useEffect(() => {

        fetchData()
    }, [])
    const handlePaymentClick = async () => {
        if (session?.user) {
            setLoading(true)
            const data = await finishTransaction(session?.user.userId, bookingId)
            if (data.success) {
                router.push("/")
            } else {
                if (data.error) {
                    setErrMessage(data.error)
                }
            }
            setLoading(false)
        }
    }
    const handleTransacRefresh = () => {
        setTotal(0)
        fetchData()
    }
    return (
        <div className="w-full overflow-hidden relative">
            <img src="/purpleLight.svg" className=" absolute -left-full top-0 -translate-y-1/2 translate-x-1/2 opacity-80" />
            <img src="/blueLight.svg" className="absolute top-0 right-0 translate-x-1/2" />
            {errMessage == "" ? <></> :
                <div className=" w-full bg-black h-fit flex justify-center items-center p-2 ">
                    {errMessage}
                </div>
            }
            
            <div className="flex justify-start items-center md:pl-16 pl-5 h-32 relative ">
                <Link href="/" className="text-2xl mr-2">Home</Link>
                <h1 className="text-2xl    ">/ Cart</h1>
            </div>


            {loading ?
                <div className="mt-5 rounded-sm w-full h-[50vh] flex justify-center items-center">
                    <Loading />
                </div> :
                <div className={`relative ${booking && booking.length > 0?"bg-blurryColor bg-opacity-50 relative " :""}`}>
                    {booking && booking.length > 0 ?
                        <div className="w-full flex flex-col lg:flex-row lg:gap-5 justify-center items-start  p-5 md:p-16 md:pt-5 md:pb-5 relative -top-5  ">
                            <BookedTicketWrapper onEditClick={handleTransacRefresh} editable={true} bookingId={bookingId} bookedTickets={booking} />
                            <div className=" w-full lg:w-[30%] relative -top-5 h-fit rounded-md p-5 flex flex-col items-end gap-2 md:mr-5 mt-10 lg:mt-0 bg-blurryColor/50 backdrop-blur-md border border-blurryBorder/25 ">

                                {categories?.map((item, index) => (
                                    <div key={index} className="flex flex-col items-end  ">
                                        <h1 className="text-sm w-fit font-bold text-end">{item.name}:</h1>
                                        <h1 className="text-xl w-fit text-end">{item.total}</h1>

                                    </div>
                                ))}
                                <div className="flex  flex-col items-end  w-full border  border-blurryBorder/25 border-l-0 border-r-0 border-b-0 pt-5 mt-5">
                                    <h1 className="text-xl font-bold text-end">Grand Total:</h1>
                                    <h1 className="text-xl w-fit text-end">{total}</h1>
                                </div>


                                {loading ?
                                    <div className="mt-2  w-32  bg-zinc-800 p-5 h-fit flex justify-center items-center text-lg rounded-md text-white">
                                        <Loading />
                                    </div>
                                    :
                                    <button className=" mt-2 w-32  bg-gradient-to-r from-[#FFBDA7] via-[#ED6885] to-[#464C95] p-1 h-fit flex justify-center items-center text-lg rounded-md text-white" onClick={handlePaymentClick}>
                                        <h1 className="p-5 bg-lightNavy  w-full rounded-md">Pay</h1>
                                    </button>
                                }

                            </div>


                        </div>
                        :
                        <div className="mt-5 rounded-sm w-full gap-5 h-full flex flex-col justify-center items-center p-2 ">
                            <h1 className="text-4xl font-bold">Cart is Empty</h1>
                            <h1 className="text-xl ">Go make some</h1>
                        </div>
                    }
                </div>
            }
            <Footer/>
        </div>
    )
}