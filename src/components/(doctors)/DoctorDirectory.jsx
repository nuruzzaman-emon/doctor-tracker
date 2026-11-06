"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaMagnifyingGlass, FaUsers } from "react-icons/fa6";
import LoadingSkeleton from "@/components/(others)/LoadingSkeleton";

const PAGE_SIZE = 10;

export default function DoctorDirectory() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    const controller = new AbortController();
    const loadDoctors = async () => {
      setStatus("loading");
      try {
        const query = new URLSearchParams({
          search,
          specialization,
          from,
          to,
          page: String(page),
          limit: String(PAGE_SIZE),
        });
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/doctors?${query}`, {
          credentials: "include",
          cache: "no-store",
          signal: controller.signal,
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || "Could not load doctors.");
        setDoctors(result.doctors || []);
        setTotal(result.total || 0);
        setPages(Math.max(1, result.pages || 1));
        setErrorMessage("");
        setStatus("ready");
      } catch (error) {
        if (error.name !== "AbortError") {
          setErrorMessage(error.message || "Could not load doctors.");
          setStatus("error");
        }
      }
    };
    loadDoctors();
    return () => controller.abort();
  }, [search, specialization, from, to, page]);

  const updateFilter = (setter) => (event) => {
    setter(event.target.value);
    setPage(1);
  };

  if (status === "loading" && doctors.length === 0) {
    return <LoadingSkeleton type="doctors" />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Directory</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Doctors</h1>
          <p className="mt-2 text-slate-600">Search, filter, and manage doctors and their patient lists.</p>
        </div>
        <Link href="/doctors/new" className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800">
          Create doctor
        </Link>
      </div>

      <div className="mt-7 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
        <label className="flex items-center gap-3 rounded-lg border border-slate-300 px-3 py-2.5 focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-100 sm:col-span-2 lg:col-span-1">
          <FaMagnifyingGlass className="shrink-0 text-slate-400" aria-hidden="true" />
          <input value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder="Search doctors" className="w-full text-sm outline-none placeholder:text-slate-400" />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-slate-500">
          Specialization
          <input value={specialization} onChange={updateFilter(setSpecialization)} placeholder="e.g. Cardiology" className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal text-slate-800 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100" />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-slate-500">
          Added from
          <input type="date" value={from} onChange={updateFilter(setFrom)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal text-slate-800 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100" />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-slate-500">
          Added to
          <input type="date" value={to} onChange={updateFilter(setTo)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal text-slate-800 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100" />
        </label>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
        <span>{total} {total === 1 ? "doctor" : "doctors"}</span>
        <button type="button" onClick={() => { setSearchInput(""); setSearch(""); setSpecialization(""); setFrom(""); setTo(""); setPage(1); }} className="font-medium text-teal-700 hover:text-teal-900">Clear filters</button>
      </div>

      <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="hidden grid-cols-7 gap-4 border-b border-slate-200 bg-slate-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 xl:grid">
          <span>Doctor</span><span>Specialization</span><span>Hospital</span><span>Phone</span><span>Email</span><span>Patients</span><span>Actions</span>
        </div>
        {status === "loading" && <p className="px-6 py-12 text-center text-sm text-slate-500">Loading doctors...</p>}
        {status === "error" && <p role="alert" className="px-6 py-12 text-center text-sm text-red-700">{errorMessage}</p>}
        {status === "ready" && doctors.length === 0 && <div className="px-6 py-14 text-center"><h2 className="font-semibold text-slate-800">No doctors found</h2><p className="mt-2 text-sm text-slate-500">Try changing your filters or create a doctor record.</p></div>}
        {status === "ready" && doctors.length > 0 && (
          <ul className="divide-y divide-slate-100">
            {doctors.map((doctor) => (
              <li key={doctor._id} className="grid gap-3 px-5 py-4 text-sm text-slate-700 sm:grid-cols-2 xl:grid-cols-7 xl:items-center xl:gap-4">
                <div className="min-w-0"><span className="mb-1 block text-xs font-medium uppercase text-slate-500 xl:hidden">Doctor</span><span className="break-words font-semibold text-slate-900">{doctor.name}</span></div>
                <div className="min-w-0"><span className="mb-1 block text-xs font-medium uppercase text-slate-500 xl:hidden">Specialization</span><span className="break-words">{doctor.specialization}</span></div>
                <div className="min-w-0"><span className="mb-1 block text-xs font-medium uppercase text-slate-500 xl:hidden">Hospital</span><span className="break-words">{doctor.hospital}</span></div>
                <div className="min-w-0"><span className="mb-1 block text-xs font-medium uppercase text-slate-500 xl:hidden">Phone</span><span className="break-words">{doctor.phone}</span></div>
                <div className="min-w-0 break-all"><span className="mb-1 block text-xs font-medium uppercase text-slate-500 xl:hidden">Email</span>{doctor.email}</div>
                <div><span className="mb-1 block text-xs font-medium uppercase text-slate-500 xl:hidden">Patients</span>{doctor.patientCount ?? 0}</div>
                <Link href={`/doctors/${doctor._id}/patients`} className="inline-flex w-fit items-center gap-2 font-semibold text-teal-700 hover:text-teal-900">
                  <FaUsers aria-hidden="true" /> View patients
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <p className="text-sm text-slate-500">Page {page} of {pages}</p>
        <div className="flex gap-2">
          <button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page <= 1 || status === "loading"} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">Previous</button>
          <button type="button" onClick={() => setPage((current) => Math.min(pages, current + 1))} disabled={page >= pages || status === "loading"} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>
  );
}
