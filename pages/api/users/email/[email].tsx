import type { NextApiRequest, NextApiResponse } from "next"
import prisma from "@/libs/prismadb"

export default async function users(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === "GET") {
            const { email } = req.query
            if (!email) {
                return res
                    .status(400)
                    .json({ message: "Field is invalid format", data: null })
            }

            const user: any = await prisma.user.findUnique({
                where: { email: email.toString() },
                include: {
                    profile: true,
                },
            })

            return res.status(200).json({ message: "success", data: user })
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
