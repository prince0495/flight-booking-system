import prisma from "@/lib/prisma";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const JWT_SECRET = new TextEncoder().encode("james");

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.userId as string;

    const tickets = await prisma.ticket.findMany({
      where: { user_id: userId },
      orderBy: { created_at: "desc" },
      include: {
        user: true,
        flight: {
          include: {
            aircraft: {
              include: {
                airline: true,
              },
            },
            departure_airport: true,
            arrival_airport: true,
          },
        },
      },
    });

    return NextResponse.json({ tickets, success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch tickets" },
      { status: 500 }
    );
  }
}
