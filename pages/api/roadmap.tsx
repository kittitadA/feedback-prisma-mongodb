import type { NextApiRequest, NextApiResponse } from "next"
import prisma from "@/libs/prismadb"

import { FormBlogReturn } from "./blog/[blog_id]"

export default async function roadmap(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        if (req.method === "GET") {
            const { mode } = req.query
            if (mode && (mode === "count" || mode === "all")) {
                let where = {}
                if (mode === "count") {
                    where = { NOT: { id: "6451cd9db6fe89bc53559364" } }
                }
                const roadmap = await prisma.roadmap.findMany({
                    where: where,
                    select: {
                        id: true,
                        name: true,
                        color: true,
                        _count: {
                            select: {
                                blog: true,
                            },
                        },
                    },
                })

                return res
                    .status(200)
                    .json({ message: "Success", data: roadmap })
            } else {
                const roadmap = await prisma.roadmap.findMany({
                    where: { NOT: { id: "6451cd9db6fe89bc53559364" } },
                    select: {
                        id: true,
                        name: true,
                        color: true,
                        blog: {
                            select: FormBlogReturn,
                            orderBy: {
                                create_date: "desc",
                            },
                        },
                        _count: {
                            select: {
                                blog: true,
                            },
                        },
                    },
                })

                return res
                    .status(200)
                    .json({ message: "Success", data: roadmap })
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
