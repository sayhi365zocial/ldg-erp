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
    const companyId = searchParams.get("companyId")

    const where = companyId ? { companyId } : {}

    const contacts = await prisma.contactPerson.findMany({
      where,
      include: {
        company: {
          select: {
            id: true,
            name: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(contacts)
  } catch (error) {
    console.error("Error fetching contacts:", error)
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

    const contact = await prisma.contactPerson.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        position: body.position,
        department: body.department,
        image: body.image,
        isPrimary: body.isPrimary || false,
        notes: body.notes,
        companyId: body.companyId,
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    })

    // Log activity
    await prisma.activity.create({
      data: {
        type: "CONTACT_CREATED",
        title: "Contact created",
        description: `Created contact: ${contact.firstName} ${contact.lastName}`,
        userId: session.user.id,
        contactId: contact.id,
      }
    })

    return NextResponse.json(contact)
  } catch (error) {
    console.error("Error creating contact:", error)
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

    const contact = await prisma.contactPerson.update({
      where: { id: body.id },
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        position: body.position,
        department: body.department,
        image: body.image,
        isPrimary: body.isPrimary,
        isActive: body.isActive,
        notes: body.notes,
        companyId: body.companyId,
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    })

    // Log activity
    await prisma.activity.create({
      data: {
        type: "CONTACT_UPDATED",
        title: "Contact updated",
        description: `Updated contact: ${contact.firstName} ${contact.lastName}`,
        userId: session.user.id,
        contactId: contact.id,
      }
    })

    return NextResponse.json(contact)
  } catch (error) {
    console.error("Error updating contact:", error)
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
      return new NextResponse("Missing contact ID", { status: 400 })
    }

    const contact = await prisma.contactPerson.delete({
      where: { id },
    })

    return NextResponse.json(contact)
  } catch (error) {
    console.error("Error deleting contact:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
