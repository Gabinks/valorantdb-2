export function Header(){
    return (
        <header className="bg-slate-700 py-5 px-10 flex justify-between items-center">
            <p className="text-3xl text-white">ValorantDB</p>
            <ul className="text-lg flex gap-5 text-white">
                <li><a href="/" className="hover:opacity-80">Home</a></li>
                <li><a href="/news" className="hover:opacity-80">News</a></li>
                <li><a href="/login" className="hover:opacity-80">Login</a></li>
            </ul>
        </header>
    )
}