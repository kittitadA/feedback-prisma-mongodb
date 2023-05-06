import Image from "next/image"

import classes from "./commentList.module.css"
import Button from "../Button"

interface replyProps {
    replyItem: any
    last: boolean
    lastComment: boolean
    openReply: () => void
}

const ReplyList: React.FC<replyProps> = ({
    replyItem,
    last,
    lastComment,
    openReply,
}) => {
    return (
        <div className="relative flex flex-row gap-4 pl-[54px] pt-6 animation-slideUp">
            <Image
                src={replyItem.user.profile.image}
                width={38}
                height={38}
                className="rounded-full w-[38px] h-[38px] min-w-[38px] bg-neutral-200 z-10"
                alt="img_pf_recm_list"
            />
            {!last && (
                <div className="absolute top-[0px] left-[18px] w-[2px] h-full bg-neutral-100"></div>
            )}
            {last && (
                <div className="absolute top-[0px] left-[18px] w-[2px] h-[34px] bg-neutral-100"></div>
            )}
            <div className="flex-1">
                <div className="flex flex-row items-center gap-4">
                    <div className="flex-1">
                        <p
                            className={`${classes.word_break_break_word} font-bold text-blue-900`}
                        >
                            {replyItem.user.profile.fname}{" "}
                            {replyItem.user.profile.lname}
                        </p>
                        <p
                            className={`${classes.word_break_break_word} text-sm text-neutral-400`}
                        >
                            {replyItem.user.email}
                        </p>
                    </div>
                    <Button
                        label="Reply"
                        color="bg-transparent hover:bg-slate-100"
                        textColor="text-blue-700"
                        onClick={openReply}
                    />
                </div>
                <p className={`${classes.word_break_break_word} mt-0.5`}>
                    {replyItem.message}
                </p>
            </div>
        </div>
    )
}

export default ReplyList
