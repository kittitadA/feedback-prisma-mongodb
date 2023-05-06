import type { NextApiRequest, NextApiResponse } from "next"
import prisma from "@/libs/prismadb"

export const FormDataBlog = {
    create_date: true,
    description: true,
    id: true,
    title: true,
    comment: true,
    category: true,
    roadmap: true,
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
            const { sort, category } = req?.query
            if (sort !== "vote" && sort !== "recen") {
                return res.status(400).json({
                    message: "Sort is invalid format",
                    data: null,
                })
            }

            let where = {}
            if (category && category !== "6451ccc5b6fe89bc53559363") {
                const categoryBlog = await prisma.categoryBlog.findFirst({
                    where: { id: category.toString() },
                })

                if (categoryBlog) {
                    where = { category_id: category.toString() }
                } else {
                    return res.status(400).json({
                        message: "Category is invalid format",
                        data: null,
                    })
                }
            }

            let blog
            if (sort === "vote") {
                blog = await prisma.blog.findMany({
                    where: { ...where },
                    select: FormDataBlog,
                    orderBy: [
                        {
                            vote: {
                                user_id: "desc",
                            },
                        },
                        { create_date: "desc" },
                    ],
                })
            } else if (sort === "recen") {
                blog = await prisma.blog.findMany({
                    where: { ...where },
                    select: FormDataBlog,
                    orderBy: {
                        create_date: "desc",
                    },
                })
            }

            return res.status(200).json({ message: "Success", data: blog })
        } else if (req.method === "POST") {
            const { title, description, category, roadmap_id, user_id } =
                req.body

            if (
                title === undefined ||
                description === undefined ||
                user_id === undefined ||
                typeof category !== "string"
            ) {
                return res.status(400).json({
                    message: "Field is invalid format",
                    data: null,
                })
            }

            const findCategory = await prisma.categoryBlog.findUnique({
                where: { id: category },
            })
            if (!findCategory) {
                return res.status(400).json({
                    message: "Field is invalid format",
                    data: null,
                })
            }

            const findUser = await prisma.user.findMany({
                where: { id: user_id },
            })

            if (findUser) {
                let blog = await prisma.blog.create({
                    data: {
                        title,
                        description,
                        category_id: category,
                        // roadmap_id,
                        user_id: user_id,
                    },
                    select: FormDataBlog,
                })

                let vote: any = await prisma.voteBlog.create({
                    data: {
                        blog_id: blog.id,
                    },
                    select: {
                        user_id: true,
                    },
                })

                let newblog: any = { ...blog, vote }

                return res
                    .status(201)
                    .json({ message: "Success", data: { blog: newblog } })
            } else {
                return res
                    .status(401)
                    .json({ message: "Unauthorized", data: null })
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
