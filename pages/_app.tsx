import "@/styles/globals.css"
import type { AppProps } from "next/app"
import { SessionProvider } from "next-auth/react"
import { Provider } from "react-redux"
import { applyMiddleware, createStore, compose } from "redux"
import { Toaster } from "react-hot-toast"
import Head from "next/head"
import ReduxPromise from "redux-promise"

import rootReducer from "../reducer"

import Navbar from "@/components/layout/Navbar"
import Layout from "@/components/layout/Layout"
import ClientOnly from "@/components/ClientOnly"

// import { Inter } from "next/font/google"
// const inter = Inter({ subsets: ["latin"] })

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose
    }
}

const composeWithDevTools =
    (typeof window !== "undefined" &&
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
    compose
const middlewareEnhancer = applyMiddleware(ReduxPromise)
const composedEnhancers = composeWithDevTools(middlewareEnhancer)
const store = createStore(rootReducer, composedEnhancers)

export default function App({
    Component,
    pageProps: { session, ...pageProps },
}: AppProps) {
    return (
        <>
            <Head>
                <title>Feedback</title>
                <meta
                    name="description"
                    content="Feedback application"
                />
                <link
                    rel="icon"
                    href="/feed_icon.png"
                />
            </Head>
            <SessionProvider session={session}>
                <Provider store={store}>
                    <ClientOnly>
                        <div className="bg-slate-200">
                            <Toaster />
                            <Navbar />
                            <Layout>
                                <Component {...pageProps} />
                            </Layout>
                        </div>
                    </ClientOnly>
                </Provider>
            </SessionProvider>
        </>
    )
}
