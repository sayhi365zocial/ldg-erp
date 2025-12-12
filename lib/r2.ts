import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"

// Initialize R2 client
const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

export interface UploadToR2Options {
  file: File
  folder: string // companies, contacts, tasks, activities
}

export async function uploadToR2({ file, folder }: UploadToR2Options): Promise<string> {
  try {
    // Generate unique filename
    const timestamp = Date.now()
    const originalName = file.name.replace(/\s+/g, "-")
    const filename = `${timestamp}-${originalName}`
    const key = `${folder}/${filename}`

    // Convert File to Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to R2
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
      Body: buffer,
      ContentType: file.type,
      ContentLength: file.size,
    })

    await r2Client.send(command)

    // Return public URL
    const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`
    return publicUrl
  } catch (error) {
    console.error("R2 upload error:", error)
    throw new Error("Failed to upload file to R2")
  }
}

export { r2Client }
