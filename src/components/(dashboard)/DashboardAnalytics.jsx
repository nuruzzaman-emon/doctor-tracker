"use client";

import { useEffect, useState } from "react";
import LoadingSkeleton from "@/components/(others)/LoadingSkeleton";

const metrics = [
  ["totalDoctors", "Total doctors", "Doctors in the directory"],
  ["totalPatients", "Total patients", "Patients in the system"],
];

function ChartPanel({ title, description, items, labelFor, valueFor }) {
  const maximum = Math.max(1, ...items.map(valueFor));

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="font-semibold text-slate-900">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
      {items.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">No data available yet.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {items.map((item, index) => {
            const value = valueFor(item);
            const width = value === 0 ? 0 : Math.max(4, (value / maximum) * 100);
            return (
              <div key={`${labelFor(item)}-${index}`}>
                <div className="mb-1.5 flex justify-between gap-3 text-sm">
                  <span className="truncate font-medium text-slate-700">{labelFor(item)}</span>
                  <span className="shrink-0 text-slate-500">{value}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
                  <div className="h-full rounded-full bg-teal-600" style={{ width: `${width}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default function DashboardAnalytics() {
  const [stats, setStats] = useState(null);
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/stats`, {
      credentials: "include",
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || "Could not load analytics.");
        setStats(result);
        setStatus("ready");
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          setErrorMessage(error.message || "Could not load analytics.");
          setStatus("error");
        }
      });
    return () => controller.abort();
  }, []);

  if (status === "loading") return <LoadingSkeleton type="dashboard" />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Administration</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
        <p className="mt-2 text-slate-600">An overview of doctors, patients, and clinic activity.</p>
      </div>

      {status === "error" && <p role="alert" className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{errorMessage}</p>}

      <section className="mt-7 grid gap-4 sm:grid-cols-2" aria-label="Key metrics">
        {metrics.map(([key, label, note]) => (
          <article key={key} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <p className="mt-3 text-3xl font-bold tabular-nums text-slate-900">
              {status === "loading" ? "…" : Number(stats?.[key] ?? 0).toLocaleString()}
            </p>
            <p className="mt-2 text-xs text-slate-500">{note}</p>
          </article>
        ))}
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <ChartPanel title="Patients per doctor" description="Current patient load by doctor" items={stats?.patientsPerDoctor || []} labelFor={(item) => item.doctorName} valueFor={(item) => item.patientCount} />
        <ChartPanel title="Patient activity over time" description="Monthly patient registrations over the last six months" items={stats?.patientActivity || []} labelFor={(item) => item.month} valueFor={(item) => item.count} />
      </section>
    </div>
  );
}
