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
    const userId = searchParams.get("userId")
    const status = searchParams.get("status")
    const companyId = searchParams.get("companyId")
    const contactId = searchParams.get("contactId")

    // Build where clause
    const where: any = {}

    // If user is not admin, only show their tasks
    if (session.user.role !== "ADMIN" && !userId) {
      where.userId = session.user.id
    } else if (userId) {
      where.userId = userId
    }

    if (status) {
      where.status = status
    }
    if (companyId) {
      where.companyId = companyId
    }
    if (contactId) {
      where.contactId = contactId
    }

    const tasks = await prisma.task.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          }
        },
        company: {
          select: {
            id: true,
            name: true,
          }
        },
        contact: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      },
      orderBy: [
        { status: 'asc' },
        { dueDate: 'asc' },
        { createdAt: 'desc' },
      ],
    })

    return NextResponse.json(tasks)
  } catch (error) {
    console.error("Error fetching tasks:", error)
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

    const task = await prisma.task.create({
      data: {
        title: body.title,
        description: body.description,
        status: body.status || "PENDING",
        priority: body.priority || "MEDIUM",
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        attachments: body.attachments || [],
        notes: body.notes,
        userId: body.userId || session.user.id,
        companyId: body.companyId || null,
        contactId: body.contactId || null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          }
        },
        company: {
          select: {
            id: true,
            name: true,
          }
        },
        contact: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      }
    })

    return NextResponse.json(task)
  } catch (error) {
    console.error("Error creating task:", error)
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

    // Check if user owns this task or is admin
    const existingTask = await prisma.task.findUnique({
      where: { id: body.id },
    })

    if (!existingTask) {
      return new NextResponse("Task not found", { status: 404 })
    }

    if (existingTask.userId !== session.user.id && session.user.role !== "ADMIN") {
      return new NextResponse("Forbidden", { status: 403 })
    }

    const updateData: any = {
      title: body.title,
      description: body.description,
      status: body.status,
      priority: body.priority,
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
      attachments: body.attachments,
      notes: body.notes,
      companyId: body.companyId || null,
      contactId: body.contactId || null,
    }

    // Set completedAt when status changes to DONE
    if (body.status === "DONE" && existingTask.status !== "DONE") {
      updateData.completedAt = new Date()
    } else if (body.status !== "DONE") {
      updateData.completedAt = null
    }

    const task = await prisma.task.update({
      where: { id: body.id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          }
        },
        company: {
          select: {
            id: true,
            name: true,
          }
        },
        contact: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      }
    })

    return NextResponse.json(task)
  } catch (error) {
    console.error("Error updating task:", error)
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
      return new NextResponse("Missing task ID", { status: 400 })
    }

    // Check if user owns this task or is admin
    const existingTask = await prisma.task.findUnique({
      where: { id },
    })

    if (!existingTask) {
      return new NextResponse("Task not found", { status: 404 })
    }

    if (existingTask.userId !== session.user.id && session.user.role !== "ADMIN") {
      return new NextResponse("Forbidden", { status: 403 })
    }

    const task = await prisma.task.delete({
      where: { id },
    })

    return NextResponse.json(task)
  } catch (error) {
    console.error("Error deleting task:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
