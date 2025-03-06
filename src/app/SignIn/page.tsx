"use client"

import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Footer from "../Components/Footer"

export default function SignIn() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errMessage, setMessage] = useState("")
    const router = useRouter();
    const handleSubmit = async () => {
        if (email == "") {
            setMessage("Email must not be empty")
            return
        }
        if (password == "") {
            setMessage("Password must not be empty")
            return
        }
        const res = await signIn("credentials", {
            email: email,
            password: password,
            redirect: false
        })
        if (!res?.ok) {
            setMessage("Invalid credentials")
        } else {
            router.push("/")
        }
    }
    return (
        <div className="w-full flex flex-col justify-center items-center bg-darkNavy">
            <h1 className="p-5 font-bold text-2xl mt-52">Welcome back!</h1>
            <div className="flex flex-col w-96 gap-2 p-5 bg-blurryColor  border border-blurryBorder/25 rounded-md">
                <h1>Email</h1>
                <input className="p-3 rounded bg-lighterNavy" type="text" placeholder="Example@mail.com" onChange={(e) => setEmail(e.target.value)} />
                <h1>Password</h1>
                <input className="p-3 rounded bg-lighterNavy" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                <button className=" mt-2 w-full  bg-gradient-to-r from-[#FFBDA7] via-[#ED6885] to-[#464C95] p-1 h-fit flex justify-center items-center text-lg rounded-md text-white" onClick={handleSubmit}>
                    <h1 className="p-5 bg-darkNavy  w-full rounded-md">Log In</h1>
                </button>
                {errMessage != "" ? <h1 className="w-full text-center bg-darkNavy p-2 mt-2">{errMessage}</h1> : <></>}

            </div>
            <Footer />
        </div>
    )
}