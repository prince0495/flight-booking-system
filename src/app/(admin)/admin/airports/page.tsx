"use client";

import { useState, useEffect } from "react";
import { Plus, MapPin, Globe, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AirportManager() {
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchAirports();
  }, []);

  const fetchAirports = async () => {
    console.log('feting airports');
    
    const res = await fetch("/api/admin/airports");
    const data = await res.json();
    console.log('and got data => ',);
    
    setAirports(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData);

    try {
      await fetch("/api/admin/airports", {
        method: "POST",
        body: JSON.stringify({
          ...payload,
          latitude: parseFloat(payload.latitude as string),
          longitude: parseFloat(payload.longitude as string),
        }),
      });
      fetchAirports();
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Airports</h2>
          <p className="text-slate-500 text-sm">Manage global departure and arrival hubs.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CREATE FORM */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add New Airport
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="name" placeholder="Airport Name (e.g. Heathrow)" required />
            <Input name="code" placeholder="IATA Code (e.g. LHR)" required />
            <div className="grid grid-cols-2 gap-2">
              <Input name="city" placeholder="City" required />
              <Input name="country" placeholder="Country" required />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input name="latitude" type="number" step="any" placeholder="Latitude" required />
              <Input name="longitude" type="number" step="any" placeholder="Longitude" required />
            </div>
            <Button disabled={isSubmitting} className="w-full bg-blue-600">
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Register Airport"}
            </Button>
          </form>
        </div>

        {/* LIST TABLE */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-semibold text-slate-700">Code</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Name</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={3} className="p-8 text-center"><Loader2 className="animate-spin mx-auto text-slate-400" /></td></tr>
              ) : airports.map((ap: any) => (
                <tr key={ap.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-blue-600">{ap.code}</td>
                  <td className="px-4 py-3 text-slate-900">{ap.name}</td>
                  <td className="px-4 py-3 text-slate-500">{ap.city}, {ap.country}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}