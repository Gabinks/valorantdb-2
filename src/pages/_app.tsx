import {AppProps} from "next/app";
import {useEffect, useState} from "react";
import {Router} from "next/router";
import {Loading} from "@/components/Loading";
import Layout from "@/pages/layout";

export default function MyApp({Component, pageProps}: AppProps) {
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        const start = () => {
            setLoading(true);
        };
        const end = () => {
            setLoading(false);
        }
        Router.events.on("routeChangeStart", start)
        Router.events.on("routeChangeComplete", end)
        Router.events.on("routeChangeError", end)
        return () => {
            Router.events.off("routeChangeStart", start);
            Router.events.off("routeChangeComplete", end);
            Router.events.off("routeChangeError", end);
        }
    }, []);
    return (
        <>
            {loading ? (
                <Layout>
                    <Loading/>
                </Layout>
            ) : (
                <Component {...pageProps} />
            )}
        </>
    )
}