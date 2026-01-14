"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  Plane,
  Calendar,
  MapPin,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface Airport {
  code: string;
}

interface Airline {
  name: string;
}

interface Aircraft {
  economy_seat_price: number;
  airline: Airline;
}

interface Flight {
  id: string;
  departure_time: string;
  duration_minutes: number;
  departure_airport: Airport;
  arrival_airport: Airport;
  aircraft: Aircraft;
}

export function FlightListing() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    source: searchParams.get("source") || "",
    destination: searchParams.get("destination") || "",
    date: searchParams.get("date") || format(new Date(), "yyyy-MM-dd"),
  });

  useEffect(() => {
    fetchFlights();
  }, [searchParams]);

  const fetchFlights = async () => {
    setLoading(true);
    const params = new URLSearchParams(searchParams.toString());
    const res = await fetch(`/api/public/flights?${params.toString()}`);
    const data = await res.json();
    setFlights(data);
    setLoading(false);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (filters.source) params.set("source", filters.source);
    if (filters.destination)
      params.set("destination", filters.destination);
    if (filters.date) params.set("date", filters.date);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* HERO SEARCH SECTION */}
      <div className="bg-slate-900 pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto space-y-8">
          <h1 className="text-4xl font-bold text-white text-center">
            Where would you like to go?
          </h1>

          <div className="bg-white p-2 rounded-2xl shadow-2xl grid grid-cols-1 md:grid-cols-4 gap-2">
            <div className="relative border-r border-slate-100 px-4 py-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                From
              </label>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-500" />
                <input
                  className="w-full outline-none text-slate-700 font-medium"
                  placeholder="Source City"
                  value={filters.source}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      source: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="relative border-r border-slate-100 px-4 py-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                To
              </label>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald-500" />
                <input
                  className="w-full outline-none text-slate-700 font-medium"
                  placeholder="Destination City"
                  value={filters.destination}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      destination: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="relative border-r border-slate-100 px-4 py-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                Date
              </label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-400" />
                <input
                  type="date"
                  className="w-full outline-none text-slate-700 font-medium"
                  value={filters.date}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      date: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <Button
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700 h-full rounded-xl py-6 md:py-0"
            >
              <Search className="h-5 w-5 mr-2" /> Search Flights
            </Button>
          </div>
        </div>
      </div>

      {/* RESULTS SECTION */}
      <div className="max-w-4xl mx-auto mt-12 px-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">
            Available Flights
          </h2>
          <span className="text-sm text-slate-500">
            {flights.length} results found
          </span>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-32 w-full bg-white rounded-2xl animate-pulse border border-slate-200"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {flights.map((flight) => (
              <div
                key={flight.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between hover:shadow-xl transition-all cursor-pointer group"
                onClick={() =>
                  router.push(`/checkout/${flight.id}`)
                }
              >
                <div className="flex items-center gap-6 w-full md:w-auto">
                  <div className="text-center min-w-[80px]">
                    <p className="text-2xl font-bold text-slate-900">
                      {format(
                        new Date(flight.departure_time),
                        "HH:mm"
                      )}
                    </p>
                    <p className="text-sm font-bold text-blue-600">
                      {flight.departure_airport.code}
                    </p>
                  </div>

                  <div className="flex flex-col items-center flex-1 md:flex-none">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">
                      {flight.duration_minutes}m
                    </p>
                    <div className="flex items-center gap-2 w-32">
                      <div className="h-1 w-full bg-slate-100 rounded-full relative overflow-hidden">
                        <div className="absolute inset-0 bg-blue-500 w-1/2 translate-x-1/2" />
                      </div>
                      <Plane className="h-4 w-4 text-slate-300 rotate-90" />
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">
                      Non-stop
                    </p>
                  </div>

                  <div className="text-center min-w-[80px]">
                    <p className="text-2xl font-bold text-slate-900">
                      {format(
                        new Date(
                          new Date(
                            flight.departure_time
                          ).getTime() +
                            flight.duration_minutes * 60000
                        ),
                        "HH:mm"
                      )}
                    </p>
                    <p className="text-sm font-bold text-emerald-600">
                      {flight.arrival_airport.code}
                    </p>
                  </div>
                </div>

                <div className="mt-4 md:mt-0 md:text-right border-t md:border-t-0 pt-4 md:pt-0 w-full md:w-auto flex justify-between md:block">
                  <div>
                    <p className="text-xs text-slate-400 font-medium">
                      {flight.aircraft.airline.name}
                    </p>
                    <p className="text-2xl font-black text-slate-900">
                      ${flight.aircraft.economy_seat_price}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    className="md:mt-2 text-blue-600 group-hover:bg-blue-50"
                  >
                    Select{" "}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
