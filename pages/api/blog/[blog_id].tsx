import type { NextApiRequest, NextApiResponse } from "next"
import prisma from "@/libs/prismadb"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"

import { PRIVILEGE } from "@/components/utility"

export const FormBlogReturn = {
    create_date: true,
    description: true,
    id: true,
    title: true,
    category: true,
    roadmap: true,
    comment: {
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
    },
    vote: {
        select: {
            user_id: true,
        },
    },
    user: {
        select: {
            profile: true,
        },
    },
}

export default async function blog(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === "GET") {
            const { blog_id } = req.query

            const blog = await prisma.blog.findUnique({
                where: { id: blog_id?.toString() },
                select: FormBlogReturn,
            })

            if (blog) {
                return res.status(200).json({ message: "Success", data: blog })
            } else {
                return res.status(400).json({ message: "No data", data: null })
            }
        } else if (req.method === "DELETE") {
            const { blog_id } = req.query

            const deleteReplyComment = prisma.reply_comment.deleteMany({
                where: { blog_id: blog_id?.toString() },
            })
            const deleteComment = prisma.comment.deleteMany({
                where: { blog_id: blog_id?.toString() },
            })
            const deleteVote = prisma.voteBlog.deleteMany({
                where: { blog_id: blog_id?.toString() },
            })
            const deleteBlog = prisma.blog.delete({
                where: { id: blog_id?.toString() },
            })

            const transaction = await prisma.$transaction([
                deleteReplyComment,
                deleteComment,
                deleteVote,
                deleteBlog,
            ])

            return res
                .status(202)
                .json({ message: "Success", data: transaction[3] })
        } else if (req.method === "PATCH") {
            const { blog_id } = req.query
            const { title, description, category_id, roadmap_id } = req.body
            const findBlog = await prisma.blog.findUnique({
                where: { id: blog_id?.toString() },
            })

            if (!findBlog) {
                return res
                    .status(400)
                    .json({ message: "Not found blog", data: null })
            }

            const categoryBlog = await prisma.categoryBlog.findFirst({
                where: { id: category_id?.toString() },
            })
            if (!categoryBlog) {
                return res
                    .status(400)
                    .json({ message: "Not found category", data: null })
            }

            const roadmap = await prisma.roadmap.findFirst({
                where: { id: roadmap_id?.toString() },
            })
            if (roadmap) {
                if (findBlog.roadmap_id !== roadmap_id) {
                    const session: any = await getServerSession(
                        req,
                        res,
                        authOptions
                    )
                    if (session) {
                        if (session?.privilege !== PRIVILEGE.DEVELOPER) {
                            return res.status(403).json({
                                message: "Wrong privilege",
                                data: null,
                            })
                        }
                    } else {
                        return res
                            .status(401)
                            .json({ message: "Unauthorized", data: null })
                    }
                }
            } else {
                return res
                    .status(400)
                    .json({ message: "Not found roadmap", data: null })
            }

            const blog = await prisma.blog.update({
                where: { id: blog_id?.toString() },
                data: { title, description, category_id, roadmap_id },
                select: FormBlogReturn,
            })

            if (blog) {
                return res.status(202).json({ message: "Success", data: blog })
            } else {
                return res
                    .status(400)
                    .json({ message: "Something went wrong", data: null })
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
