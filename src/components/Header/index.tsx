import Link from "next/link";

export function Header(){
    return (
        <header className="bg-slate-700 py-5 px-10 flex justify-between items-center">
            <p className="text-3xl text-white">ValorantDB</p>
            <ul className="text-lg flex gap-5 text-white">
                <li><Link href="/" className="hover:opacity-80">Home</Link></li>
                <li><Link href="/news" className="hover:opacity-80">News</Link></li>
                <li><Link href="/login" className="hover:opacity-80">Login</Link></li>
            </ul>
        </header>
    )
}