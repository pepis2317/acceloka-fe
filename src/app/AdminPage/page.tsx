"use client"

import { useSession } from "next-auth/react"
import { FetchHelper } from "../FetchHelper"
import { useEffect, useState } from "react"
import { redirect } from "next/navigation"
import Loading from "../Components/Loading"

const getUsers = async () => {
    return FetchHelper(`http://localhost:5029/api/v1/get-all-users`)
}
const deleteUser = async (userId: string) => {
    return FetchHelper(`http://localhost:5029/api/v1/delete-user/${userId}`,{
        method:'DELETE'
    })
}
export default function AdminPage() {
    const { data: session } = useSession()
    const [users, setUsers] = useState<any[]>()
    const [loading, setLoading] = useState(false)
    const [errMessage, setErrMessage] = useState("")
    const fetchData = async () => {
        setLoading(true)
        const data = await getUsers()
        if (data.success) {
            setUsers(data.data)
        }
        setLoading(false)
    }
    useEffect(() => {

        if (session?.user) {

            if (session.user.role == "admin") {

                fetchData()
            } else {
                redirect("/")
            }

        }
    }, [session])
    const handleDelete = async (userId: string) => {
        console.log(userId)
        const data = await deleteUser(userId)
        if (data.success) {
            setUsers([])
            fetchData()
        }else{
            setErrMessage(data.error)
        }

    }

    return (
        <div className="flex justify-center">
            {loading ? <div className="mt-2  w-32  bg-lightNavy p-5 h-fit flex justify-center items-center text-lg rounded-md text-white">
                <Loading />
            </div> :
                <div className=" flex flex-col gap-5 p-5 w-full lg:w-[50%]">
                    {users?.map((user, index) => (
                        <div key={index} className="w-full bg-lightNavy p-5 flex flex-col md:flex-row md:justify-between gap-1 rounded">
                            <div>
                                <h1 className="text-2xl"> {user.userName} </h1>
                                <h1 className="text-lg">{user.email}</h1>
                                <h1 className="text-xs">{user.userId} </h1>
                            </div>
                            <button className="w-full mt-5 md:mt-0 md:w-32  bg-red-500 p-2 rounded" onClick={()=>handleDelete(user.userId)}>Delete :3</button>
                        </div>
                    ))}
                </div>
            }




        </div>
    )
}