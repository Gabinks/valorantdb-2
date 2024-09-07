'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function Header() {
    const [logged, setLogged] = useState(false)
    const [loaded, setLoaded] = useState(false);
    const [token, setToken] = useState("");
    const path = usePathname()
    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            setLogged(true)
            setToken(token)
        }
        else {
            setLogged(false)
        }
        setLoaded(true)
    }, [path, token]);
    return (
        <header className="bg-slate-700 py-5 px-10 flex mobile:flex-col justify-between items-center mobile:gap-5">
            <Link href="/"><p className="text-3xl text-white">ValorantDB</p></Link>
            <ul className="text-lg flex mobile:flex-col gap-5 text-white">
                <li><Link href="/" className="hover:opacity-80">Home</Link></li>
                <li><Link href="/news" className="hover:opacity-80">News</Link></li>
                {!loaded ? (
                    <li className="animate-pulse">Loading...</li>
                ) : (
                    logged ? (
                        <li><Link href="/profile" className="hover:opacity-80">Profile</Link></li>

                    ) : (
                        <li><Link href="/login" className="hover:opacity-80">Login</Link></li>
                    )
                )}
            </ul>
        </header>
    )
}