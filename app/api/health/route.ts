import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`

    // Check environment variables
    const checks = {
      database: "✅ Connected",
      nextauth_url: process.env.NEXTAUTH_URL || "❌ Missing",
      nextauth_secret: process.env.NEXTAUTH_SECRET ? "✅ Set" : "❌ Missing",
      r2_endpoint: process.env.R2_ENDPOINT || "❌ Missing",
      r2_access_key: process.env.R2_ACCESS_KEY_ID ? "✅ Set" : "❌ Missing",
      r2_secret: process.env.R2_SECRET_ACCESS_KEY ? "✅ Set" : "❌ Missing",
      r2_bucket: process.env.R2_BUCKET_NAME || "❌ Missing",
      r2_public_url: process.env.R2_PUBLIC_URL || "❌ Missing",
      redis_url: process.env.REDIS_URL ? "✅ Set" : "❌ Missing",
      resend_key: process.env.RESEND_API_KEY ? "✅ Set" : "❌ Missing",
      email_from: process.env.EMAIL_FROM || "❌ Missing",
    }

    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      checks,
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
        error: error,
      },
      { status: 500 }
    )
  }
}
