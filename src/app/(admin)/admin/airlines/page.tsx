"use client";

import { useState, useEffect } from "react";
import { Building2, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AirlineManager() {
  const [airlines, setAirlines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchAirlines = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/airlines");
    const data = await res.json();
    setAirlines(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAirlines();
  }, []);

  const handleSubmit = async () => {
    if (!name || !code) return;

    setSubmitting(true);

    const res = await fetch("/api/admin/airlines", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        code: code.toUpperCase(),
      }),
    });

    if (res.ok) {
      setName("");
      setCode("");
      setShowForm(false);
      fetchAirlines();
    }

    setSubmitting(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Airlines</h2>
          <p className="text-slate-500 text-sm">
            Registered carriers and flight operators.
          </p>
        </div>
        <Button
          className="bg-slate-900 flex gap-2"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus className="h-4 w-4" />
          Register New Carrier
        </Button>
      </div>

      {/* Create Airline Form */}
      {showForm && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Airline Name (e.g. Indigo)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Code (e.g. 6E)"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="uppercase"
          />
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-slate-900 min-w-[120px]"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Create"
            )}
          </Button>
        </div>
      )}

      {/* Airline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <Loader2 className="animate-spin text-slate-400" />
        ) : (
          airlines.map((airline) => (
            <div
              key={airline.id}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4"
            >
              <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">{airline.name}</h4>
                <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">
                  {airline.code}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
