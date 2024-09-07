'use client'
import React, { Suspense, useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Filter from "@/components/Filter";
import { SkinCard } from "@/components/skinCard";
import { Loading } from "@/components/Loading";
import { hashPassword } from "@/utils/bcrypt";
import ClientApplication from "@/components/ClientApplication";

async function getData({ page = 1, filter = '', sort = 'asc', search = '' }) {
    let apiKey = await hashPassword(process.env.NEXT_PUBLIC_API_KEY!)
    const response = await fetch(`/api/getskinsandweapon?page=${page}&filter=${filter}&sort=${sort}&search=${search}&apiKey=${apiKey}`);
    const data = await response.json()
    return { ...data };
}

export default function Skins() {
    const router = useRouter();
    const pathName = usePathname();
    const searchParams = useSearchParams();
    const page = searchParams?.get('page');
    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams?.toString())
            params.set(name, value)

            return params.toString()
        },
        [searchParams]
    )
    const [skins, setSkins] = useState({});
    const [weapon, setWeapon] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const params = useSearchParams();
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            let page = parseInt(params.get('page')!) || 1;
            let filter = params.get('filter')! || '';
            let sort = params.get('sort')! || 'asc';
            let search = params.get('search')! || '';
            const data = await getData({ filter: filter, page: page, sort: sort, search: search })
            setSkins(data.skins)
            setWeapon(data.weapon)
            setIsLoading(false)
        }
        fetchData()
    }, [params])
    useEffect(() => {
        if (parseInt(page!) > skins.maxPage) {
            router.push(pathName + '?' + createQueryString('page', '1'))
        }
    }, [page, createQueryString, pathName, router, skins.maxPage]);

    function paginationHandler(e) {
        if (e.target.id === 'back') {
            if (parseInt(skins.actualPage) - 1 >= 1) {
                router.replace(pathName + '?' + createQueryString('page', (parseInt(skins.actualPage) - 1).toString()))
            } else {
                router.replace(pathName + '?' + createQueryString('page', (parseInt(skins.maxPage)).toString()))
            }
        } else if (e.target.id === 'next') {
            if (parseInt(skins.actualPage) + 1 <= parseInt(skins.maxPage)) {
                router.replace(pathName + '?' + createQueryString('page', (parseInt(skins.actualPage) + 1).toString()))
            } else {
                router.replace(pathName + '?' + createQueryString('page', '1'))
            }
        } else {
            return;
        }
    }
    if (isLoading) {
        const loadingFilter = (
            <div className="flex flex-col items-center gap-2 p-5">
                <div className="flex flex-col gap-2">
                    <div className="w-20 h-4 bg-gray-400 animate-pulse"></div>
                    <div className="w-32 h-7 bg-gray-400 animate-pulse rounded-md"></div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="w-20 h-4 bg-gray-400 animate-pulse"></div>
                    <div className="w-32 h-7 bg-gray-400 animate-pulse rounded-md"></div>
                </div>
                <div className="w-56 h-10 bg-gray-400 animate-pulse rounded-md"></div>
                <div className="w-32 h-7 bg-gray-400 animate-pulse rounded-md"></div>
            </div>
        )
        const loadingCards = Array.from({ length: 9 }, (_, index) => (
            <div key={index} className="bg-gray-500 rounded-xl animate-pulse flex flex-col justify-center items-center gap-5 p-3">
                <div className="bg-gray-400 w-36 h-6"></div>
                <div className="bg-gray-400 w-64 h-44"></div>
                <div className="flex gap-3">
                    <div className="bg-gray-400 w-5 h-6"></div>
                    <div className="bg-gray-400 w-20 h-6"></div>
                </div>
                <div className="bg-gray-400 w-20 h-6"></div>
            </div>
        ))
        return (
            <React.Fragment>
                <title>Home</title>
                <main className="bg-slate-800 min-h-dvh max-h-fit flex flex-col justify-center items-center">
                    {loadingFilter}
                    <div className="grid grid-cols-3 mobile:grid-cols-1 gap-10">
                        {loadingCards}
                    </div>
                </main>
            </React.Fragment>
        )
    }
    return (
        <>
            <title>Home</title>
            <main className="bg-slate-800 flex flex-col justify-center items-center gap-5 min-h-dvh max-h-fit py-5">
                <Filter weapons={weapon} />
                <div className="grid grid-cols-3 mobile:grid-cols-1 gap-10">
                    {skins.data.map((value: object, index: number) => (
                        <SkinCard key={index} skinName={value.name} skinType={value.skinType}
                            imgUrl={value.skinImgUrl} cost={value.cost} />
                    ))}
                </div>
                <div className="flex justify-between items-center w-2/5 text-sky-400 text-2xl">
                    <button id="back" onClick={paginationHandler}
                        className="bg-sky-700 px-2 rounded-lg">{"🡠"}</button>
                    <p className="text-lg">{skins.actualPage}/{skins.maxPage}</p>
                    <button id="next" onClick={paginationHandler}
                        className="bg-sky-700 px-2 rounded-lg">{"🡢"}</button>
                </div>
            </main>
        </>
    );
}