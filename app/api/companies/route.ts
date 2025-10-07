import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const companies = await prisma.company.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            contacts: true,
            deals: true,
            projects: true,
          }
        }
      }
    })

    return NextResponse.json(companies)
  } catch (error) {
    console.error("Error fetching companies:", error)
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

    const company = await prisma.company.create({
      data: {
        name: body.name,
        logo: body.logo || null,
        industry: body.industry || null,
        website: body.website || null,
        phone: body.phone || null,
        email: body.email || null,
        address: body.address || null,
        city: body.city || null,
        province: body.province || null,
        postalCode: body.postalCode || null,
        country: body.country || "Thailand",
        taxId: body.taxId || null,
        notes: body.notes || null,
      }
    })

    // Log activity
    await prisma.activity.create({
      data: {
        type: "OTHER",
        title: "Company created",
        description: `Created company: ${company.name}`,
        userId: session.user.id,
      }
    })

    return NextResponse.json(company)
  } catch (error) {
    console.error("Error creating company:", error)
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

    const company = await prisma.company.update({
      where: { id: body.id },
      data: {
        name: body.name,
        logo: body.logo || null,
        industry: body.industry || null,
        website: body.website || null,
        phone: body.phone || null,
        email: body.email || null,
        address: body.address || null,
        city: body.city || null,
        province: body.province || null,
        postalCode: body.postalCode || null,
        country: body.country || "Thailand",
        taxId: body.taxId || null,
        notes: body.notes || null,
      }
    })

    return NextResponse.json(company)
  } catch (error) {
    console.error("Error updating company:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
