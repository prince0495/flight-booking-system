"use client";

import { use, useEffect, useState } from "react";
import { Loader2, CheckCircle2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import jsPDF from "jspdf";
import { useRouter } from "next/navigation";

type TravelClass = "economy" | "business" | "firstclass";

interface Airport {
  code: string;
  city: string;
}

interface Airline {
  name: string;
  code: string;
}

interface Aircraft {
  model: string;
  airline: Airline;
  economy_seat_price: number;
  business_seat_price: number;
  firstclass_seat_price: number;
}

interface Flight {
  flight_number: string;
  departure_time: string;
  duration_minutes: number;
  departure_airport: Airport;
  arrival_airport: Airport;
  aircraft: Aircraft;
}

interface User {
  name: string;
  email: string;
}

interface Ticket {
  id: string;
  price: number;
  created_at: string;
  user: User;
}

interface CheckoutData {
  flight: Flight;
  walletAmount: number;
  isPriceIncreased: boolean;
}

type Props = {
  params: Promise<{
    flightId: string;
  }>;
};

export default function FlightCheckoutPage({ params }: Props) {
  const { flightId } = use(params);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [selectedClass, setSelectedClass] =
    useState<TravelClass>("economy");
  const [data, setData] = useState<CheckoutData | null>(null);
  const [ticket, setTicket] = useState<Ticket | null>(null);

  const router = useRouter();

  const fetchCheckout = async () => {
    setLoading(true);
    const res = await fetch(`/api/user/checkout/${flightId}`);
    const json = await res.json();
    console.log(json);

    setData(json);
    setLoading(false);
  };

  useEffect(() => {
    fetchCheckout();
  }, []);

  const getPrice = (base: number) =>
    data!.isPriceIncreased ? Math.round(base * 1.1) : base;

  const handleCheckout = async () => {
    setBooking(true);
    const res = await fetch(`/api/user/checkout/${flightId}`, {
      method: "POST",
      body: JSON.stringify({
        flightId,
        travelClass: selectedClass,
      }),
    });

    const json = await res.json();
    console.log(json);

    setTicket(json);
    setBooking(false);
  };

  const downloadPDF = () => {
    if (!ticket || !data) return;

    const doc = new jsPDF();

    const flight = data.flight;
    const aircraft = flight.aircraft;
    const airline = aircraft.airline;
    const user = ticket.user;
    const wallet = data.walletAmount;

    let y = 20;

    doc.setFontSize(18);
    doc.text("FLIGHT TICKET", 20, y);
    y += 10;

    doc.setFontSize(10);
    doc.text(`Ticket ID: ${ticket.id}`, 20, y);
    y += 8;

    doc.line(20, y, 190, y);
    y += 10;

    doc.setFontSize(12);
    doc.text("Passenger Details", 20, y);
    y += 6;

    doc.setFontSize(10);
    doc.text(`Name: ${user.name}`, 20, y);
    y += 5;
    doc.text(`Email: ${user.email}`, 20, y);
    y += 8;

    doc.setFontSize(12);
    doc.text("Flight Details", 20, y);
    y += 6;

    doc.setFontSize(10);
    doc.text(
      `Airline: ${airline.name} (${airline.code})`,
      20,
      y
    );
    y += 5;

    doc.text(`Aircraft: ${aircraft.model}`, 20, y);
    y += 5;

    doc.text(
      `Flight Number: ${flight.flight_number}`,
      20,
      y
    );
    y += 8;

    doc.setFontSize(12);
    doc.text("Route", 20, y);
    y += 6;

    doc.setFontSize(10);
    doc.text(
      `${flight.departure_airport.city} (${flight.departure_airport.code}) → ${flight.arrival_airport.city} (${flight.arrival_airport.code})`,
      20,
      y
    );
    y += 8;

    doc.setFontSize(12);
    doc.text("Schedule", 20, y);
    y += 6;

    doc.setFontSize(10);
    doc.text(
      `Departure: ${new Date(
        flight.departure_time
      ).toLocaleString()}`,
      20,
      y
    );
    y += 5;

    doc.text(
      `Duration: ${flight.duration_minutes} minutes`,
      20,
      y
    );
    y += 8;

    doc.setFontSize(12);
    doc.text("Booking Information", 20, y);
    y += 6;

    doc.setFontSize(10);
    doc.text(
      `Class: ${selectedClass.toUpperCase()}`,
      20,
      y
    );
    y += 5;

    doc.text(`Price Paid: $${ticket.price}`, 20, y);
    y += 5;

    doc.text(
      `Booked On: ${new Date(
        ticket.created_at
      ).toLocaleString()}`,
      20,
      y
    );
    y += 10;

    doc.line(20, y, 190, y);
    y += 8;

    doc.setFontSize(9);
    doc.text(
      "This is a system-generated ticket. Please carry a valid ID proof during boarding.",
      20,
      y
    );

    doc.save(`ticket-${ticket.id}.pdf`);
  };

  if (loading)
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader2 className="animate-spin text-slate-400" />
      </div>
    );

  const flight = data!.flight;
  const aircraft = flight.aircraft;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Flight Summary */}
      {aircraft && aircraft.airline && flight && (
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-bold">
            {flight.departure_airport.code} →{" "}
            {flight.arrival_airport.code}
          </h2>
          <p className="text-slate-500">
            {flight.departure_airport.city} to{" "}
            {flight.arrival_airport.city}
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-500">Departure</p>
              <p className="font-semibold">
                {new Date(
                  flight.departure_time
                ).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-slate-500">Aircraft</p>
              <p className="font-semibold">
                {aircraft.airline.name} –{" "}
                {aircraft.model}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Wallet */}
      <Card className="p-4 flex justify-between items-center">
        <span className="text-slate-600">Wallet Balance</span>
        <span className="font-bold text-lg text-green-600">
          ${data!.walletAmount}
        </span>
      </Card>

      {/* Pricing */}
      {aircraft && (
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold text-lg">
            Select Travel Class
          </h3>

          {(
            ["economy", "business", "firstclass"] as TravelClass[]
          ).map(cls => {
            const base =
              cls === "economy"
                ? aircraft.economy_seat_price
                : cls === "business"
                ? aircraft.business_seat_price
                : aircraft.firstclass_seat_price;

            return (
              <label
                key={cls}
                className={`border rounded-lg p-4 flex justify-between items-center cursor-pointer ${
                  selectedClass === cls
                    ? "border-blue-600 bg-blue-50"
                    : "border-slate-200"
                }`}
              >
                <div>
                  <p className="font-semibold capitalize">
                    {cls}
                  </p>
                  {data!.isPriceIncreased && (
                    <p className="text-xs text-red-500">
                      10% surge applied
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold">
                    ${getPrice(base)}
                  </span>
                  <input
                    type="radio"
                    checked={selectedClass === cls}
                    onChange={() =>
                      setSelectedClass(cls)
                    }
                  />
                </div>
              </label>
            );
          })}
        </Card>
      )}

      {/* Checkout */}
      <Button
        onClick={handleCheckout}
        disabled={booking}
        className="w-full h-12 text-lg"
      >
        {booking ? (
          <Loader2 className="animate-spin" />
        ) : (
          "Confirm & Pay"
        )}
      </Button>

      {/* Success Modal */}
      {ticket && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-[400px] space-y-4">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 />
              <h3 className="font-bold text-lg">
                Booking Successful
              </h3>
            </div>

            <p className="text-sm text-slate-600">
              Your ticket has been booked successfully.
            </p>

            <div className="flex flex-col gap-3">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setTicket(null);
                  router.push("/home");
                }}
              >
                OK
              </Button>
              <Button
                className="w-full flex gap-2"
                onClick={downloadPDF}
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
