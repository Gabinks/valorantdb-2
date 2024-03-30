import Layout from "./layout";
import Link from "next/link";

export default function Login(){
    return (
        <Layout>
            <main className="bg-slate-800 h-dvh flex justify-center items-center">
                <div className="flex flex-col items-center gap-10 bg-slate-700 p-12 rounded-lg mb-72">
                    <p className="text-white font-bold text-3xl">Login</p>
                    <form className="flex flex-col justify-center items-center gap-3">
                        <label htmlFor="username" className="text-white text-lg">Username</label>
                        <input type="text" name="username" className="text-center rounded-lg p-1"/>
                        <label htmlFor="password" className="text-white text-lg">Password</label>
                        <input type="password" name="password" className="text-center rounded-lg p-1"/>
                        <input type="submit" value="Login" className="bg-sky-700 text-white px-5 py-1 rounded-lg cursor-pointer"/>
                    </form>
                    <p className="text-white">Not registered ? Create an account <Link href="/register"><span
                        className="text-sky-400 underline underline-offset-4">here</span></Link></p>
                </div>
            </main>
        </Layout>
    )
}