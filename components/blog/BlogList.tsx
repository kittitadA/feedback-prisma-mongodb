import { useState } from "react"
import { connect } from "react-redux"
import toast from "react-hot-toast"
import { Oval } from "react-loader-spinner"

import { IoIosArrowUp } from "react-icons/io"
import { HiChat } from "react-icons/hi"
import Tag from "../Tag"

import { voteBlog } from "@/actions/blog_action"
import { openModalLogin } from "@/actions/user_action"

interface blogListProps {
    onClick?: () => void
    voteBlog: (value: any) => any
    openModalLogin: (value: any) => any
    disable?: boolean
    auth: boolean
    data: any
    user: any
}

const BlogList: React.FC<blogListProps> = ({
    onClick,
    voteBlog,
    openModalLogin,
    disable = false,
    auth,
    data,
    user,
}) => {
    const [isLoading, setIsLoading] = useState(false)

    function likeBlogHandler(e: any) {
        e.preventDefault()
        e.stopPropagation()
        if (!auth) {
            openModalLogin(true)
        } else if (!isLoading) {
            setIsLoading(true)
            voteBlog({
                blog_id: data.id,
                user_id: user?.user_id,
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
        <div
            onClick={onClick}
            className={`
                rounded-lg p-6 bg-white shadow-sm animation-slideUp
                ${!disable ? "cursor-pointer" : ""}
            `}
        >
            <div className="flex flex-row flex-wrap gap-6">
                <div className="flex-1 sm:flex-initial order-2 sm:order-1 flex sm:block">
                    <div
                        onClick={likeBlogHandler}
                        className="
                            flex flex-row sm:flex-col items-center justify-center px-1.5 py-2 rounded-lg 
                            bg-indigo-50 corsor-pointer hover:opacity-75 cursor-pointer
                        "
                    >
                        <div className="px-1.5">
                            <IoIosArrowUp
                                size={18}
                                className="text-blue-600"
                            />
                        </div>
                        {isLoading && (
                            <Oval
                                height={16}
                                width={16}
                                color={"#1E3A8A"}
                                wrapperStyle={{}}
                                wrapperClass="!p-[5px]"
                                visible={true}
                                ariaLabel="oval-loading"
                                secondaryColor={"#1E3A8A"}
                                strokeWidth={5}
                                strokeWidthSecondary={5}
                            />
                        )}
                        {!isLoading && (
                            <p className="font-bold text-blue-900 px-1.5 animation-slideUp">
                                {data?.vote?.user_id?.length}
                            </p>
                        )}
                    </div>
                </div>
                <div className="w-full sm:flex-1 order-1 sm:order-2">
                    <p className="font-bold text-blue-900">{data.title}</p>
                    <p className="text-neutral-600">{data.description}</p>
                    {data.category.name !== "All" && (
                        <div className="flex flex-row mt-3">
                            <Tag label={data.category.name} />
                        </div>
                    )}
                </div>
                <div className="flex-initial flex order-3">
                    <div className="self-center flex flex-row justify-center items-center">
                        <HiChat
                            size={28}
                            className="text-indigo-200"
                        />
                        <p className="font-bold text-blue-900 ml-1">
                            {data?.comment?.length ?? 0}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function mapStateToProps(state: any) {
    return {
        auth: state.user.auth,
        user: state.user.user,
    }
}

export default connect(mapStateToProps, { voteBlog, openModalLogin })(BlogList)
