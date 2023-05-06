import type { NextApiRequest, NextApiResponse } from "next"
import prisma from "@/libs/prismadb"

export default async function commentReply(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        if (req.method === "POST") {
            const { message, user_id, blog_id, comment_id } = req.body
            if (!message || !user_id || !blog_id || !comment_id) {
                return res
                    .status(400)
                    .json({ message: "Field is invalid format", data: null })
            }
            const blog: any = await prisma.comment.findUnique({
                where: { id: comment_id },
            })
            if (blog) {
                const comment_reply: any = await prisma.reply_comment.create({
                    data: {
                        message,
                        user_id,
                        blog_id,
                        comment_id,
                    },
                    include: {
                        user: {
                            select: {
                                email: true,
                                profile: true,
                            },
                        },
                    },
                })
                return res
                    .status(201)
                    .json({ message: "Success", data: comment_reply })
            } else {
                return res
                    .status(400)
                    .json({ message: "Not found comment", data: null })
            }
        } else {
            return res
                .status(404)
                .json({ message: "Something went wrong", data: null })
        }
    } catch (error: any) {
        return res
            .status(500)
            .json({ message: `${error?.message}`, data: null })
    }
}
