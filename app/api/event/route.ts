import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {

  try {



    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    const skip = (page - 1) * limit;

    const events = await prisma.event.findMany({
      skip: skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    const total = await prisma.event.count();

    return NextResponse.json({
      success: true,
      data: events,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    console.error("GET EVENTS ERROR:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch events"
      },
      {
        status: 500
      }
    )
  }
}


export async function POST(req: Request) {

  try {

    const body = await req.json()

    const {
      title,
      image,
      video,
      date,
      startDate,
      endDate,
      status,
      venue,
      details,
      registration,
      link,
      slug,
      color,
      about,
      artistIds,
    } = body

    // validation
    if (!title || !slug) {
      return NextResponse.json(
        {
          success: false,
          message: "Title and slug are required"
        },
        {
          status: 400
        }
      )
    }

    // check existing slug
    const existingEvent = await prisma.event.findUnique({
      where: {
        slug
      }
    })

    if (existingEvent) {
      return NextResponse.json(
        {
          success: false,
          message: "Slug already exists"
        },
        {
          status: 400
        }
      )
    }

    // create event
    const event = await prisma.event.create({
      data: {
        title,
        image,
        video,
        startDate: startDate
          ? new Date(startDate)
          : null,

        endDate: endDate
          ? new Date(endDate)
          : null,

        status,
        venue,
        details,
        registration,
        link,
        slug,
        color,
        about,

        // relation creation
        artist: {

          create: artistIds.map(
            (artistId: string) => ({

              artist: {
                connect: {
                  id: artistId,
                },
              },

            })
          ),

        },
      },

      include: {

        artist: {
          include: {
            artist: true,
          },
        },

      },
    })

    return NextResponse.json(
      {
        success: true,
        message: "Event created successfully",
        event
      },
      {
        status: 201
      }
    )

  } catch (error) {

    console.error("CREATE EVENT ERROR:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Server Error / Failed to create event"
      },
      {
        status: 500
      }
    )

  }

}