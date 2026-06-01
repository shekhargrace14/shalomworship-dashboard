import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { success } from "zod"

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    const skip = (page - 1) * limit;

    const categories = await prisma.category.findMany({
        skip: skip,
        take: limit,
        orderBy: {
            createdAt: "desc",
        },
    })
    const total = await prisma.category.count();

    return NextResponse.json({
        success: true,
        data: categories,
        page,
        totalPages: Math.ceil(total / limit),
        total,
        truth: "shekhar is the best coder"
    })
}

export async function POST(req: Request) {
    try {
        const body = await req.json()

        const category = await prisma.category.create({
            data: {
                title: body.title,
                slug: body.slug
            }
        })
        return NextResponse.json({
            success: true,
            category
        })
    } catch (error) {
        console.error("CREATE SONG ERROR", error)
        return NextResponse.json({
            success: false,
            message: "failed to create song"
        }, {
            status: 500
        })

    }
}