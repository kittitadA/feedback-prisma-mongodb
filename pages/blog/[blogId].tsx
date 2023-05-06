import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { connect } from "react-redux"
import Image from "next/image"
import Head from "next/head"
import toast from "react-hot-toast"

import { HiOutlineChevronLeft } from "react-icons/hi"
import { BiCheck, BiEdit } from "react-icons/bi"
import { MdDelete } from "react-icons/md"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"

import { LoaderBlog } from "../index"
import { LoadingCommentBox } from "@/components/comment/CommentBox"
import { PRIVILEGE } from "@/components/utility"
import BlogList from "@/components/blog/BlogList"
import Button from "@/components/Button"
import CommentBox from "@/components/comment/CommentBox"
import EditBlog from "@/components/blog/EditBlog"

import {
    getSpecifyBlog,
    deleteBlog,
    getCommentForBlog,
    updateBlog,
} from "@/actions/blog_action"

interface blogProps {
    blog: any
    user: any
    getSpecifyBlog: (value: any) => any
    deleteBlog: (value: any) => any
    getCommentForBlog: (value: any) => any
    updateBlog: (value: any) => any
}

const BlogPage: React.FC<blogProps> = ({
    blog,
    user,
    getSpecifyBlog,
    deleteBlog,
    getCommentForBlog,
    updateBlog,
}) => {
    const router = useRouter()

    const {
        register,
        handleSubmit,
        watch,
        reset,
        setValue,
        formState: { errors },
    } = useForm<FieldValues>({
        defaultValues: {
            title: "",
            description: "",
        },
    })
    const title = watch("title")
    const description = watch("description")
    const [categorySelect, setCategorySelect] = useState("")
    const [roadmapSelect, setRoadmapSelect] = useState("")
    const [isLoadingEdit, setisLoadingEdit] = useState(false)

    const [isEdit, setIsEdit] = useState(false)
    const [indexData, setIndexData] = useState<any>(null)
    const [isLoadingDelete, setIsLoadingDelete] = useState(false)
    const [isError, setIsError] = useState(false)

    function loadBlog(blog_id: string) {
        if (!isLoadingDelete) {
            setIsLoadingDelete(true)
            getSpecifyBlog({
                blog_id: blog_id,
            })
                .then((res: any) => {
                    setIndexData(0)
                })
                .catch((err: any) => {
                    setIsError(true)
                    toast.error("Something went wrong")
                })
                .finally(() => {
                    setIsLoadingDelete(false)
                })
        }
    }

    function checkDefaultData() {
        if (router?.query?.blogId) {
            let index = blog.data.findIndex(
                (item: any) => item.id === router.query.blogId
            )
            if (index > -1) {
                if (
                    blog.data[index].comment.length > 0 &&
                    !blog.data[index].comment[0].hasOwnProperty("reply")
                ) {
                    if (!isLoadingDelete) {
                        setIsLoadingDelete(true)
                        getCommentForBlog({
                            blog_id: router.query.blogId,
                            index_blog: index,
                        })
                            .then((res: any) => {
                                setIndexData(index)
                            })
                            .catch((err: any) => {
                                toast.error("Something went wrong")
                            })
                            .finally(() => {
                                setIsLoadingDelete(false)
                            })
                    }
                } else {
                    setIndexData(index)
                }
            } else {
                loadBlog(router?.query?.blogId?.toString() ?? "")
            }
        }
    }

    useEffect(() => {
        checkDefaultData()
    }, [router])

    useEffect(() => {
        if (indexData !== null && blog.data?.[indexData]) {
            let { title, description, category, roadmap } = blog.data[indexData]
            setValue("title", title)
            setValue("description", description)
            setCategorySelect(category.id)
            setRoadmapSelect(roadmap.id)
        }
    }, [indexData])

    function deleteBlogHandler() {
        if (router?.query?.blogId && !isLoadingDelete) {
            setIsLoadingDelete(true)
            deleteBlog({ blog_id: router.query.blogId })
                .then((res: any) => {
                    setIndexData(null)
                    toast.success("Delete success")
                    router.back()
                })
                .catch((err: any) => {
                    toast.error("Something went wrong")
                })
                .finally(() => {
                    setIsLoadingDelete(false)
                })
        }
    }

    const EditHandler: SubmitHandler<FieldValues> = async (data: any) => {
        if (!isLoadingDelete) {
            setisLoadingEdit(true)
            updateBlog({
                blog_id: blog.data?.[indexData]?.id,
                title: data.title,
                description: data.description,
                category_id: categorySelect,
                roadmap_id: roadmapSelect,
                old_roadmap_id: blog.data?.[indexData]?.roadmap?.id,
            })
                .then((res: any) => {
                    toast.success("Edit success")
                    setIsEdit(false)
                })
                .catch((err: any) => {
                    toast.error("Something went wrong")
                })
                .finally(() => {
                    setisLoadingEdit(false)
                })
        }
    }

    return (
        <>
            {indexData !== null && blog.data[indexData] && (
                <Head>
                    <title>{blog.data?.[indexData]?.title ?? "Feedback"}</title>
                </Head>
            )}
            <div className="px-4 py-12 text-neutral-700 mx-auto max-w-3xl">
                <div className="flex flex-row justify-between mb-5">
                    <Button
                        label="Back"
                        icon={HiOutlineChevronLeft}
                        onClick={() => router.back()}
                        color="bg-slate-100"
                        textColor="text-neutral-800"
                        colorIcon="#262626"
                        disabled={isLoadingDelete || isLoadingEdit}
                    />
                    {((indexData !== null &&
                        blog.data[indexData] &&
                        blog.data[indexData].user.profile.user_id ===
                            user?.user_id) ||
                        user?.privilege === PRIVILEGE.DEVELOPER) && (
                        <>
                            {isEdit ? (
                                <div className="flex flex-row gap-2">
                                    <Button
                                        icon={BiCheck}
                                        label="Save"
                                        color="bg-green-500"
                                        onClick={handleSubmit(EditHandler)}
                                        loading={isLoadingEdit}
                                    />
                                    <Button
                                        label="Cancel"
                                        onClick={() => setIsEdit(false)}
                                        color="bg-slate-100"
                                        textColor="text-neutral-800"
                                        disabled={isLoadingEdit}
                                    />
                                </div>
                            ) : (
                                <div className="flex flex-row gap-2">
                                    <Button
                                        icon={BiEdit}
                                        label="Edit"
                                        onClick={() => setIsEdit(true)}
                                        disabled={isLoadingDelete}
                                    />
                                    <Button
                                        icon={MdDelete}
                                        label="Delete"
                                        color="bg-rose-500"
                                        onClick={deleteBlogHandler}
                                        loading={isLoadingDelete}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>

                {!isEdit && indexData !== null && blog.data[indexData] && (
                    <>
                        <BlogList
                            disable
                            data={blog.data[indexData]}
                        />
                        <div className="mt-4">
                            <CommentBox
                                blog_id={blog.data[indexData]?.id}
                                comment={blog.data[indexData]?.comment}
                            />
                        </div>
                    </>
                )}

                {isEdit && (
                    <EditBlog
                        title={title}
                        description={description}
                        categorySelect={categorySelect}
                        roadmapSelect={roadmapSelect}
                        register={register}
                        errors={errors}
                        isLoading={isLoadingEdit}
                        setCategorySelect={(value: any) =>
                            setCategorySelect(value)
                        }
                        setRoadmapSelect={(value: any) =>
                            setRoadmapSelect(value)
                        }
                    />
                )}

                {indexData === null && !isError && (
                    <>
                        <LoaderBlog />
                        <LoadingCommentBox />
                    </>
                )}

                {isError && (
                    <div className="py-40 animation-fadeIn">
                        <Image
                            src="/no-item.png"
                            alt="no-item"
                            width={150}
                            height={150}
                            className="mx-auto"
                        />
                        <p className="text-3xl font-bold text-neutral-700 text-center mt-5">
                            Feedback not found!
                        </p>
                    </div>
                )}
            </div>
        </>
    )
}

function mapStateToProps(state: any) {
    return {
        blog: state.blog.blog_page,
        user: state.user.user,
    }
}

export default connect(mapStateToProps, {
    getSpecifyBlog,
    deleteBlog,
    getCommentForBlog,
    updateBlog,
})(BlogPage)
