'use client'
import { hashPassword } from "@/utils/bcrypt";
import { useEffect } from "react";

export default function ClientApplication({ children }) {
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token')
            let response = await fetch('/api/checktokenvalidation', {
                method: 'POST',
                headers: {
                    'api-key': await hashPassword(process.env.NEXT_PUBLIC_API_KEY!)
                },
                body: JSON.stringify({ user_token: token })
            })
            let data = await response.json();
            if (data.expired) {
                localStorage.removeItem('token');
            }
        }
        fetchData()
    }, []);
    return children;
}