import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { success } from "zod"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  console.log("CATEGORY API HIT")

  const { id } = await params

  console.log(id, "api category")

  const category = await prisma.category.findUnique({
    where: { id }
  })

  if (!category) {
    return NextResponse.json(
      { error: "Category not found" },
      { status: 404 }
    )
  }

  return NextResponse.json({
    success: true,
    category
  })
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  try {

    const { id } = await params

    // optional existence check
    const existingCategory = await prisma.category.findUnique({
      where: {
        id
      }
    })

    if (!existingCategory) {

      return NextResponse.json(
        {
          success: false,
          message: "Category not found"
        },
        {
          status: 404
        }
      )

    }

    // delete category
    await prisma.category.delete({
      where: {
        id
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: "Category deleted successfully",
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
        message: error.message || "Failed to delete category"
      },
      {
        status: 500
      }
    )

  }

}
