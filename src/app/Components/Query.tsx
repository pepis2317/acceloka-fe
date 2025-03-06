"use client"

import { useEffect, useState } from "react"
import { FetchHelper } from "../FetchHelper"
const getCatgories = async () => {
    return FetchHelper(`http://localhost:5029/api/v1/get-all-categories`)
}
export default function Query({ onQuerySubmit }: { onQuerySubmit: (query: string) => void }) {
    const [categoryName, setCategoryName] = useState("")
    const [ticketCode, setTicketCode] = useState("")
    const [ticketName, setTicketName] = useState("")
    const [price, setPrice] = useState("")
    const [minDate, setMinDate] = useState("")
    const [maxDate, setMaxDate] = useState("")
    const [orderBy, setOrderBy] = useState("")
    const [orderState, setOrderState] = useState("")
    const [categories, setCategories] = useState<string[]>()
    // const [query, setQuery] = useState("")
    const [errMessage, setErrMessage] = useState("")
    const formatDate = (date: string) => {
        const formattedDate = new Date(date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }).split("/").join("-");
        return encodeURIComponent(formattedDate + " 00:00")
    }
    const appendHelper = (query: string, param: string) => {
        if (query != "?") {
            query += "&";
        }
        query += param;
        return query;
    }
    useEffect(() => {
        const fetchCategories = async () => {
            const data = await getCatgories()
            if (data.success) {
                const fetchedData = data.data
                setCategories(fetchedData)
            } else {
                if (data.error) {
                    setErrMessage(data.error)
                }
            }
        }
        fetchCategories()
    }, [])
    const handleQueryClick = () => {
        let query = ""
        if (categoryName != "") {
            query = appendHelper(query, "CategoryName=" + categoryName)
        }
        if (ticketCode != "") {
            query = appendHelper(query, "TicketCode=" + ticketCode)
        }
        if (ticketName != "") {
            query = appendHelper(query, "TicketName=" + ticketName)
        }
        if (price != "") {
            query = appendHelper(query, "Price=" + price)
        }
        if (minDate != "") {
            query = appendHelper(query, "MinDate=" + formatDate(minDate))
        }
        if (maxDate != "") {
            query = appendHelper(query, "MaxDate=" + formatDate(maxDate))
        }
        if (orderBy != "") {
            query = appendHelper(query, "OrderBy=" + orderBy)
        }
        if (orderState != "") {
            query = appendHelper(query, "OrderState=" + orderState)
        }

        onQuerySubmit(query != "" ? `?${query}` : "")

    }
    const handleComboBox = (hook: any, value: string, excluded: string) => {
        if (value == excluded) {
            hook("")
        } else {
            hook(value)
        }
    }
    return (
        <div className="flex flex-col items-center justify-center lg:items-start  lg:w-[40%] drop-shadow">
            <div className="w-full flex justify-center  ">
                <select className="p-4 h-14  w-full rounded-xl bg-lightNavy  " onChange={(e) => handleComboBox(setCategoryName, e.target.value, "Any Category")}>
                    <option>Any Category</option>
                    {categories?.map((category, index) => (<option key={index}>{category}</option>))}
                </select>
            </div>
            <div className='flex gap-2 w-full  mt-2'>
                <input type="text" className="p-4 w-1/2  bg-lightNavy  rounded-lg" placeholder='TicketCode' onChange={(e) => setTicketCode(encodeURIComponent(e.target.value))} />
                <input type="number" className="p-4 w-1/2 bg-lightNavy  rounded-lg" placeholder='Price' onChange={(e) => setPrice(encodeURIComponent(e.target.value))} />
            </div>
            <div className='flex gap-2 mt-2 w-full'>
                <div className="w-1/2">
                    <h1>Min Date</h1>
                    <input type="date" className="p-4 w-full bg-lightNavy  rounded-lg" placeholder='MinDate' onChange={(e) => setMinDate(e.target.value)} />
                </div>
                <div className="w-1/2">
                    <h1>Max Date</h1>
                    <input type="date" className="p-4 w-full bg-lightNavy  rounded-md" placeholder='MaxDate' onChange={(e) => setMaxDate(e.target.value)} />
                </div>
            </div>
            <div className="mt-2 items-center w-full">
                <input type="text" className="p-5 w-full bg-lightNavy    rounded-lg" placeholder='Search for ticket name' onChange={(e) => setTicketName(encodeURIComponent(e.target.value))} />
                <button className="mt-2 w-full h-full rounded-lg bg-gradient-to-r from-[#FFBDA7] via-[#ED6885] to-[#464C95] flex justify-center items-center p-1" onClick={handleQueryClick}>
                    <h1 className="p-5 bg-lightNavy  w-full rounded-md">Begin Search</h1>
                </button>
            </div>
            <div className="pt-0 flex flex-col gap-2 w-full mt-2">
                <select className="p-3 w-full bg-lightNavy  rounded-lg" onChange={(e) => handleComboBox(setOrderBy, e.target.value.replace(/\s/g, ''), "SortbyNone")}>
                    <option >Sort by None</option>
                    <option>Event Date</option>
                    <option>Quota</option>
                    <option>Ticket Code</option>
                    <option>Ticket Name</option>
                    <option>Category Name</option>
                    <option>Price</option>
                </select>
                {orderBy == "" ?
                    <></> :
                    <select className="p-3 w-full bg-white rounded-lg" onChange={(e) => handleComboBox(setOrderState, e.target.value, "Ascending")}>
                        <option>Ascending</option>
                        <option>Descending</option>
                    </select>
                }
            </div>
            {errMessage != "" ?
                <div className="mt-2 p-2 bg-zinc-800 text-white w-[80%] md:w-full text-center rounded-md">Err: {errMessage}</div> : <></>}

        </div>


    )
}