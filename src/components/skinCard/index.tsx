import Image from "next/image";
import React, { Suspense, useEffect, useState } from "react";
import PriceCard from "@/components/priceCard";
import Link from "next/link";
import { hashPassword } from "@/utils/bcrypt";

interface SkinCard {
    skinName: string
    skinType: string
    imgUrl: string
    cost: number
}

export function SkinCard({ skinName, skinType, imgUrl, cost }: SkinCard) {
    const [isLoading, setIsLoading] = useState(true)
    const [skinsLiked, setSkinsLiked] = useState([])
    const [visible, setVisible] = useState(false)
    const [message, setMessage] = useState("")
    useEffect(() => {
        const fetchData = async () => {
            let token = localStorage.getItem('token');
            if (!token) {
                return;
            }
            const response = await fetch('/api/getuserlikes?token=' + token, {
                method: 'GET'
            })
            const data = await response.json();
            if (data.success) {
                setSkinsLiked(data.skinsLiked)
            }
        }
        fetchData()
        setIsLoading(false)
    }, [message]);
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
    const handleClick = async (event) => {
        setIsLoading(true)
        const skin = event.target.ariaLabel;
        const token = localStorage.getItem('token');
        if (event.target.src.includes('no-liked-heart')) {
            const response = await fetch('/api/userremovelike', {
                method: 'POST',
                body: JSON.stringify({ token: token, skinName: skin }),
                headers: {
                    'api-key': await hashPassword(process.env.NEXT_PUBLIC_API_KEY!)
                }
            })
            const data = await response.json();
            if (data.success) {
                setMessage(data.message);
                setVisible(true)
                setTimeout(() => {
                    setVisible(false)
                }, 2000)
            }
        } else if (event.target.src.includes('liked-heart')) {
            const response = await fetch('/api/useraddlike', {
                method: 'POST',
                body: JSON.stringify({ token: token, skinName: skin }),
                headers: {
                    'api-key': await hashPassword(process.env.NEXT_PUBLIC_API_KEY!)
                }
            })
            const data = await response.json();
            if (data.success) {
                setMessage(data.message);
                setVisible(true)
                setTimeout(() => {
                    setVisible(false)
                }, 2000)
            }
        } else {
            return;
        }
    }
    if (!isLoading) {
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
                <div className="cursor-pointer" onClick={handleClick}>
                    {skinsLiked.includes(skinName.trim()) ? (
                        <Image aria-label={skinName.trim()} onMouseEnter={handleHover} onMouseLeave={handleHover}
                            src="../images/liked-heart.svg" alt="unlike" height="100" width="0"
                            className="h-[40px] w-auto absolute top-0 right-0 m-3" />
                    ) : (
                        <Image aria-label={skinName.trim()} onMouseEnter={handleHover} onMouseLeave={handleHover}
                            src="../images/no-liked-heart.svg" alt="like" height="100" width="0"
                            className="h-[40px] w-auto absolute top-0 right-0 m-3" />
                    )}
                </div>
                <div className={`${visible ? 'flex' : 'hidden'} absolute top-0 left-1/2 transform -translate-x-1/2`}>
                    <p className="text-sm text-blue-500 bg-slate-800 p-0.5 m-1 rounded-lg opacity-85">{message}</p>
                </div>
            </div>
        )

    }
}