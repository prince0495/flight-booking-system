import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/admin/airports
 * Fetch all airports (Admin dashboard)
 */
export async function GET() {
  try {
    const airports = await prisma.airport.findMany({
      orderBy: { city: "asc" },
    });

    return NextResponse.json(airports, { status: 200 });
  } catch (error) {
    console.error("GET /admin/airports error:", error);
    return NextResponse.json(
      { message: "Failed to fetch airports" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/airports
 * Create a new airport
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      code,
      name,
      city,
      country,
      latitude,
      longitude,
    } = body;

    if (!code || !name || !city || !country || latitude == null || longitude == null) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const airport = await prisma.airport.create({
      data: {
        code: code.toUpperCase(),
        name,
        city,
        country,
        latitude,
        longitude,
      },
    });

    return NextResponse.json(airport, { status: 201 });
  } catch (error: any) {
    console.error("POST /admin/airports error:", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        { message: "Airport with this code already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: "Failed to create airport" },
      { status: 500 }
    );
  }
}
