import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { connect } from "react-redux"
import toast from "react-hot-toast"
import Image from "next/image"
import Link from "next/link"

import { TiLightbulb } from "react-icons/ti"
import { TbPlus } from "react-icons/tb"
import classes from "./index.module.css"
import Button from "@/components/Button"
import Select from "@/components/Select"
import BlogList from "@/components/blog/BlogList"
import CategoryBlog from "@/components/blog/CategoryBlog"
import RoadmapCountBlog from "@/components/blog/RoadmapCountBlog"

import { getBlog, changeCategoryOrSort } from "@/actions/blog_action"

interface homeProps {
    getBlog: (value: any) => any
    changeCategoryOrSort: (value: any) => any
    blog_page: any
    category: any
}

const Home: React.FC<homeProps> = ({
    getBlog,
    changeCategoryOrSort,
    blog_page,
    category,
}) => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingSort, setIsLoadingSort] = useState(false)

    function loadBlog(sort: string) {
        if (!isLoading) {
            setIsLoading(true)
            getBlog({
                sort: sort,
            })
                .then((res: any) => {
                    setIsLoading(false)
                })
                .catch((err: any) => {
                    toast.error("Something went wrong")
                })
        }
    }

    useEffect(() => {
        if (!blog_page.loaded) {
            loadBlog(blog_page.sort)
        }
    }, [])

    function sortHandler(sort: string) {
        if (!isLoadingSort && !isLoading) {
            setIsLoadingSort(true)
            changeCategoryOrSort({
                sort: sort,
                category: blog_page.mode_category,
            })
                .catch((err: any) => {
                    toast.error("Sort error")
                })
                .finally(() => {
                    setIsLoadingSort(false)
                })
        }
    }

    function changeCategoryHandler(data: any) {
        if (
            !isLoading &&
            !isLoadingSort &&
            data.id !== blog_page.mode_category.id
        ) {
            setIsLoading(true)
            changeCategoryOrSort({
                sort: blog_page.sort,
                category: data,
            })
                .catch((err: any) => {
                    toast.error("Change category error")
                })
                .finally(() => {
                    setIsLoading(false)
                })
        }
    }

    return (
        <div className="grid grid-cols-12 gap-4 px-4 py-8">
            <div className="col-span-12 md:col-span-3">
                <div className="flex flex-col gap-3">
                    <div
                        className={`${classes.gradient_box_home} rounded-lg p-4 pt-20 shadow-sm text-white`}
                    >
                        <p className="font-semibold">Frontend mentor</p>
                        <p className="text-sm">Feedback board</p>
                    </div>

                    <CategoryBlog
                        changeCategoryHandler={changeCategoryHandler}
                    />

                    <RoadmapCountBlog />
                </div>
            </div>
            <div className="col-span-12 md:col-span-9">
                <div className="flex flex-row items-center justify-between gap-2 rounded-lg bg-violet-950 p-3 shadow-sm">
                    <div className="flex-1 flex flex-row items-center text-white gap-2 overflow-hidden">
                        <div className="hidden sm:block">
                            <TiLightbulb size={18} />
                        </div>
                        <div className="hidden sm:block mr-5">
                            <p className="text-lg font-semibold">
                                {blog_page.data?.length ?? "-"} Suggestion
                            </p>
                        </div>
                        <p className="text-sm whitespace-nowrap">Sort by : </p>

                        <Select
                            id="sort"
                            value={blog_page.sort}
                            className="text-sm w-full max-w-[150px]"
                            disabled={isLoading || !category.loaded}
                            loading={isLoadingSort}
                            onChange={(e) => sortHandler(e.target.value)}
                        >
                            <option value="vote">Most upvote</option>
                            <option value="recen">Recent</option>
                        </Select>
                    </div>
                    <Link href="/create">
                        <Button
                            label="Add"
                            icon={TbPlus}
                            onClick={() => {}}
                        />
                    </Link>
                </div>
                <div className="flex flex-col gap-3 mt-5">
                    {blog_page.loaded &&
                        blog_page.data.length > 0 &&
                        !isLoadingSort &&
                        !isLoading && (
                            <>
                                {blog_page.data.map(
                                    (data: any, index: number) => (
                                        <BlogList
                                            data={data}
                                            key={`blog_list_${index}`}
                                            onClick={() =>
                                                router.push(`/blog/${data.id}`)
                                            }
                                        />
                                    )
                                )}
                            </>
                        )}

                    {blog_page.loaded &&
                        !isLoading &&
                        !isLoadingSort &&
                        blog_page.data.length === 0 && (
                            <div className="pt-40 animation-fadeIn">
                                <Image
                                    src="/no-item.png"
                                    alt="no-item"
                                    width={150}
                                    height={150}
                                    className="mx-auto"
                                />
                                <p className="text-3xl font-bold text-neutral-700 text-center mt-5">
                                    No feedback
                                </p>
                            </div>
                        )}

                    {(!blog_page.loaded || isLoadingSort || isLoading) && (
                        <>
                            {Array(5)
                                .fill(null)
                                .map((data, index) => (
                                    <LoaderBlog key={`loading_blog_${index}`} />
                                ))}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export const LoaderBlog = () => {
    return (
        <div className="rounded-lg p-6 bg-slate-300 shadow-sm h-[25vh] animate-pulse"></div>
    )
}

function mapStateToProps(state: any) {
    return {
        blog_page: state.blog.blog_page,
        category: state.blog.category,
    }
}

export default connect(mapStateToProps, { getBlog, changeCategoryOrSort })(Home)
