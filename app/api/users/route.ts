import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      }
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()

    // Hash password
    const hashedPassword = await bcrypt.hash(body.password, 10)

    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashedPassword,
        role: body.role || "USER",
      }
    })

    // Don't return password
    const { password, ...userWithoutPassword } = user

    // Log activity
    await prisma.activity.create({
      data: {
        type: "OTHER",
        title: "User created",
        description: `Created user: ${user.name || user.email}`,
        userId: session.user.id,
      }
    })

    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error("Error creating user:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()

    const user = await prisma.user.update({
      where: { id: body.id },
      data: {
        name: body.name,
        email: body.email,
        role: body.role,
      }
    })

    // Don't return password
    const { password, ...userWithoutPassword } = user

    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error("Error updating user:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
