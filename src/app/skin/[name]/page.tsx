'use client'
import { useRouter } from "next/navigation";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { SkinCard } from "@/components/skinCard";
import { Loading } from "@/components/Loading";
import { hashPassword } from "@/utils/bcrypt";

export default function Skin({ params }: { params: { name: string } }) {
    const router = useRouter();
    const [skin, setSkin] = useState({});
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            const apiKey = await hashPassword(process.env.NEXT_PUBLIC_API_KEY!)
            const response = await fetch(`/api/getskinbyname?skinName=${params.name}&apiKey=${apiKey}`, {
                method: "GET"
            });
            const data = await response.json();
            setSkin(data.skin)
            setLoaded(data.loaded)
        }
        fetchData()
    }, [params]);
    if (loaded && skin) {
        return (
            <>
                <title>{skin.displayName}</title>
                <div
                    className="min-h-dvh max-h-fit bg-slate-800 text-white flex flex-col justify-start items-center gap-10">
                    <button type="button"
                        onClick={() => router.back()}
                        className="my-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 focus:outline-none">Go
                        back
                    </button>
                    <SkinCard skinName={skin.displayName} skinType="" imgUrl={skin.displayIcon} cost={skin.cost} />
                    {skin.chromas.slice(1, skin.length).map((value, index) => (
                        <div key={index} className="flex flex-col justify-center items-center gap-5">
                            <p className="text-xl">{value.displayName}</p>
                            <Image alt={value.displayName} src={value.displayIcon} priority width="200" height="0"
                                className="h-20 w-auto" />
                            {value.streamedVideo && (
                                <div className={`flex flex-col items-center gap-3 bg-slate-700 p-3 rounded-xl`}
                                    style={{ backgroundImage: `url('${skin.wallpaper}')` }}>
                                    <video src={value.streamedVideo} controls muted className="w-[40vw]" />
                                    <Image src={value.swatch} alt="" width="100" height="0"
                                        className="h-10 w-auto"></Image>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </>
        )
    } else {
        return <Loading />
    }
}