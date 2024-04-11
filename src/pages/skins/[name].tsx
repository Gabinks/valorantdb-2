'use client'
import Layout from "@/pages/layout";
import {useRouter} from "next/router";
import Image from "next/image";
import {valueOf} from "autoprefixer";

export default function Skin({skin, loaded}) {
    const router = useRouter();
    if (loaded && skin && skin.length > 0) {
        console.log(skin)
        return (
            <Layout>
                <div className="min-h-dvh max-h-fit bg-slate-800 text-white flex flex-col justify-start items-center gap-10">
                    <p className="text-2xl">{skin[0].displayName}</p>
                    <Image alt={skin[0].displayName} src={skin[0].displayIcon} priority width="200" height="0"
                           className="h-20 w-auto"/>
                    {skin[0].chromas.slice(1, skin[0].length).map((value, index) => (
                        <div key={index} className="flex flex-col justify-center items-center gap-5">
                            <p className="text-xl">{value.displayName}</p>
                            <Image alt={value.displayName} src={value.displayIcon} priority width="200" height="0"
                                   className="h-20 w-auto"/>
                            {value.streamedVideo && (
                                <div className={`flex flex-col items-center gap-3 bg-slate-700 p-3 rounded-xl`}
                                     style={{backgroundImage: `url('${skin[0].wallpaper}')`}}>
                                    <video src={value.streamedVideo} controls muted className="w-[40vw]"/>
                                    <Image src={value.swatch} alt="" width="100" height="0" className="h-10 w-auto"></Image>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </Layout>
        )
    } else {
        return <p>Loading...</p>;
    }
}

export async function getServerSideProps({query}) {
    const skinName = query.name;
    const response = await fetch("http://localhost:3000/api/getskinbyname", {
        method: "POST",
        body: JSON.stringify({skinName: skinName})
    });
    const data = await response.json();
    return {
        props: {skin: data.skin, loaded: data.loaded}
    }
}