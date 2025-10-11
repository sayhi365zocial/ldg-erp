import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const contactId = searchParams.get("contactId")
    const companyId = searchParams.get("companyId")

    let where = {}

    if (contactId) {
      where = { contactId }
    } else if (companyId) {
      // Get all activities for contacts in this company
      where = {
        contact: {
          companyId
        }
      }
    }

    const activities = await prisma.activity.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        contact: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(activities)
  } catch (error) {
    console.error("Error fetching activities:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()

    // Prepare metadata with attachments
    const metadata = body.attachments ? { attachments: body.attachments } : undefined

    const activity = await prisma.activity.create({
      data: {
        type: body.type,
        title: body.title,
        description: body.description,
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        completedAt: body.completedAt ? new Date(body.completedAt) : null,
        isCompleted: body.isCompleted || false,
        priority: body.priority || "MEDIUM",
        metadata: metadata,
        userId: session.user.id,
        contactId: body.contactId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        contact: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        }
      }
    })

    return NextResponse.json(activity)
  } catch (error) {
    console.error("Error creating activity:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()

    // Prepare metadata if provided
    const metadata = body.metadata ? body.metadata : undefined

    const activity = await prisma.activity.update({
      where: { id: body.id },
      data: {
        type: body.type,
        title: body.title,
        description: body.description,
        isCompleted: body.isCompleted,
        completedAt: body.isCompleted ? new Date() : null,
        metadata: metadata,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        contact: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        }
      }
    })

    return NextResponse.json(activity)
  } catch (error) {
    console.error("Error updating activity:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return new NextResponse("Missing activity ID", { status: 400 })
    }

    const activity = await prisma.activity.delete({
      where: { id },
    })

    return NextResponse.json(activity)
  } catch (error) {
    console.error("Error deleting activity:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
