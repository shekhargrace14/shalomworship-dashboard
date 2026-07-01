import { NextResponse } from "next/server"
import getSingleChannelService from "./service"


export default async function getSingleChannelController(
        req: Request,
        { params }: { params: Promise<{ id: string }> }
) {

    try {
        const {id} = await params

        const result = await getSingleChannelService(id)

        if (!result) {

            return NextResponse.json(
                {
                    success: false,
                    message: "Channel not found"
                },
                {
                    status: 404
                }
            )

        }

        return NextResponse.json(
            {
                success: true,
                message: "Channel found",
                data: result
            },
            {
                status: 200
            }
        )

    } catch (error: any) {
        console.log(error.message)
        return NextResponse.json(
            {
                success: false,
                message: "server issue"
            },
            {
                status: 500
            }
        )
    }
}