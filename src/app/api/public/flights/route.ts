import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { startOfDay, endOfDay } from "date-fns";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const source = searchParams.get("source"); // City name or code
  const destination = searchParams.get("destination");
  const dateParam = searchParams.get("date");
  const limit = parseInt(searchParams.get("limit") || "10");

  const queryDate = dateParam ? new Date(dateParam) : new Date();
  
  try {
    const flights = await prisma.flight.findMany({
      where: {
        departure_time: {
          gte: startOfDay(queryDate),
          lte: endOfDay(queryDate),
        },
        ...(source && {
          departure_airport: {
            OR: [
              { city: { contains: source, mode: 'insensitive' } },
              { code: { contains: source, mode: 'insensitive' } }
            ]
          }
        }),
        ...(destination && {
          arrival_airport: {
            OR: [
              { city: { contains: destination, mode: 'insensitive' } },
              { code: { contains: destination, mode: 'insensitive' } }
            ]
          }
        }),
      },
      take: limit,
      include: {
        departure_airport: true,
        arrival_airport: true,
        aircraft: {
          include: { airline: true }
        }
      },
      orderBy: { departure_time: 'asc' }
    });

    return NextResponse.json(flights);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Failed to fetch flights" }, { status: 500 });
  }
}