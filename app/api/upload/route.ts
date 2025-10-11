import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const type = formData.get("type") as string || "companies" // companies, contacts, tasks, or activities

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      )
    }

    // Validate file type
    if (type === "contacts" || type === "companies") {
      // Only images for contacts and companies
      if (!file.type.startsWith("image/")) {
        return NextResponse.json(
          { error: "Only image files are allowed" },
          { status: 400 }
        )
      }
    } else if (type === "activities" || type === "tasks") {
      // Allow common file types for activities and tasks
      const allowedTypes = [
        "image/",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "text/",
        "application/zip",
        "application/x-zip-compressed",
      ]

      const isAllowed = allowedTypes.some(allowedType => file.type.startsWith(allowedType))
      if (!isAllowed) {
        return NextResponse.json(
          { error: "File type not allowed" },
          { status: 400 }
        )
      }
    }

    // Validate file size (max 10MB for activities and tasks, 5MB for others)
    const maxSize = (type === "activities" || type === "tasks") ? 10 * 1024 * 1024 : 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File size must be less than ${maxSize / 1024 / 1024}MB` },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const timestamp = Date.now()
    const originalName = file.name.replace(/\s+/g, "-")
    const filename = `${timestamp}-${originalName}`

    // Save to public/uploads/{type}
    const uploadDir = path.join(process.cwd(), "public", "uploads", type)
    const filepath = path.join(uploadDir, filename)

    // Create directory if it doesn't exist
    await mkdir(uploadDir, { recursive: true })

    await writeFile(filepath, buffer)

    // Return the public URL
    const publicUrl = `/uploads/${type}/${filename}`

    return NextResponse.json({ url: publicUrl })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    )
  }
}
