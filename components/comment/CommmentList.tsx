import { useState } from "react"
import { connect } from "react-redux"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import Image from "next/image"
import toast from "react-hot-toast"

import Button from "../Button"
import Textarea from "../Textarea"
import ReplyList from "./ReplyList"
import classes from "./commentList.module.css"

import { openModalLogin } from "@/actions/user_action"
import { insertReplyComment } from "@/actions/blog_action"

interface commentProps {
    commentItem: any
    user: any
    last: boolean
    auth: boolean
    openModalLogin: (value: any) => any
    insertReplyComment: (value: any) => any
}

const CommentList: React.FC<commentProps> = ({
    commentItem,
    user,
    last,
    auth,
    openModalLogin,
    insertReplyComment,
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
    const [isReply, setisReply] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const message = watch("message")

    const replyHandler: SubmitHandler<FieldValues> = async (data) => {
        if (!auth) {
            openModalLogin(true)
        } else if (!isLoading) {
            setIsLoading(true)
            insertReplyComment({
                message: data.message,
                user_id: user?.user_id ?? "",
                blog_id: commentItem.blog_id,
                comment_id: commentItem.id,
            })
                .then((res: any) => {
                    reset()
                    toast.success("Reply comment success")
                })
                .catch((err: any) => {
                    toast.error("Something went wrong")
                })
                .finally(() => {
                    setIsLoading(false)
                    setisReply(false)
                })
        }
    }

    return (
        <>
            <div className="relative flex flex-row mt-4 gap-4 animation-slideUp">
                <Image
                    src={commentItem?.user?.profile?.image}
                    width={38}
                    height={38}
                    className="rounded-full w-[38px] h-[38px] min-w-[38px] bg-neutral-200 z-10"
                    alt="img_pf_cm_list"
                />

                {commentItem?.reply?.length > 0 && (
                    <div className="absolute top-[0px] left-[18px] w-[2px] h-full bg-neutral-100"></div>
                )}

                <div className="flex-1">
                    <div className="flex flex-row items-center gap-4">
                        <div className="flex-1">
                            <p
                                className={`${classes.word_break_break_word} font-bold text-blue-900`}
                            >
                                {commentItem?.user?.profile?.fname}{" "}
                                {commentItem?.user?.profile?.lname}
                            </p>
                            <p
                                className={`${classes.word_break_break_word} text-sm text-neutral-400`}
                            >
                                {commentItem?.user?.email}
                            </p>
                        </div>
                        <Button
                            label="Reply"
                            color="bg-transparent hover:bg-slate-100"
                            textColor="text-blue-700"
                            onClick={() => setisReply(true)}
                        />
                    </div>
                    <p className={`${classes.word_break_break_word} mt-0.5`}>
                        {commentItem?.message}
                    </p>
                </div>
            </div>

            {!last && commentItem?.reply?.length === 0 && !isReply && (
                <hr className="my-6 animation-fadeIn" />
            )}

            {commentItem?.reply?.map((item: any, index: number) => (
                <ReplyList
                    replyItem={item}
                    lastComment={last}
                    key={`reply_list_${index}`}
                    last={index === commentItem?.reply?.length - 1}
                    openReply={() => setisReply(true)}
                />
            ))}

            {isReply && (
                <div className="pl-[54px] mt-4 animation-slideUp">
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
                    <div className="flex flex-row items-center justify-between gap-3 mt-2">
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
                            label="Reply"
                            onClick={handleSubmit(replyHandler)}
                            loading={isLoading}
                        />
                    </div>
                </div>
            )}

            {!last && (commentItem?.reply?.length > 0 || isReply) && (
                <hr className="my-6 animation-fadeIn" />
            )}
        </>
    )
}

function mapStateToProps(state: any) {
    return {
        auth: state.user.auth,
        user: state.user.user,
    }
}

export default connect(mapStateToProps, { openModalLogin, insertReplyComment })(
    CommentList
)
