"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";

const initialForm = { name: "", condition: "", phone: "", email: "" };

export default function DoctorPatients({ doctorId }) {
  const [doctor, setDoctor] = useState(null);
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadPatients = useCallback(async (signal) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/doctors/${doctorId}/patients`, {
        credentials: "include",
        cache: "no-store",
        signal,
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || "Could not load this doctor's patients.");
      setDoctor(result.doctor);
      setPatients(result.patients || []);
      setError("");
    } catch (loadError) {
      if (loadError.name !== "AbortError") setError(loadError.message || "Could not load patients.");
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [doctorId]);

  useEffect(() => {
    const controller = new AbortController();
    void Promise.resolve().then(() => loadPatients(controller.signal));
    return () => controller.abort();
  }, [loadPatients]);

  const updateField = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const addPatient = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/doctors/${doctorId}/patients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || "Could not add patient.");
      setForm(initialForm);
      await loadPatients();
    } catch (saveError) {
      setError(saveError.message || "Could not add patient.");
    } finally {
      setSaving(false);
    }
  };

  const deletePatient = async (patient) => {
    const confirmation = await Swal.fire({
      title: "Remove this patient?",
      text: `${patient.name} will be removed from this doctor's list.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Remove patient",
      confirmButtonColor: "#be123c",
    });
    if (!confirmation.isConfirmed) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/doctors/${doctorId}/patients/${patient._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || "Could not delete patient.");
      setPatients((current) => current.filter((item) => item._id !== patient._id));
    } catch (deleteError) {
      setError(deleteError.message || "Could not delete patient.");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/doctors" className="text-sm font-medium text-teal-700 hover:text-teal-900">← Back to doctors</Link>
      <div className="mt-5">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Doctor patient list</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{doctor?.name || "Patients"}</h1>
        {doctor && <p className="mt-2 text-slate-600">{doctor.specialization} · {doctor.hospital}</p>}
      </div>

      {error && <p role="alert" className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-slate-900">Add patient</h2>
        <form onSubmit={addPatient} className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <input required name="name" value={form.name} onChange={updateField} placeholder="Patient name" aria-label="Patient name" className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100" />
          <input required name="condition" value={form.condition} onChange={updateField} placeholder="Condition" aria-label="Condition" className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100" />
          <input name="phone" value={form.phone} onChange={updateField} placeholder="Phone (optional)" aria-label="Phone" className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100" />
          <input name="email" type="email" value={form.email} onChange={updateField} placeholder="Email (optional)" aria-label="Email" className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100" />
          <div className="sm:col-span-2 lg:col-span-4">
            <button type="submit" disabled={saving} className="rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60">
              {saving ? "Adding patient..." : "Add patient to this doctor"}
            </button>
          </div>
        </form>
      </section>

      <section className="mt-7 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="font-semibold text-slate-900">Patients ({patients.length})</h2>
        </div>
        {loading ? <p className="px-6 py-12 text-center text-sm text-slate-500">Loading patients...</p> : patients.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-slate-500">No patients are assigned to this doctor yet.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {patients.map((patient) => (
              <li key={patient._id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{patient.name}</p>
                  <p className="mt-1 text-sm text-slate-600">{patient.condition}{patient.phone ? ` · ${patient.phone}` : ""}</p>
                </div>
                <div className="flex items-center gap-4">
                  <time className="text-sm text-slate-500">{patient.createdAt ? new Date(patient.createdAt).toLocaleDateString() : "—"}</time>
                  <button type="button" onClick={() => deletePatient(patient)} className="rounded-lg border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
