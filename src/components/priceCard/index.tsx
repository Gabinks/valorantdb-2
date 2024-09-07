import Image from "next/image";
interface PriceCard{
    price: number
}
export default function PriceCard({price}: PriceCard) {
    return (
        <div className="flex justify-center items-center gap-2">
            <Image alt="valorant-points"
                   src="https://static.wikia.nocookie.net/valorant/images/9/9d/Valorant_Points.png/revision/latest/"
                   width="100"
                   height="0"
                   className="w-6 h-auto"/>
            <p>{price}</p>
        </div>
    )
}