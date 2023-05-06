import { useState } from "react"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import { connect } from "react-redux"
import toast from "react-hot-toast"
import { BsSendFill } from "react-icons/bs"

import Textarea from "../Textarea"
import Button from "../Button"
import CommentList from "./CommmentList"

import { openModalLogin } from "@/actions/user_action"
import { insertComment } from "@/actions/blog_action"

interface commentBoxProps {
    blog_id: string
    auth: boolean
    comment: any
    user: any
    openModalLogin: (value: any) => any
    insertComment: (value: any) => any
}

const CommentBox: React.FC<commentBoxProps> = ({
    user,
    blog_id,
    comment,
    auth,
    openModalLogin,
    insertComment,
}) => {
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<FieldValues>({
        defaultValues: {
            message: "",
        },
    })
    const message = watch("message")
    const [isLoading, setIsLoading] = useState(false)

    const commentHandler: SubmitHandler<FieldValues> = async (data) => {
        if (!auth) {
            openModalLogin(true)
        } else if (!isLoading) {
            setIsLoading(true)
            insertComment({
                message: data.message,
                user_id: user?.user_id ?? "",
                blog_id,
            })
                .then((res: any) => {
                    reset()
                    toast.success("Comment success")
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
        <>
            {comment?.length > 0 && (
                <div className="rounded-lg bg-white p-6 shadow-sm">
                    <p className="text-lg font-bold text-blue-900">
                        {comment?.length ?? 0} comments
                    </p>
                    {comment.map((data: any, index: number) => (
                        <CommentList
                            commentItem={data}
                            key={`comment_${index}`}
                            last={index === comment.length - 1}
                        />
                    ))}
                </div>
            )}
            <div className="rounded-lg bg-white p-6 shadow-sm mt-4 animation-slideUp">
                <p className="text-lg font-bold">Add comment</p>
                <div className="mt-4">
                    <Textarea
                        id="message"
                        label="Comment"
                        value={message}
                        register={register}
                        errors={errors}
                        disabled={isLoading}
                        required
                        customValidate={{ maxLength: 250 }}
                    />
                </div>
                <div className="flex flex-row items-center justify-between gap-3 mt-4">
                    <p className="text-sm">
                        <span
                            className={`
                                    font-semibold 
                                    ${
                                        message.length > 250
                                            ? "text-red-500"
                                            : "text-neutral-500"
                                    }
                                `}
                        >
                            {message.length}
                        </span>{" "}
                        <span className="text-neutral-400">
                            / 250 Characters left
                        </span>
                    </p>
                    <Button
                        icon={BsSendFill}
                        label="Post comment"
                        onClick={handleSubmit(commentHandler)}
                        loading={isLoading}
                    />
                </div>
            </div>
        </>
    )
}

export const LoadingCommentBox = () => {
    return (
        <div className="rounded-lg bg-slate-300 shadow-sm h-[243px] animate-pulse mt-4"></div>
    )
}

function mapStateToProps(state: any) {
    return {
        auth: state.user.auth,
        user: state.user.user,
    }
}

export default connect(mapStateToProps, { openModalLogin, insertComment })(
    CommentBox
)
