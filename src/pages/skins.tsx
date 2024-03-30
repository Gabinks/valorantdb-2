'use client'
import valorantSkins from "../../api/valorantSkins";
import React, {Suspense, useCallback, useEffect} from "react";
import Layout from "./layout";
import {SkinCard} from "@/components/skinCard";
import Filter from "@/components/Filter";
import getWeapon from "../../api/valorantWeapons";
import {usePathname, useRouter, useSearchParams} from "next/navigation";

export default function Skins({skins, weapon}) {
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
    useEffect(() => {
        if (parseInt(page!) > skins.maxPage){
            router.push(pathName + '?' + createQueryString('page', '1'))
        }
    }, [page]);
    function paginationHandler(e) {
        if (e.target.id === 'back') {
            if (parseInt(skins.actualPage) - 1 >= 1) {
                router.replace(pathName + '?' + createQueryString('page', (parseInt(skins.actualPage) - 1).toString()))
            }
            else{
                router.replace(pathName + '?' + createQueryString('page', (parseInt(skins.maxPage)).toString()))
            }
        } else if (e.target.id === 'next') {
            if (parseInt(skins.actualPage) + 1 <= parseInt(skins.maxPage)) {
                router.replace(pathName + '?' + createQueryString('page', (parseInt(skins.actualPage) + 1).toString()))
            }
            else{
                router.replace(pathName + '?' + createQueryString('page', '1'))
            }
        } else {
            return;
        }
    }
    return (
        <Layout>
            <Suspense fallback={<p>Loading...</p>}>
                <main className="bg-slate-800 flex flex-col justify-center items-center gap-5 min-h-dvh max-h-fit py-5">
                    <Filter weapons={weapon}/>
                    <div className="grid grid-cols-3 mobile:grid-cols-1 gap-10">
                        {skins.data.map((value: object, index: number) => (
                            <SkinCard key={index} skinName={value.name} skinType={value.skinType}
                                      imgUrl={value.skinImgUrl} cost={value.cost}/>
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
            </Suspense>
        </Layout>
    );
}

export async function getServerSideProps({ query: { page = 1, filter = '', sort = 'asc', search = '' } }) {
    const skinsPromise = valorantSkins({ page, filter, sort, search });
    const weaponPromise = getWeapon();

    const [skins, weapon] = await Promise.all([skinsPromise, weaponPromise]);

    return {
        props: { skins, weapon },
    };
}