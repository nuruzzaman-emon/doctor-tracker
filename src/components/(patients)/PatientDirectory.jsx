"use client";

import { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { FaMagnifyingGlass, FaPen, FaTrash } from "react-icons/fa6";
import LoadingSkeleton from "@/components/(others)/LoadingSkeleton";

const PAGE_SIZE = 10;
const EMPTY_EDIT_FORM = { name: "", condition: "", phone: "", email: "" };

export default function PatientDirectory() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [filters, setFilters] = useState({ search: "", condition: "", doctorId: "", from: "", to: "" });
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [editingPatient, setEditingPatient] = useState(null);
  const [editForm, setEditForm] = useState(EMPTY_EDIT_FORM);
  const [saving, setSaving] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFilters((current) => current.search === searchInput ? current : { ...current, search: searchInput });
      setPage(1);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/doctors?limit=100`, {
      credentials: "include",
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        const result = await response.json().catch(() => ({}));
        if (response.ok) setDoctors(result.doctors || []);
      })
      .catch((error) => {
        if (error.name !== "AbortError") setDoctors([]);
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const loadPatients = async () => {
      setStatus("loading");
      try {
        const query = new URLSearchParams({ ...filters, page: String(page), limit: String(PAGE_SIZE) });
        const response = await fetch(`/api/patients?${query}`, {
          credentials: "include",
          cache: "no-store",
          signal: controller.signal,
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || "Could not load patients.");
        setPatients(result.patients || []);
        setTotal(result.total || 0);
        setPages(Math.max(1, result.pages || 1));
        setErrorMessage("");
        setStatus("ready");
      } catch (error) {
        if (error.name !== "AbortError") {
          setErrorMessage(error.message || "Could not load patients.");
          setStatus("error");
        }
      }
    };
    loadPatients();
    return () => controller.abort();
  }, [filters, page, refreshKey]);

  const updateFilter = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setSearchInput("");
    setFilters({ search: "", condition: "", doctorId: "", from: "", to: "" });
    setPage(1);
  };

  const openEdit = (patient) => {
    setEditingPatient(patient);
    setEditForm({
      name: patient.name || "",
      condition: patient.condition || "",
      phone: patient.phone || "",
      email: patient.email || "",
    });
  };

  const updateEditField = (event) => {
    setEditForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const savePatient = async (event) => {
    event.preventDefault();
    if (!editingPatient) return;
    setSaving(true);
    setErrorMessage("");
    try {
      const response = await fetch(`/api/patients/${editingPatient._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(editForm),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || "Could not update patient.");
      setEditingPatient(null);
      setRefreshKey((current) => current + 1);
    } catch (error) {
      setErrorMessage(error.message || "Could not update patient.");
    } finally {
      setSaving(false);
    }
  };

  const deletePatient = useCallback(async (patient) => {
    const confirmation = await Swal.fire({
      title: "Delete patient?",
      text: `This will permanently delete ${patient.name}'s record.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete patient",
      confirmButtonColor: "#be123c",
    });
    if (!confirmation.isConfirmed) return;

    try {
      const response = await fetch(`/api/patients/${patient._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || "Could not delete patient.");
      if (patients.length === 1 && page > 1) setPage((current) => current - 1);
      else setRefreshKey((current) => current + 1);
    } catch (error) {
      setErrorMessage(error.message || "Could not delete patient.");
    }
  }, [page, patients.length]);

  if (status === "loading" && patients.length === 0) {
    return <LoadingSkeleton type="patients" />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Directory</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Patients</h1>
        <p className="mt-2 text-slate-600">Search, filter, update, and manage patient records.</p>
      </div>

      <section className="mt-7 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-3">
        <label className="flex items-center gap-3 rounded-lg border border-slate-300 px-3 py-2.5 focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-100">
          <FaMagnifyingGlass className="shrink-0 text-slate-400" aria-hidden="true" />
          <input name="search" value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder="Search name, phone, email" className="w-full text-sm outline-none placeholder:text-slate-400" />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-slate-500">
          Condition
          <input name="condition" value={filters.condition} onChange={updateFilter} placeholder="e.g. Migraine" className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal text-slate-800 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100" />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-slate-500">
          Doctor
          <select name="doctorId" value={filters.doctorId} onChange={updateFilter} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-normal text-slate-800 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100">
            <option value="">All doctors</option>
            {doctors.map((doctor) => <option key={doctor._id} value={doctor._id}>{doctor.name}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-slate-500">
          Added from
          <input type="date" name="from" value={filters.from} onChange={updateFilter} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal text-slate-800 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100" />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-slate-500">
          Added to
          <input type="date" name="to" value={filters.to} onChange={updateFilter} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal text-slate-800 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100" />
        </label>
        <div className="flex items-end justify-between gap-3">
          <span className="pb-2 text-sm text-slate-500">{total} {total === 1 ? "patient" : "patients"}</span>
          <button type="button" onClick={clearFilters} className="rounded-lg px-3 py-2 text-sm font-semibold text-teal-700 hover:bg-teal-50">Clear filters</button>
        </div>
      </section>

      {errorMessage && <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p>}

      <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="hidden grid-cols-6 gap-4 border-b border-slate-200 bg-slate-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 xl:grid">
          <span>Patient</span><span>Condition</span><span>Doctor</span><span>Phone</span><span>Date added</span><span>Actions</span>
        </div>
        {status === "loading" && <p className="px-6 py-12 text-center text-sm text-slate-500">Loading patients...</p>}
        {status === "error" && !patients.length && <p className="px-6 py-12 text-center text-sm text-slate-500">Patient records could not be loaded.</p>}
        {status === "ready" && patients.length === 0 && <p className="px-6 py-12 text-center text-sm text-slate-500">No patients match these filters.</p>}
        {patients.length > 0 && (
          <ul className="divide-y divide-slate-100">
            {patients.map((patient) => (
              <li key={patient._id} className="grid gap-3 px-5 py-4 text-sm text-slate-700 sm:grid-cols-2 xl:grid-cols-6 xl:items-center xl:gap-4">
                <div><span className="mb-1 block text-xs font-medium uppercase text-slate-500 xl:hidden">Patient</span><span className="font-semibold text-slate-900">{patient.name}</span></div>
                <div><span className="mb-1 block text-xs font-medium uppercase text-slate-500 xl:hidden">Condition</span>{patient.condition}</div>
                <div><span className="mb-1 block text-xs font-medium uppercase text-slate-500 xl:hidden">Doctor</span>{patient.doctorName || "Unassigned"}</div>
                <div><span className="mb-1 block text-xs font-medium uppercase text-slate-500 xl:hidden">Phone</span>{patient.phone || "—"}</div>
                <div><span className="mb-1 block text-xs font-medium uppercase text-slate-500 xl:hidden">Date added</span><time>{patient.createdAt ? new Date(patient.createdAt).toLocaleDateString() : "—"}</time></div>
                <div>
                  <span className="mb-1 block text-xs font-medium uppercase text-slate-500 xl:hidden">Actions</span>
                  <div className="flex gap-2">
                  <button type="button" onClick={() => openEdit(patient)} aria-label={`Edit ${patient.name}`} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"><FaPen aria-hidden="true" /> Edit</button>
                  <button type="button" onClick={() => deletePatient(patient)} aria-label={`Delete ${patient.name}`} className="inline-flex items-center gap-2 rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50"><FaTrash aria-hidden="true" /> Delete</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-4 flex items-center justify-between gap-4">
        <p className="text-sm text-slate-500">Page {page} of {pages}</p>
        <div className="flex gap-2">
          <button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page <= 1 || status === "loading"} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">Previous</button>
          <button type="button" onClick={() => setPage((current) => Math.min(pages, current + 1))} disabled={page >= pages || status === "loading"} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">Next</button>
        </div>
      </div>

      {editingPatient && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/40 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) setEditingPatient(null); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="edit-patient-title" className="max-h-[calc(100vh-2rem)] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <h2 id="edit-patient-title" className="text-xl font-bold text-slate-900">Edit patient</h2>
            <form onSubmit={savePatient} className="mt-5 space-y-4">
              <label className="block text-sm font-medium text-slate-700">Name<input required name="name" value={editForm.name} onChange={updateEditField} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100" /></label>
              <label className="block text-sm font-medium text-slate-700">Condition<input required name="condition" value={editForm.condition} onChange={updateEditField} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100" /></label>
              <label className="block text-sm font-medium text-slate-700">Phone<input name="phone" value={editForm.phone} onChange={updateEditField} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100" /></label>
              <label className="block text-sm font-medium text-slate-700">Email<input type="email" name="email" value={editForm.email} onChange={updateEditField} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100" /></label>
              {errorMessage && <p role="alert" className="text-sm text-red-700">{errorMessage}</p>}
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" disabled={saving} onClick={() => setEditingPatient(null)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">Cancel</button>
                <button type="submit" disabled={saving} className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-50">{saving ? "Saving..." : "Save changes"}</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
