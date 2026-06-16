import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
export async function GET() {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isActive: true,
                createdAt: true,
            }
        })
        return NextResponse.json(
            {
                success: true,
                message: "Users fetched successfully",
                data: users,
            },
            {
                status: 200
            }
        )
    }
    catch (error: any) {
        console.log("GET USERS ERROR:",error)

        return NextResponse.json(
            {
                success: false,
                message: error.message || "Failed to fetch users"
            },
            {
                status: 500
            }
        )
    }
}