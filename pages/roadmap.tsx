import { useEffect, useState } from "react"
import { connect } from "react-redux"
import { useRouter } from "next/router"
import Head from "next/head"

import { HiOutlineChevronLeft } from "react-icons/hi"

import Button from "@/components/Button"
import BlogList from "@/components/blog/BlogList"

import { getRoadmapBlog } from "@/actions/blog_action"

interface roadmapProps {
    roadmap: any
    getRoadmapBlog: () => any
}

const Roadmap: React.FC<roadmapProps> = ({ roadmap, getRoadmapBlog }) => {
    const router = useRouter()
    const [activeRoadmap, setactiveRoadmap] = useState("")
    const showLoading =
        !roadmap.loaded ||
        (roadmap.data.length > 0 && !roadmap.data[0].hasOwnProperty("blog"))

    function loadRoadmap() {
        if (roadmap.data.length > 0) {
            setactiveRoadmap(roadmap.data[0].id)
        }

        if (showLoading) {
            getRoadmapBlog().then((res: any) => {
                if (res.payload.data.data.length > 0) {
                    setactiveRoadmap(res.payload.data.data[0].id)
                }
            })
        }
    }

    useEffect(() => {
        loadRoadmap()
    }, [])

    return (
        <>
            <Head>
                <title>Roadmap</title>
            </Head>
            <div className="px-4 py-12 text-neutral-700 mx-auto max-w-5xl">
                <Button
                    label="Back"
                    icon={HiOutlineChevronLeft}
                    onClick={() => router.back()}
                    color="bg-slate-100"
                    textColor="text-neutral-800"
                    colorIcon="#262626"
                />

                {roadmap.loaded && roadmap.data.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 mt-6 rounded-lg bg-violet-950 lg:bg-transparent">
                        {roadmap.data.map((data: any) => {
                            let active = data.id === activeRoadmap
                            return (
                                <div
                                    key={`tab_${data.id}`}
                                    className="h-full p-1 lg:p-0"
                                >
                                    <div
                                        onClick={() =>
                                            setactiveRoadmap(data.id)
                                        }
                                        className={`
                                            flex h-full lg:hidden justify-center items-center p-2 rounded-lg 
                                            cursor-pointer lg:cursor-default 
                                            ${
                                                active
                                                    ? "bg-white"
                                                    : "bg-transparent"
                                            }
                                        `}
                                    >
                                        <p
                                            className={`
                                                text-sm sm:text-base text-center font-semibold
                                                ${
                                                    active
                                                        ? "text-neutral-700"
                                                        : "text-white"
                                                }
                                            `}
                                        >
                                            {data.name}{" "}
                                            <span
                                                className={`font-normal ${
                                                    active
                                                        ? "text-neutral-400"
                                                        : "text-white"
                                                }`}
                                            >
                                                ({data._count.blog})
                                            </span>
                                        </p>
                                    </div>
                                    <div
                                        onClick={() =>
                                            setactiveRoadmap(data.id)
                                        }
                                        style={{ backgroundColor: data.color }}
                                        className={`
                                            hidden lg:flex justify-center items-center p-2 rounded-lg cursor-pointer
                                            md:cursor-default
                                        `}
                                    >
                                        <p
                                            className={`
                                            text-sm sm:text-base text-center font-semibold text-white
                                        `}
                                        >
                                            {data.name}{" "}
                                            <span
                                                className={`text-white font-normal`}
                                            >
                                                ({data._count.blog})
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}

                {roadmap.loaded &&
                roadmap.data.length > 0 &&
                roadmap.data[0].hasOwnProperty("blog") ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {roadmap.data.map((data: any) => {
                            let active = data.id === activeRoadmap
                            return (
                                <div
                                    key={`roadmap_container_${data.id}`}
                                    className={`${
                                        active ? "block" : "hidden"
                                    } lg:block`}
                                >
                                    {data.blog.length > 0 &&
                                        data.blog.map((item: any) => {
                                            return (
                                                <div
                                                    className="mt-3"
                                                    key={`blog_list_roadmap_${item.id}`}
                                                >
                                                    <BlogList
                                                        data={item}
                                                        onClick={() =>
                                                            router.push(
                                                                `/blog/${item.id}`
                                                            )
                                                        }
                                                    />
                                                </div>
                                            )
                                        })}

                                    {data.blog.length === 0 && (
                                        <div
                                            className="
                                                flex justify-center items-center rounded-lg p-6 shadow-sm 
                                                animation-fadeIn border-2 border-slate-400 border-dashed mt-3 
                                                h-[106px]
                                            "
                                        >
                                            <p className="text-slate-400 font-semibold">
                                                No item
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <LoaderRoadmap />
                )}
            </div>
        </>
    )
}

const LoaderRoadmap = () => {
    let loadingBox: any = []
    Array(3)
        .fill(null)
        .map((data: any, index: number) => {
            loadingBox.push(
                <div
                    className="rounded-lg h-[106px] bg-slate-300 shadow-sm animate-pulse mt-3"
                    key={`loader_map_${index}`}
                ></div>
            )
        })

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-3">
            <div className={`block lg:block`}>
                <div className="rounded-lg h-[40px] bg-slate-300 shadow-sm animate-pulse mt-3"></div>
                {loadingBox}
            </div>
            <div className={`hidden lg:block`}>
                <div className="rounded-lg h-[40px] bg-slate-300 shadow-sm animate-pulse mt-3"></div>
                {loadingBox}
            </div>
            <div className={`hidden lg:block`}>
                <div className="rounded-lg h-[40px] bg-slate-300 shadow-sm animate-pulse mt-3"></div>
                {loadingBox}
            </div>
        </div>
    )
}

function mapStateToProps(state: any) {
    return {
        roadmap: state.blog.roadmap,
    }
}

export default connect(mapStateToProps, { getRoadmapBlog })(Roadmap)
