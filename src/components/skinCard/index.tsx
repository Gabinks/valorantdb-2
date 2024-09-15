import Image from "next/image";
import React, {Suspense} from "react";
import PriceCard from "@/components/priceCard";
import Link from "next/link";

interface SkinCard {
    skinName: string
    skinType: string
    imgUrl: string
    cost: number
}

export function SkinCard({ skinName, skinType, imgUrl, cost }: SkinCard) {
    return (
        <div className="relative">
            <Link href={`/skin/${skinName}`}>
                <div
                    className="relative mobile:w-52 flex flex-col justify-center items-center gap-5 bg-slate-600 text-white p-3 rounded-lg group hover:bg-slate-700 transition-colors cursor-pointer">
                    <p className="text-lg font-medium text-sky-600 w-2/3 text-center">{skinName}</p>
                    <Suspense fallback={<p>Loading...</p>}>
                        <Image src={imgUrl} alt={skinName} height="0" width="200"
                               className="max-h-[100px] mobile:max-h-[70px] w-auto group-hover:scale-[.85] transition-transform"
                               priority />
                    </Suspense>
                    <PriceCard price={cost} />
                    <p className="text-sm font-thin">{skinType.replace("Tactical_Knife", "Melee")}</p>
                </div>
            </Link>
        </div>
    )

}