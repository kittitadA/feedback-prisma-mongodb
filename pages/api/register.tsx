import type { NextApiRequest, NextApiResponse } from "next"
import bcrypt from "bcrypt"
import prisma from "@/libs/prismadb"

export default async function register(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const { fname, lname, email, password } = req.body
        if (!fname || !lname || !email || !password) {
            return res
                .status(400)
                .json({ message: "Field is invalid format", data: null })
        }

        const findUser: any = await prisma.user.findUnique({
            where: { email: email },
        })

        if (!findUser) {
            const hashedPassword: string = await bcrypt.hash(password, 12)
            const user = await prisma.user.create({
                data: {
                    email,
                    hashedPassword,
                    profile: {
                        create: {
                            fname,
                            lname,
                        },
                    },
                },
            })
            return res.status(201).json({ message: "Success", data: { user } })
        } else {
            return res
                .status(400)
                .json({ message: "Duplicate email", data: null })
        }
    } catch (error: any) {
        return res
            .status(500)
            .json({ message: "Something went wrong", data: `${error.message}` })
    }
}
