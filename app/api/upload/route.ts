import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { uploadToR2 } from "@/lib/r2"

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

    // Upload to Cloudflare R2
    const publicUrl = await uploadToR2({
      file,
      folder: type,
    })

    return NextResponse.json({ url: publicUrl })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    )
  }
}
