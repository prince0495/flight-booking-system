import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/admin/airlines
 * Fetch all registered airlines
 */
export async function GET() {
  try {
    const airlines = await prisma.airline.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        code: true,
      },
    });

    return NextResponse.json(airlines, { status: 200 });
  } catch (error) {
    console.error("GET /admin/airlines error:", error);
    return NextResponse.json(
      { message: "Failed to fetch airlines" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/airlines
 * Register a new airline
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, code } = body;

    if (!name || !code) {
      return NextResponse.json(
        { message: "Name and code are required" },
        { status: 400 }
      );
    }

    const airline = await prisma.airline.create({
      data: {
        name,
        code: code.toUpperCase(),
      },
    });

    return NextResponse.json(airline, { status: 201 });
  } catch (error) {
    console.error("POST /admin/airlines error:", error);
    return NextResponse.json(
      { message: "Failed to create airline" },
      { status: 500 }
    );
  }
}
