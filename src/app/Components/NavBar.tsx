"use client"
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NavBar() {
    const [hide, setHide] = useState(false)
    const { data: session } = useSession()
    const router = useRouter();
    const handleSignOut = () => {
        signOut({ callbackUrl: '/', redirect: false })
        router.push("/")
    }
    // console.log(session?.user.role)
    const handleClick = () => {
        if (hide) {
            setHide(false)
        } else {
            setHide(true)
        }
    }
    return (
        <div className="z-50  sticky top-0  ">
            <div className={`z-50 p-2 drop-shadow-lg bg-darkNavy/50 backdrop-blur-xl flex justify-end  md:justify-center relative`}>
                <button className=" md:hidden w-14 h-14 p-5 rounded-lg bg-lightNavy flex justify-center items-center " onClick={handleClick}>
                    <img src="/dropDown.png" className=""/>
                </button>
                <div className="hidden md:flex justify-center items-center">
                    <Link className="p-5 " href="/">Home</Link>
                    {session?.user.role == "admin" ?
                    <Link className="p-5" href="/AdminPage">Manage Users</Link>
                    : <></>}
                    {session?.user ?
                    <div className="">

                        <Link className="p-5" href="/Cart">Cart</Link>
                        <Link className="p-5" href="/TransactionHistory">Transaction History</Link>
                        <Link href="/EditProfile" className="p-5">
                            Edit Profile
                        </Link>
                        <button className="p-5 text-start" onClick={handleSignOut}>
                            Log Out
                        </button>
                    </div>

                    :
                    <div className="">
                        <Link href="/SignUp" className="p-5 ">
                            Register
                        </Link>
                        <Link href="/SignIn" className="p-5">
                            Log In
                        </Link>
                    </div>
                }
                </div>
            </div>

            <div className={`w-full md:hidden flex flex-col absolute transition-transform duration-300 ${hide ? "-translate-y-full" : "translate-y-0"}`} onClick={() => setHide(true)}>
                <Link className="p-5 bg-darkNavy" href="/">Home</Link>
                {session?.user.role == "admin" ?
                    <Link className="p-5 bg-darkNavy" href="/AdminPage">Manage Users</Link>
                    : <></>}
                {session?.user ?
                    <div className="w-full flex flex-col">

                        <Link className="p-5 bg-darkNavy" href="/Cart">Cart</Link>
                        <Link className="p-5 bg-darkNavy" href="/TransactionHistory">Transaction History</Link>
                        <Link href="/EditProfile" className="p-5 bg-darkNavy">
                            Edit Profile
                        </Link>
                        <button className="p-5 bg-darkNavy text-start" onClick={handleSignOut}>
                            Sign Out
                        </button>
                    </div>

                    :
                    <div className="flex flex-col">
                        <Link href="/SignUp" className="p-5 bg-darkNavy">
                            Sign up
                        </Link>
                        <Link href="/SignIn" className="p-5 bg-darkNavy">
                            Sign in
                        </Link>
                    </div>
                }
            </div>

        </div>

    )
}