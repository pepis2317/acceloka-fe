"use client"

import { getSession, signIn, useSession } from "next-auth/react"
import { redirect, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { FetchHelper } from "../FetchHelper";
import Loading from "../Components/Loading";
import Footer from "../Components/Footer";

const updateData = async (userId: string, userName: string, email: string, oldPassword: string, newPassword: string) => {
    return FetchHelper(`http://localhost:5029/api/v1/edit-user`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            {
                userId: userId,
                userName: userName,
                email: email,
                oldPassword: oldPassword,
                newPassword: newPassword,
            },
        ),
    })
};
export default function EditProfile() {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirm, setConfirm] = useState("")
    const [errMessage, setErrMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const { data: session, update } = useSession()
    useEffect(() => {
        if (session?.user) {
            setUsername(session.user.userName)
            setEmail(session.user.email)
        }
    }, [session])
    console.log(session?.user.userName)
    const handleClick = async () => {
        if (session?.user) {
            setLoading(true);
            const res = await updateData(session.user.userId, username, email, oldPassword, newPassword)
            if (res.success) {
                await update({
                    user: {
                        ...session.user,
                        userName: username,
                        email: email,
                    }
                });
                await getSession();
                redirect("/")
            } else {
                if (res.error) {
                    setErrMessage(res.error)
                }
            }
            setLoading(false)
        }
    }
    return (
        <div className="w-full flex flex-col justify-center items-center bg-darkNavy">
            <div className="flex flex-col w-96 gap-2 p-5 bg-blurryColor  border border-blurryBorder/25 rounded-md mb-32 mt-52">
                <h1>Username</h1>
                <input className="p-3 rounded bg-lighterNavy" type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} value={username} />
                <h1>Email</h1>
                <input className="p-3 rounded bg-lighterNavy" type="text" placeholder="Example@mail.com" onChange={(e) => setEmail(e.target.value)} value={email} />
                <h1>Old Password</h1>
                <input className="p-3 rounded bg-lighterNavy" type="password" placeholder="Password" onChange={(e) => setOldPassword(e.target.value)} />
                <h1>New Password</h1>
                <input className="p-3 rounded bg-lighterNavy" type="password" placeholder="New password" onChange={(e) => setNewPassword(e.target.value)} />
                {loading ?
                    <div className="mt-2  w-full  bg-darkNavy p-5 h-fit flex justify-center items-center text-lg rounded-md text-white">
                        <Loading />
                    </div>
                    :
                    <button className=" mt-2 w-full  bg-gradient-to-r from-[#FFBDA7] via-[#ED6885] to-[#464C95] p-1 h-fit flex justify-center items-center text-lg rounded-md text-white" onClick={handleClick}>
                        <h1 className="p-5 bg-darkNavy  w-full rounded-md">Edit</h1>
                    </button>
                }
                {errMessage != "" ? <h1 className="w-full text-center bg-darkNavy p-2 mt-2">{errMessage}</h1> : <></>}
            </div>
            <Footer/>
        </div>
    )
}