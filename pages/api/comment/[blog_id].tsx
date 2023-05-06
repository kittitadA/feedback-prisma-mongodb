import type { NextApiRequest, NextApiResponse } from "next"
import prisma from "@/libs/prismadb"

export default async function comment(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        if (req.method === "GET") {
            const { blog_id } = req.query
            const comment: any = await prisma.comment.findMany({
                where: { blog_id: blog_id?.toString() },
                include: {
                    reply: {
                        include: {
                            user: {
                                select: {
                                    email: true,
                                    profile: true,
                                },
                            },
                        },
                    },
                    user: {
                        select: {
                            email: true,
                            profile: true,
                        },
                    },
                },
            })

            return res.status(200).json({ message: "Success", data: comment })
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
