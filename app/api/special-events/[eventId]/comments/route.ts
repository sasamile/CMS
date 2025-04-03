import { db } from "@/lib/db";
import { NextResponse } from "next/server";

const allowedOrigin = process.env.NEXT_PUBLIC_ALLOWED_ORIGIN as string;

export async function POST(
  req: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    const { eventId } = params;

    if (!eventId) {
      return new NextResponse("Event ID is required", { status: 400 });
    }

    const body = await req.json();
    const { name, comment } = body;

    if (!name || !comment) {
      return new NextResponse("Name and comment are required", { status: 400 });
    }

    const headers = new Headers({
      "Access-Control-Allow-Origin": allowedOrigin,
      "Access-Control-Allow-Methods": "POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    });

    // Verificar si el evento existe
    const event = await db.specialEvent.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return new NextResponse("Event not found", { status: 404 });
    }

    // Crear el comentario
    const newComment = await db.specialEventComment.create({
      data: {
        name,
        comment,
        eventId,
      },
    });

    return NextResponse.json(newComment, { headers });
  } catch (error) {
    console.error("[COMMENT_CREATE_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function OPTIONS() {
  const headers = new Headers({
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  });

  return new NextResponse(null, { headers });
}
