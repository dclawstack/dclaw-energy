"use client";

import React, { useState } from "react";
import { Zap, BarChart3 } from "lucide-react";
import { api, EnergyReport, HourlyData } from "@/lib/api";

export default function DashboardPage() {
  const [facilityId, setFacilityId] = useState("");
  const [period, setPeriod] = useState<"Day" | "Week" | "Month">("Day");
  const [report, setReport] = useState<EnergyReport | null>(null);
  const [breakdown, setBreakdown] = useState<HourlyData[] | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleAnalyze(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setBreakdown(null);
    try {
      const result = await api<EnergyReport>("/reports", {
        method: "POST",
        body: JSON.stringify({ facility_id: facilityId, period }),
      });
      setReport(result);
      const bd = await api<HourlyData[]>(`/reports/${result.id}/breakdown`);
      setBreakdown(bd);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white px-6 py-4 flex items-center gap-3">
        <Zap className="h-6 w-6" style={{ color: "#FACC15" }} />
        <h1 className="text-xl font-bold" style={{ color: "#FACC15" }}>
          DClaw Energy
        </h1>
      </header>

      <section className="mx-auto max-w-2xl px-6 py-10">
        <h2 className="mb-6 text-2xl font-semibold text-slate-800">Dashboard</h2>

        <form onSubmit={handleAnalyze} className="mb-8 rounded-xl border bg-white p-6 shadow-sm">
          <div className="mb-4">
            <label htmlFor="facility" className="mb-1 block text-sm font-medium text-slate-700">
              Facility ID
            </label>
            <input
              id="facility"
              type="text"
              value={facilityId}
              onChange={(e) => setFacilityId(e.target.value)}
              placeholder="FAC-001"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#FACC15] focus:ring-1 focus:ring-[#FACC15]"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="period" className="mb-1 block text-sm font-medium text-slate-700">
              Period
            </label>
            <select
              id="period"
              value={period}
              onChange={(e) => setPeriod(e.target.value as "Day" | "Week" | "Month")}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#FACC15] focus:ring-1 focus:ring-[#FACC15]"
            >
              <option value="Day">Day</option>
              <option value="Week">Week</option>
              <option value="Month">Month</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ backgroundColor: "#FACC15", color: "#1f2937" }}
          >
            <BarChart3 className="h-4 w-4" />
            {loading ? "Analyzing..." : "Analyze Consumption"}
          </button>
        </form>

        {report && (
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-slate-800">Energy Report</h3>
            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-slate-50 p-3">
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Total kWh</dt>
                <dd className="mt-1 text-sm font-semibold text-slate-900">{report.total_kwh.toLocaleString()}</dd>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Peak hours</dt>
                <dd className="mt-1 text-sm text-slate-900">{report.peak_hours.join(", ")}</dd>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Wastage estimate</dt>
                <dd className="mt-1 text-sm text-slate-900">{report.wastage_estimate}</dd>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Savings opportunities</dt>
                <dd className="mt-1 text-sm text-slate-900">{report.savings_opportunities.join(", ")}</dd>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Report ID</dt>
                <dd className="mt-1 text-sm font-mono text-slate-900">{report.id}</dd>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Created at</dt>
                <dd className="mt-1 text-sm text-slate-900">{report.created_at}</dd>
              </div>
            </dl>

            {breakdown && breakdown.length > 0 && (
              <div className="mt-6">
                <h4 className="mb-3 text-sm font-semibold text-slate-700">Hourly Breakdown</h4>
                <div className="grid grid-cols-4 gap-2">
                  {breakdown.map((b, i) => (
                    <div key={i} className="rounded-lg bg-slate-50 p-3 text-center">
                      <div className="text-xs text-slate-500">{b.hour}</div>
                      <div className="mt-1 text-sm font-bold" style={{ color: "#FACC15" }}>{b.kwh} kWh</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
