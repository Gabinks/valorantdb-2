'use client'
import { useEffect, useState } from "react";
import { hashPassword } from "@/utils/bcrypt";
import { SkinCard } from "@/components/skinCard";
import { useRouter } from "next/navigation";
import { getSkinByName } from "../../../api/valorantSkins";
import { Loading } from "@/components/Loading";

export default function Page() {
    const [likedSkins, setLikedSkins] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter();
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token')
            if (!token) {
                router.push('/login')
                return;
            }
            let apiKey = await hashPassword(process.env.NEXT_PUBLIC_API_KEY!)
            const response = await fetch(`/api/getuserlikes?token=${token}&apiKey=${apiKey}`, {
                method: 'GET',
                headers: { 'api-key': await hashPassword(process.env.NEXT_PUBLIC_API_KEY!) }
            })
            const data = await response.json();
            if (data.success) {
                const fetchedSkins = await Promise.all(data.skinsLiked.map((skinName: string) => getSkinByName(skinName)));

                setLikedSkins(fetchedSkins.flat());
            }
            setIsLoading(false);
        }
        fetchData()
    }, []);
    const clickHandler = () => {
        localStorage.removeItem('token');
        router.push('/skins')
    }
    if (isLoading) {
        return <Loading />
    }
    return (
        <div className="min-h-dvh max-h-fit bg-slate-800">
            <div className="flex flex-col gap-3 items-center py-3">
                <p className="text-2xl text-white">Favorite skins :</p>
                {likedSkins.length > 0 ? (
                    <div className="grid grid-cols-3 gap-3">
                        {likedSkins.map((value, index) => (
                            <SkinCard key={index} skinName={value.displayName} skinType=""
                                imgUrl={value.displayIcon}
                                cost={value.cost} />
                        ))}
                    </div>
                ) : (
                    <div className="">
                        <p className="text-white">No liked skins.</p>
                    </div>
                )}
            </div>
            <div className="flex justify-center items-center">
                <button className="p-1.5 rounded-lg bg-red-500 text-white" onClick={clickHandler}>Logout</button>
            </div>
        </div >
    )
}
