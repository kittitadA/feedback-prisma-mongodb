import type { NextApiRequest, NextApiResponse } from "next"
import prisma from "@/libs/prismadb"

export default async function users(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === "POST") {
            const { blog_id, user_id } = req.body
            if (!blog_id || !user_id) {
                return res
                    .status(400)
                    .json({ message: "Field is invalid format", data: null })
            }

            const voteBlog: any = await prisma.voteBlog.findFirst({
                where: {
                    blog_id: blog_id.toString(),
                },
                include: {
                    user: true,
                },
            })

            if (voteBlog) {
                const alreadyVote = voteBlog.user_id.some(
                    (item: string) => item === user_id
                )
                if (alreadyVote) {
                    const updateVote = voteBlog.user_id.filter(
                        (item: any) => item !== user_id
                    )
                    const vote: any = await prisma.voteBlog.update({
                        where: { blog_id: blog_id.toString() },
                        data: { user_id: updateVote },
                    })
                    return res.status(202).json({
                        message: "Success unvote",
                        data: { vote },
                    })
                } else {
                    const vote: any = await prisma.voteBlog.update({
                        where: { blog_id: blog_id.toString() },
                        data: { user_id: [...voteBlog.user_id, user_id] },
                    })
                    return res.status(202).json({
                        message: "Success vote",
                        data: { vote },
                    })
                }
            } else {
                return res
                    .status(400)
                    .json({ message: "Field is invalid format", data: null })
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
