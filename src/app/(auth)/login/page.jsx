
import LoginForm from "@/components/(auth)/LoginForm";
import Link from "next/link";
import { FaUserCircle } from "react-icons/fa";

export const metadata = {
  title: "Login | Doctor Tracker",
  description: "Login to your Doctor Tracker account.",
};

export default function LoginPage() {
  return (
    <section className="mx-auto w-full max-w-lg rounded-2xl border border-gray-100 bg-white p-6 shadow-lg sm:p-8">
      <div className="mb-7 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <FaUserCircle size={28} />
        </div>

        <h1 className="text-2xl font-bold text-gray-900">
          Welcome Back!
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Login to access your Doctor Tracker account.
        </p>
      </div>

      <LoginForm />

      <p className="mt-6 text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-emerald-600 hover:text-emerald-700"
        >
          Create an account
        </Link>
      </p>
    </section>
  );
}
