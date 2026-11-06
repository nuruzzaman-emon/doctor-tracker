import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";
import CreateDoctorForm from "@/components/(doctors)/CreateDoctorForm";

export default function CreateDoctorPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/doctors" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-teal-700">
        <FaArrowLeft aria-hidden="true" /> Back to doctors
      </Link>
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Doctor directory</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">Create doctor</h1>
        <p className="mt-2 text-sm text-slate-600">Add the doctor’s contact and practice details.</p>
        <div className="mt-7"><CreateDoctorForm /></div>
      </section>
    </div>
  );
}
