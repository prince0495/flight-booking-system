"use client";

import { useEffect, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";

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
  amount: number;
  created_at: string;
  user: User;
  flight: Flight;
}

interface TicketsResponse {
  tickets: Ticket[];
}

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/tickets")
      .then((res) => res.json())
      .then((data: TicketsResponse) => {
        setTickets(data.tickets || []);
        setLoading(false);
      });
  }, []);

  const downloadPDF = (ticket: Ticket) => {
    const doc = new jsPDF();

    const flight = ticket.flight;
    const aircraft = flight.aircraft;
    const airline = aircraft.airline;
    const user = ticket.user;

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
    doc.text(`Flight Number: ${flight.flight_number}`, 20, y);
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
    doc.text(`Price Paid: $${ticket.amount}`, 20, y);
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

  if (loading) {
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">
        My Tickets
      </h1>

      {tickets.length === 0 ? (
        <p className="text-slate-500">
          No tickets booked yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white border rounded-xl p-5 space-y-3 shadow-sm"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">
                  {ticket.flight.departure_airport.code} →{" "}
                  {ticket.flight.arrival_airport.code}
                </h3>
                <span className="text-sm text-slate-500">
                  #{ticket.flight.flight_number}
                </span>
              </div>

              <p className="text-sm text-slate-600">
                {ticket.flight.aircraft.airline.name} •{" "}
                {ticket.flight.aircraft.model}
              </p>

              <p className="text-sm">
                Departure:{" "}
                {new Date(
                  ticket.flight.departure_time
                ).toLocaleString()}
              </p>

              <div className="flex justify-between items-center pt-3">
                <span className="font-semibold text-green-600">
                  ${ticket.amount}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => downloadPDF(ticket)}
                  className="flex gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
