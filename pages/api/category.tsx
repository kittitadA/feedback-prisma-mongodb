import type { NextApiRequest, NextApiResponse } from "next"
import prisma from "@/libs/prismadb"

export default async function categoryBlog(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        if (req.method === "GET") {
            const category: any = await prisma.categoryBlog.findMany()

            return res.status(200).json({ message: "Success", data: category })
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
