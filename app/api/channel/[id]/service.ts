import { prisma } from "@/lib/prisma";


export default async function getSingleChannelService(channelId:any) {


    const channel = await prisma.channel.findUnique({
            where: {
                id: channelId
            },
            include:{
                team:{
                    include: {
                        user: true,
                    }
                }
            }
        })

    return channel
    
}