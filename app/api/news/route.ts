import { db } from "@/lib/db"
import { NextResponse } from "next/server"

const allowedOrigin = process.env.NEXT_PUBLIC_ALLOWED_ORIGIN as string;

export async function GET(req: Request) {
  try {
    const news = await db.news.findMany()

    const headers = new Headers({
      "Access-Control-Allow-Origin": allowedOrigin,
      "Access-Control-Allow-Methods": "GET,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    })

    return NextResponse.json(news, { headers })
  } catch (error) {
    console.log("[NEWS_GET_ERROR]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function OPTIONS() {
  const headers = new Headers({
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  })

  return new NextResponse(null, { headers })
}
