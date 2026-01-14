import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const aircrafts = await prisma.aircraft.findMany({
    include: { airline: true },
  });
  return NextResponse.json(aircrafts);
}

export async function POST(req: Request) {
  const body = await req.json();

  const totalSeats =
    body.economy_seats +
    body.business_seats +
    body.firstclass_seats;

  const aircraft = await prisma.aircraft.create({
    data: {
      model: body.model,
      airlineId: body.airlineId,
      economy_seats: body.economy_seats,
      business_seats: body.business_seats,
      firstclass_seats: body.firstclass_seats,
      economy_seat_price: body.economy_seat_price,
      business_seat_price: body.business_seat_price,
      firstclass_seat_price: body.firstclass_seat_price,
      total_seats: totalSeats,
    },
  });

  return NextResponse.json(aircraft);
}