import { db } from "@/lib/db"
import { NextResponse } from "next/server"

const allowedOrigin = process.env.NEXT_PUBLIC_ALLOWED_ORIGIN as string;

export async function GET(
  req: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    if (!params.eventId) {
      return new NextResponse("Event ID is required", { status: 400 })
    }

    const headers = new Headers({
      "Access-Control-Allow-Origin": allowedOrigin,
      "Access-Control-Allow-Methods": "GET,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    })

    const event = await db.specialEvent.findUnique({
      where: { id: params.eventId },
    })

    return NextResponse.json(event, { headers })
  } catch (error) {
    console.log("[EVENT_GET_ERROR]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function OPTIONS() {
  const headers = new Headers({
    "Access-Control-Allow-Origin": "http://localhost:3001",
    "Access-Control-Allow-Methods": "GET,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  })

  return new NextResponse(null, { headers })
}
