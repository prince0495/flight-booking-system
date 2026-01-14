import prisma from "@/lib/prisma";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const JWT_SECRET = new TextEncoder().encode("james");

type PrismaTx = Parameters<
  Parameters<typeof prisma.$transaction>[0]
>[0];


export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const flightId = body?.flightId;
        const travelClass = body?.travelClass;
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        
        if(!flightId || !token || !travelClass) {
            return NextResponse.json({success: false, msg: 'Data not found2'}, {status: 403});
        }
        const { payload } = await jwtVerify(token, JWT_SECRET);
        const userId = payload?.userId as string;
        if(!userId) {
            return NextResponse.json({success: false, msg: 'User not found'}, {status: 403});
        }
        const flight = await prisma.flight.findUnique({
            where: {
                id: flightId
            },
            select: {
                aircraft: {
                    select: {
                        airline: true,
                        economy_seat_price: true,
                        business_seat_price: true,
                        firstclass_seat_price: true,
                        model: true,
                    }
                },
                departure_airport: true,
                arrival_airport: true,
                flight_number: true,
                departure_time: true,
                duration_minutes: true,
            }
        });
        if(!flight) {
            return NextResponse.json({success: false, msg: 'flight not found'}, {status: 403});
        }
        const wallet = await prisma.wallet.findUnique({
            where: {user_id: userId}
        });
        if(!wallet) {
            return NextResponse.json({success: false, msg: 'Wallet not found'}, {status: 403});
        }
        const previousTickets = await prisma.ticket.findMany({
            where: {
                user_id: userId,
                flight_id: flightId,
            },
            orderBy: {
                created_at: 'desc',
            },
            take: 3
        });
        let isPriceIncreased = false;
        if(previousTickets.length < 3) isPriceIncreased = false;
        else {
            const date = previousTickets[previousTickets.length-3].created_at;
            const diff = Math.abs(new Date().getTime() - new Date(date).getTime());
            if(diff <= 10 * 60 * 1000) {
                isPriceIncreased = true;
            }
        }
        let price = flight.aircraft.economy_seat_price;
        if(travelClass === 'business') {
            price = flight.aircraft.business_seat_price;
        }
        else if(travelClass === 'firstclass') {
            price = flight.aircraft.firstclass_seat_price;
        }
        if(isPriceIncreased) {
            price = price + (price*10 / 100);
        }
        if(wallet.amount < price) {
            return NextResponse.json({success: false, msg: 'Insufficient amount'}, {status: 403});
        }
        console.log('new wallet amount = ', (wallet.amount - price) );
        const ticket = await prisma.$transaction(async (tx: PrismaTx) => {
            await tx.wallet.update({
                where: {user_id: userId},
                data: {
                    amount: (wallet.amount - price)
                }
            });
            return await tx.ticket.create({
                data: {
                    user_id: userId,
                    flight_id: flightId,
                    amount: price,
                },
                select: {
                    user: true,
                    id: true,
                    created_at: true
                }
            });
        });
        
        return NextResponse.json(ticket, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({error: 'Failed to book ticket'}, { status: 500 })
    }
}

export async function GET(req: NextRequest, {params}: {params: Promise<{ flightId: string }>}) {
    try {
        const { flightId } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if(!token) {
            return NextResponse.json({success: false, msg: 'Data not found'}, {status: 403});
        }
        const { payload } = await jwtVerify(token, JWT_SECRET);
        const userId = payload?.userId as string;
        if(!userId) {
            return NextResponse.json({success: false, msg: 'User not found'}, {status: 403});
        }
        const wallet = await prisma.wallet.findUnique({
            where: { user_id: userId },
            select: {
                amount: true,
            }
        });
        if(!wallet) {
            return NextResponse.json({success: false, msg: 'Wallet not found'}, {status: 403});
        }
        const flight = await prisma.flight.findUnique({
            where: {
                id: flightId
            },
            select: {
                aircraft: {
                    select: {
                        airline: true,
                        economy_seat_price: true,
                        business_seat_price: true,
                        firstclass_seat_price: true,
                        model: true,
                    }
                },
                departure_airport: true,
                arrival_airport: true,
                flight_number: true,
                departure_time: true,
                duration_minutes: true,
            }
        });
        if(!flight) {
            return NextResponse.json({success: false, msg: 'flight not found'}, {status: 403});
        }

        const previousTickets = await prisma.ticket.findMany({
            where: {
                user_id: userId,
                flight_id: flightId,
            },
            orderBy: {
                created_at: 'desc',
            },
            take: 3,
            select: {id: true, created_at: true}
        });
        let isPriceIncreased = false;
        if(previousTickets.length < 3) isPriceIncreased = false;
        else {
            const date = previousTickets[previousTickets.length-3].created_at;
            const diff = Math.abs(new Date().getTime() - new Date(date).getTime());
            if(diff <= 10 * 60 * 1000) {
                isPriceIncreased = true;
            }
        }
        
        return NextResponse.json({walletAmount: wallet.amount, flight, isPriceIncreased, success: true});
    } catch (error) {
        console.log(error);
        return NextResponse.json({error: 'Failed to checkout', success: false}, { status: 500 })
    }
}