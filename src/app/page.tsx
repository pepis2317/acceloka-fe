"use client"
import Link from "next/link";
import { useEffect, useState } from "react";
import { TicketResponseModel } from "./Models/TicketResponseModel";
import Query from "./Components/Query";
import Loading from "./Components/Loading";
import Ticket from "./Components/Ticket";
import { FetchHelper } from "./FetchHelper";
import Footer from "./Components/Footer";
const getData = async (query: string) => {
  return FetchHelper(`http://localhost:5029/api/v1/get-available-ticket${query}`)
}
export default function Home() {
  const [query, setQuery] = useState("")
  const [errMessage, setErrMessage] = useState("")
  const [ticketData, setTicketData] = useState<TicketResponseModel>()
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getData(query)
      if (data.success) {
        const fetchedData = data.data
        setTicketData(new TicketResponseModel(fetchedData.tickets, fetchedData.totalTickets))
      } else {
        if (data.error) {
          setErrMessage(data.error)
        }
      }
      setLoading(false);
    }
    fetchData()
  }, [query])

  return (
    <div className="w-full  overflow-hidden relative">
      <img src="/purpleLight.svg" className="z-0 absolute -left-full top-0 -translate-y-1/2 translate-x-1/2 opacity-80" />
      <img src="/blueLight.svg" className="z-0 absolute top-0 right-0 translate-x-1/2" />
      {errMessage == "" ? <></> :
        <div className="w-full bg-black h-fit flex justify-center items-center p-2 gap-5">
          {errMessage}
        </div>
      }
      <div className="w-full h-96 flex flex-col md:flex-row justify-center items-center p-10 gap-3 mt-5 mb-10">
        <div className="w-full md:w-[60%] h-[70%] md:h-full rounded-xl bg-blurryColor/60 backdrop-blur-md p-5  border border-blurryBorder/25 overflow-hidden">
          <img src="/journey.svg" className="absolute -right-16 lg:scale-110 lg:top-10 lg:-right-14" />
          <div className="absolute left-10 top-1/2 -translate-y-1/2 ">
            <h1 className="text-5xl lg:text-6xl font-bold mb-2">Where to next?</h1>
            <h1 className="text-lg lg:text-xl font-thin">Get it? cus like...next.js?</h1>
            <h1 className="text-xs font-thin">Sok asik ini org kesel gw</h1>
          </div>
        </div>
        <div className="w-full flex flex-col justify-between md:w-[30%] h-[30%] md:h-full rounded-xl bg-blurryColor/60 backdrop-blur-md p-5 border border-blurryBorder/25">
          <h1 className="text-2xl font-bold lg:text-3xl">Filler content here</h1>
          <h1 className="text-xs">Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem, adipisci.</h1>
        </div>
      </div>
      <div className="z-10 w-full flex justify-center h-fit b bg-blurryColor bg-opacity-50 relative ">
        <div className="lg:flex lg:items-start w-[90%] relative -top-5 ">
          <Query onQuerySubmit={setQuery} />
          {loading ?
            <div className="rounded-sm w-full lg:w-[60%] h-full flex justify-center items-center">
              <Loading />
            </div> :
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5 lg:mt-0 lg:ml-5">

              {ticketData?.Tickets.map((ticket, index) => (
                <div key={index} className="w-full h-full flex justify-center">
                  <Ticket ticket={ticket} />
                </div>

              ))}
            </div>
          }
        </div>
      </div>
      <Footer/>
    </div>

  );
}
