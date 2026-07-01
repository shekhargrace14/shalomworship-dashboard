import { NextResponse } from "next/server";
import { getChannelsService } from "./service";



export  async function getChannels(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const mine = searchParams.get("mine") === "true";

    const channels = await getChannelsService(mine);

    return NextResponse.json(
      {
        success: true,
        message: "Channels fetched successfully",
        data: channels,
      },
      {
        status: 200,
      }
    );

  } catch (error: any) {

    console.error("GET CHANNEL ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error.message || "Failed to fetch channels",
      },
      {
        status: 500,
      }
    );

  }
}
