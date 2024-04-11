import Image from "next/image";
import React, {Suspense, useState} from "react";
import PriceCard from "@/components/priceCard";
import Link from "next/link";

interface SkinCard {
    skinName: string
    skinType: string
    imgUrl: string
    cost: number
}

export function SkinCard({skinName, skinType, imgUrl, cost}: SkinCard) {
    const [isLoading, setIsLoading] = useState(true)
    const handleImageLoad = (e) => {
        setIsLoading(false)
    }
    const handleHover = (event) => {
        const liked = event.target.src.includes('images/liked')
        if (event.type === 'mouseenter') {
            if (liked) {
                event.target.src = '../images/no-liked-heart.svg'
            } else {
                event.target.src = '../images/liked-heart.svg'
            }
        } else if (event.type === 'mouseleave') {
            if (liked) {
                event.target.src = '../images/no-liked-heart.svg'
            } else {
                event.target.src = '../images/liked-heart.svg'
            }
        }
    }
    const handleClick = (event) => {
        console.log('test')
    }
    return (
        <Link href={`/skins/${skinName}`}>
            <div
                className="relative flex flex-col justify-center items-center gap-5 bg-slate-600 text-white p-3 rounded-lg group hover:bg-slate-700 transition-colors cursor-pointer">
                <p className="text-lg font-medium text-sky-600">{skinName}</p>
                <Suspense fallback={<p>Loading...</p>}>
                    <Image onLoad={handleImageLoad} src={imgUrl} alt={skinName} height="0" width="200"
                           className="max-h-[100px] mobile:max-h-[70px] w-auto group-hover:scale-[.85] transition-transform"
                           priority/>
                </Suspense>
                <PriceCard price={cost}/>
                <p className="text-sm font-thin">{skinType.replace("Tactical_Knife", "Melee")}</p>
                <div className="cursor-pointer" onClick={handleClick}>
                    <Image onMouseEnter={handleHover} onMouseLeave={handleHover}
                           src="../images/no-liked-heart.svg" alt="liked" height="100" width="0"
                           className="h-[40px] w-auto absolute top-0 right-0 m-3"/>
                </div>
            </div>
        </Link>
    )
}