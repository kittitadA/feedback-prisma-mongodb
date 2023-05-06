import { useEffect, useState } from "react"
import { connect } from "react-redux"
import { useRouter } from "next/router"
import { useForm, FieldValues, SubmitHandler } from "react-hook-form"
import { ImPencil } from "react-icons/im"
import { HiOutlineChevronLeft } from "react-icons/hi"
import toast from "react-hot-toast"

import classes from "./create.module.css"
import Button from "@/components/Button"
import FormCreateBlog from "@/components/blog/FormCreateBlog"

import { createBlog } from "@/actions/blog_action"
import { openModalLogin } from "@/actions/user_action"

interface createProps {
    createBlog: (value: any) => any
    openModalLogin: (value: any) => any
    user: any
    category: any
    auth: boolean
}

const Create: React.FC<createProps> = ({
    createBlog,
    openModalLogin,
    category,
    user,
    auth,
}) => {
    const router = useRouter()
    const {
        register,
        handleSubmit,
        watch,
        reset,
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
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (category.loaded && category.data.length > 0) {
            setCategorySelect(category.data[0].id)
        }
    }, [category.loaded])

    const postBlogHandler: SubmitHandler<FieldValues> = (data) => {
        if (!auth) {
            openModalLogin(true)
        } else if (!isLoading) {
            setIsLoading(true)
            createBlog({
                title: data.title,
                description: data.description,
                category: categorySelect,
                roadmap_id: null,
                user_id: user?.user_id,
            })
                .then((res: any) => {
                    reset()
                    router.push("/")
                    toast.success("Create feedback success")
                })
                .catch((err: any) => {
                    toast.error("Something went wrong")
                })
                .finally(() => {
                    setIsLoading(false)
                })
        }
    }

    return (
        <div className="mx-auto max-w-xl px-4 py-12 text-neutral-700">
            <Button
                label="Back"
                icon={HiOutlineChevronLeft}
                onClick={() => router.back()}
                color="bg-slate-100"
                textColor="text-neutral-800"
                colorIcon="#262626"
            />
            <div className="relative rounded-lg bg-white p-4 shadow-sm mt-[48px]">
                <div
                    className={`
                        absolute rounded-full w-[48px] h-[48px] left-[24px] top-[-24px] shadow
                        flex justify-center items-center ${classes.gradient_box_home}
                    `}
                >
                    <ImPencil
                        size={18}
                        color="#fff"
                    />
                </div>
                <h2 className="text-lg font-bold mt-6">Create your Feedback</h2>
                <p className="text-sm text-neutral-400">
                    Give your feedback and detail for developer
                </p>

                <FormCreateBlog
                    title={title}
                    description={description}
                    categorySelect={categorySelect}
                    register={register}
                    errors={errors}
                    isLoading={isLoading}
                    setCategorySelect={(value: any) => setCategorySelect(value)}
                />

                <div className="flex flex-row flex-wrap justify-end items-center gap-3 mt-8">
                    <Button
                        label="Cancel"
                        onClick={() => router.push("/")}
                        color="bg-slate-100"
                        textColor="text-neutral-800"
                        className="w-full sm:w-auto"
                        disabled={isLoading}
                    />
                    <Button
                        label="Submit"
                        onClick={handleSubmit(postBlogHandler)}
                        className="w-full sm:w-auto"
                        disabled={!category.loaded}
                        loading={isLoading}
                    />
                </div>
            </div>
        </div>
    )
}

function mapStateToProps(state: any) {
    return {
        user: state.user.user,
        auth: state.user.auth,
        category: state.blog.category,
    }
}

export default connect(mapStateToProps, {
    createBlog,
    openModalLogin,
})(Create)
