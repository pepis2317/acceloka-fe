"use client"
import { useRouter } from "next/navigation";
import { useState } from "react"
import { FetchHelper } from "../FetchHelper";
import Footer from "../Components/Footer";
const register = async (userName: string, email: string, password: string) => {
    return FetchHelper(`http://localhost:5029/api/v1/register-user`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            {
                userName: userName,
                email: email,
                password: password,
            },
        ),
    })
};

export default function SignUp() {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirm, setConfirm] = useState("")
    const [errMessage, setErrMessage] = useState("")
    const router = useRouter();
    const handleSubmit = async () => {
        if (username == "") {
            setErrMessage("Username must not be empty")
            return
        }
        if (email == "") {
            setErrMessage("Email must not be empty")
            return
        }
        if (password == "") {
            setErrMessage("Password must not be empty")
            return
        }
        if (password != confirm) {
            setErrMessage("Passwords don't match vro")
            return
        }
        const res = await register(username, email, password)
        if (res.success) {
            router.push("/SignIn")
        } else {
            if (res.error) {
                setErrMessage(res.error)
            }
        }

    }
    return (
        <div className="w-full flex flex-col justify-center items-center bg-darkNavy">
            <h1 className="p-5 font-bold text-2xl mt-52">New Around Here?</h1>
            <div className="flex flex-col w-96 gap-2 p-5 bg-blurryColor  border border-blurryBorder/25 rounded-md">
                <h1>Username</h1>
                <input className="p-3 rounded bg-lighterNavy" type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
                <h1>Email</h1>
                <input className="p-3 rounded bg-lighterNavy" type="text" placeholder="Example@mail.com" onChange={(e) => setEmail(e.target.value)} />
                <h1>Password</h1>
                <input className="p-3 rounded bg-lighterNavy" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                <h1>Confirm Password</h1>
                <input className="p-3 rounded bg-lighterNavy" type="password" placeholder="Confirm password" onChange={(e) => setConfirm(e.target.value)} />
                <button className=" mt-2 w-full  bg-gradient-to-r from-[#FFBDA7] via-[#ED6885] to-[#464C95] p-1 h-fit flex justify-center items-center text-lg rounded-md text-white" onClick={handleSubmit}>
                    <h1 className="p-5 bg-darkNavy  w-full rounded-md">Register</h1>
                </button>
                {errMessage != "" ? <h1 className="w-full text-center bg-darkNavy p-2 mt-2">{errMessage}</h1> : <></>}
            </div>
            <Footer />
        </div>
    )
}