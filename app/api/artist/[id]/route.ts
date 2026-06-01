import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { success } from "zod"

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {

    try {

        const { id } = await params

        const artist = await prisma.artist.findUnique({
            where: {
                id
            }
        })

        if (!artist) {

            return NextResponse.json(
                {
                    success: false,
                    message: "Artist not found"
                },
                {
                    status: 404
                }
            )

        }

        return NextResponse.json(
            {
                success: true,
                message: "Artist found",
                artist
            },
            {
                status: 200
            }
        )

    } catch (error) {

        console.log(error)

        return NextResponse.json(
            {
                success: false,
                message: "Something went wrong"
            },
            {
                status: 500
            }
        )

    }

}


export async function DELETE(req:Request, {params}:{params: Promise<{id:string}>}) {
    try{
        const {id} = await params;
        await prisma.artist.delete({
            where:{
                id,
            }
        })
        return Response.json(
            {
                success: true,
                message: "Artist Deleted Successfully",
            },
            {
                status: 200
            }
        )
    }catch(error:any){
        console.log(error)
        return NextResponse.json(
            {
                success: false,
                message: error.message || "Fail To Delete Artist"
            },
            {
                status: 500,
            }
        )
    } 
}