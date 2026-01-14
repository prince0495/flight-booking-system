"use client";

import { useState, useEffect } from "react";
import { Plus, Calendar as CalIcon, Clock, PlaneTakeoff, PlaneLanding, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

export default function FlightScheduler() {
  const [flights, setFlights] = useState([]);
  const [airports, setAirports] = useState([]);
  const [aircrafts, setAircrafts] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchMetadata();
    fetchFlights(selectedDate);
  }, [selectedDate]);

  const fetchMetadata = async () => {
    const [airRes, airCraftRes] = await Promise.all([
      fetch("/api/admin/airports"),
      fetch("/api/admin/aircrafts")
    ]);
    setAirports(await airRes.json());
    setAircrafts(await airCraftRes.json());
  };

  const fetchFlights = async (date: Date) => {
    setLoading(true);
    const res = await fetch(`/api/admin/flights?date=${date.toISOString()}`);
    setFlights(await res.json());
    setLoading(false);
  };

  const handleCreateFlight = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData);

    await fetch("/api/admin/flights", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    
    fetchFlights(selectedDate);
    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* HEADER & DATE SELECTOR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Flight Operations</h1>
          <p className="text-slate-500">Managing schedule for {format(selectedDate, "PPP")}</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl">
          <Input 
            type="date" 
            className="bg-transparent border-none focus-visible:ring-0 w-40" 
            value={format(selectedDate, "yyyy-MM-dd")}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* SCHEDULER FORM */}
        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit sticky top-8">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Plus className="h-5 w-5 text-blue-600" /> New Flight Assignment
          </h3>
          <form onSubmit={handleCreateFlight} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-400">Select Aircraft</label>
              <select name="aircraftId" required className="w-full p-2.5 rounded-lg border bg-slate-50 text-sm">
                <option value="">Choose an aircraft...</option>
                {aircrafts.map((a: any) => (
                  <option key={a.id} value={a.id}>{a.airline.name} — {a.model}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-400">Departure</label>
                <select name="departure_airport_id" required className="w-full p-2.5 rounded-lg border bg-slate-50 text-sm">
                  {airports.map((ap: any) => <option key={ap.id} value={ap.id}>{ap.code}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-400">Arrival</label>
                <select name="arrival_airport_id" required className="w-full p-2.5 rounded-lg border bg-slate-50 text-sm">
                  {airports.map((ap: any) => <option key={ap.id} value={ap.id}>{ap.code}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-400">Dep. Time</label>
                <Input name="departure_time" type="datetime-local" required className="bg-slate-50" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-400">Duration (Min)</label>
                <Input name="duration_minutes" type="number" placeholder="120" required className="bg-slate-50" />
              </div>
            </div>

            <Button disabled={isSubmitting} className="w-full py-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-100">
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Confirm Schedule"}
            </Button>
          </form>
        </section>

        {/* FLIGHT LIST */}
        <section className="xl:col-span-2 space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-2" />
              <p className="text-slate-400">Loading flight roster...</p>
            </div>
          ) : flights.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              <CalIcon className="h-8 w-8 text-slate-300 mb-2" />
              <p className="text-slate-400">No flights scheduled for this day.</p>
            </div>
          ) : (
            flights.map((flight: any) => (
              <div key={flight.id} className="group bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between hover:border-blue-300 transition-all shadow-sm hover:shadow-md">
                <div className="flex items-center gap-6">
                  <div className="bg-blue-50 p-3 rounded-xl">
                    <PlaneTakeoff className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 flex items-center gap-2">
                      #{flight.flight_number} 
                      <span className="text-xs font-normal text-slate-400">|</span> 
                      <span className="text-sm text-blue-600">{flight.aircraft.airline.name}</span>
                    </h4>
                    <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                      <span className="font-bold text-slate-700">{flight.departure_airport.code}</span>
                      <div className="h-[2px] w-8 bg-slate-200 relative">
                        <div className="absolute -top-1 right-0 w-2 h-2 rounded-full bg-slate-300" />
                      </div>
                      <span className="font-bold text-slate-700">{flight.arrival_airport.code}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center justify-end gap-2 text-slate-900 font-bold">
                    <Clock className="h-4 w-4 text-slate-400" />
                    {format(new Date(flight.departure_time), "HH:mm")}
                  </div>
                  <p className="text-xs text-slate-400 font-medium">{flight.duration_minutes}m flight time</p>
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
}