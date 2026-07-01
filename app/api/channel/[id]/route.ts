import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { success } from "zod"
import getSingleChannelController from "./controller";

// export async function GET(
//     req: Request,
//     { params }: { params: Promise<{ id: string }> }
// ) {

//     try {

//         const { id } = await params

//         const channel = await prisma.channel.findUnique({
//             where: {
//                 id
//             },
//             include:{
//                 members:{
//                     include: {
//                         user: true,
//                     }
//                 }
//             }
//         })

//         if (!channel) {

//             return NextResponse.json(
//                 {
//                     success: false,
//                     message: "Channel not found"
//                 },
//                 {
//                     status: 404
//                 }
//             )

//         }

//         return NextResponse.json(
//             {
//                 success: true,
//                 message: "Channel found",
//                 channel
//             },
//             {
//                 status: 200
//             }
//         )

//     } catch (error) {

//         console.log(error)

//         return NextResponse.json(
//             {
//                 success: false,
//                 message: "Something went wrong"
//             },
//             {
//                 status: 500
//             }
//         )

//     }

// }

export async function GET(
    req: Request,
    context: {params: Promise<{id:string}>}
) {

    return  getSingleChannelController(req, context)
}



// export async function GET(
//   req: Request,
//   context: { params: Promise<{ id: string }> }
// ) {
//   return getSingleChannelController(req, context)
// }

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await prisma.channel.delete({
            where: {
                id,
            }
        })
        return Response.json(
            {
                success: true,
                message: "Channel Deleted Successfully",
            },
            {
                status: 200
            }
        )
    } catch (error: any) {
        console.log(error)
        return NextResponse.json(
            {
                success: false,
                message: error.message || "Fail To Delete Channel"
            },
            {
                status: 500,
            }
        )
    }
}
    
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const body = await req.json()

    const updatedChannel = await prisma.channel.update({
      where: {
        id,
      },
      data: {
        ...body,
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: "Changes Saved",
        channel: updatedChannel,
      },
      {
        status: 200,
      }
    )

  } catch (error: any) {

    console.error("PATCH CHANNEL ERROR:", error)

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ||
          "Failed to Save Changes",
      },
      {
        status: 500,
      }
    )

  }
}