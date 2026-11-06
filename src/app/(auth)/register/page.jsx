import RegisterForm from "@/components/(auth)/RegisterForm";
import Link from "next/link";
import { FaUserPlus } from "react-icons/fa6";

export const metadata = {
  title: "Create Account | Doctor Tracker",
  description: "Create your Doctor Tracker account.",
};

export default function RegisterPage() {
  return (
    <section className="mx-auto w-full max-w-xl rounded-2xl border border-gray-100 bg-white p-6 shadow-lg sm:p-8">
      {/* Heading */}
      <div className="mb-7 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <FaUserPlus size={25} />
        </div>

        <h1 className="text-2xl font-bold text-gray-900">
          Create Your Account
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Join Doctor Tracker to manage your healthcare journey.
        </p>
      </div>

      {/* Registration Form */}
      <RegisterForm />

      {/* Login Link */}
      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-emerald-600 hover:text-emerald-700"
        >
          Sign in
        </Link>
      </p>
    </section>
  );
}
