"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import SubmitLoader from "../(others)/SubmitLoader";

const fields = [
  { name: "name", label: "Doctor name", placeholder: "Dr. Amina Rahman" },
  { name: "specialization", label: "Specialization", placeholder: "Cardiology" },
  { name: "hospital", label: "Hospital", placeholder: "Central Medical Center" },
  { name: "phone", label: "Phone", placeholder: "+1-555-0101", type: "tel" },
  { name: "email", label: "Email", placeholder: "doctor@example.com", type: "email" },
];

export default function CreateDoctorForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const createDoctor = async (data) => {
    setIsSubmitting(true);
    setError("");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/doctors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || "Could not create doctor.");
      router.push("/doctors");
      router.refresh();
    } catch (submitError) {
      setError(submitError.message || "Could not create doctor. Check the backend connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(createDoctor)} className="space-y-5">
      {fields.map(({ name, label, placeholder, type = "text" }) => (
        <div key={name}>
          <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>
          <input
            id={name}
            type={type}
            placeholder={placeholder}
            autoComplete={name === "name" ? "name" : name === "phone" ? "tel" : name === "email" ? "email" : undefined}
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            {...register(name, {
              required: `${label} is required`,
              ...(type === "email" ? { pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email address" } } : {}),
            })}
          />
          {errors[name] && <p className="mt-1 text-sm text-red-600">{errors[name].message}</p>}
        </div>
      ))}

      {error && <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <button type="button" onClick={() => router.push("/doctors")} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Cancel</button>
        <button type="submit" disabled={isSubmitting} className="flex items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60">
          {isSubmitting && <SubmitLoader />}
          {isSubmitting ? "Saving doctor..." : "Create doctor"}
        </button>
      </div>
    </form>
  );
}
