'use client';
import Link from "next/link";
import { useState } from "react";
import { hashPassword } from "@/utils/bcrypt";
import { useRouter } from "next/navigation";

export default function Login() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    })
    const [errors, setErrors] = useState({})
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" })
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'api-key': await hashPassword(process.env.NEXT_PUBLIC_API_KEY!)
                },
                body: JSON.stringify(formData)
            })
            const data = await response.json()
            if (data.success) {
                const { usertoken } = data;

                localStorage.setItem('token', usertoken);

                router.push('/')
            }
        } catch (error) {
            console.error("Erreur lors de l'envoi du formulaire :", error);
        }
    }
    return (
        <>
            <title>Login</title>
            <main className="bg-slate-800 h-dvh flex justify-center items-center">
                <div className="flex flex-col items-center gap-10 bg-slate-700 p-12 rounded-lg mb-72">
                    <p className="text-white font-bold text-3xl">Login</p>
                    <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center gap-3">
                        <label htmlFor="username" className="text-white text-lg">Username</label>
                        <input onChange={handleChange} value={formData.username} type="text" name="username" className="text-center rounded-lg p-1" />
                        <label htmlFor="password" className="text-white text-lg">Password</label>
                        <input onChange={handleChange} value={formData.password} type="password" name="password" className="text-center rounded-lg p-1" />
                        <input type="submit" value="Login"
                            className="bg-sky-700 text-white px-5 py-1 rounded-lg cursor-pointer" />
                    </form>
                    <p className="text-white">Not registered ? Create an account <Link href="/register"><span
                        className="text-sky-400 underline underline-offset-4">here</span></Link></p>
                </div>
            </main>
        </>
    )
}