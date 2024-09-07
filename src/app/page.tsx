'use client'
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loading } from "@/components/Loading";

export default function Home() {
    const router = useRouter()
    useEffect(() => {
        router.replace('/skins')
    }, [router]);
    return (
        <main>
            <Loading />
        </main>
    )
}