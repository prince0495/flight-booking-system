"use client";

import { useState, useEffect } from "react";
import { Plane, DollarSign, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AircraftManager() {
  const [aircrafts, setAircrafts] = useState<any[]>([]);
  const [airlines, setAirlines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [model, setModel] = useState("");
  const [airlineId, setAirlineId] = useState("");
  const [economySeats, setEconomySeats] = useState(0);
  const [businessSeats, setBusinessSeats] = useState(0);
  const [firstSeats, setFirstSeats] = useState(0);
  const [economyPrice, setEconomyPrice] = useState(0);
  const [businessPrice, setBusinessPrice] = useState(0);
  const [firstPrice, setFirstPrice] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    const [aircraftData, airlineData] = await Promise.all([
      fetch("/api/admin/aircrafts").then(res => res.json()),
      fetch("/api/admin/airlines").then(res => res.json())
    ]);
    setAircrafts(aircraftData);
    setAirlines(airlineData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!model || !airlineId) return;

    setSubmitting(true);

    await fetch("/api/admin/aircrafts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        airlineId,
        economy_seats: economySeats,
        business_seats: businessSeats,
        firstclass_seats: firstSeats,
        economy_seat_price: economyPrice,
        business_seat_price: businessPrice,
        firstclass_seat_price: firstPrice,
      }),
    });

    setModel("");
    setAirlineId("");
    setEconomySeats(0);
    setBusinessSeats(0);
    setFirstSeats(0);
    setEconomyPrice(0);
    setBusinessPrice(0);
    setFirstPrice(0);

    fetchData();
    setSubmitting(false);
  };

  return (
    <div className="p-6 space-y-8">
      <header>
        <h2 className="text-2xl font-bold text-slate-900">Fleet Management</h2>
        <p className="text-slate-500 text-sm">
          Configure aircraft capacity and base fare classes.
        </p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* ADD AIRCRAFT */}
        <div className="xl:col-span-1 space-y-4 bg-slate-50 p-6 rounded-2xl border">
          <h3 className="font-bold flex items-center gap-2">
            <Plane className="h-4 w-4" /> Add Aircraft
          </h3>

          <Input
            placeholder="Aircraft Model"
            value={model}
            onChange={e => setModel(e.target.value)}
          />

          <select
            value={airlineId}
            onChange={e => setAirlineId(e.target.value)}
            className="w-full p-2 rounded-lg border bg-white text-sm"
          >
            <option value="">Select Airline...</option>
            {airlines.map(a => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>

          <div className="space-y-3 pt-3 border-t">
            {/* Economy */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                Eco seats
                <Input type="number" placeholder="Eco Seats" value={economySeats}
                onChange={e => setEconomySeats(+e.target.value)} />
              </div>
              <div>
                Price
                <Input type="number" placeholder="Price" value={economyPrice}
                onChange={e => setEconomyPrice(+e.target.value)} />
              </div>
            </div>

            {/* Business */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                Biz seats
                <Input type="number" placeholder="Biz Seats" value={businessSeats}
                onChange={e => setBusinessSeats(+e.target.value)} />
              </div>
              <div>
                Price
                <Input type="number" placeholder="Price" value={businessPrice}
                onChange={e => setBusinessPrice(+e.target.value)} />
              </div>
            </div>

            {/* First */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                First-class seats
                <Input type="number" placeholder="First Seats" value={firstSeats}
                onChange={e => setFirstSeats(+e.target.value)} />
              </div>
              <div>
                Price
                <Input type="number" placeholder="Price" value={firstPrice}
                onChange={e => setFirstPrice(+e.target.value)} />
              </div>
            </div>
          </div>

          <Button onClick={handleSubmit} disabled={submitting}
            className="w-full bg-blue-600">
            {submitting ? <Loader2 className="animate-spin" /> : "Add Aircraft"}
          </Button>
        </div>

        {/* LIST */}
        <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : aircrafts.map(ac => (
            <div key={ac.id}
              className="bg-white border p-5 rounded-2xl">
              <h4 className="font-bold">{ac.model}</h4>
              <p className="text-sm text-blue-600">{ac.airline.name}</p>
              <p className="text-xs text-slate-500 mt-2">
                Total Seats: {ac.total_seats}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
