"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "@/actions/authActions";

export default function AccessDenied() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    setError("");
    try {
      await signOut();
      router.replace("/login");
      router.refresh();
    } catch (signOutError) {
      setError(signOutError.message || "Could not sign out. Please try again.");
      setIsSigningOut(false);
    }
  };

  return (
    <section className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-lg sm:p-8">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-xl font-bold text-amber-700" aria-hidden="true">!</div>
      <h1 className="mt-4 text-2xl font-bold text-slate-900">Admin access required</h1>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        This account does not have permission to manage doctors and patients. Contact an administrator for access, or sign out and use an admin account.
      </p>
      {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <button
        type="button"
        onClick={handleSignOut}
        disabled={isSigningOut}
        className="mt-6 w-full rounded-lg bg-teal-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-wait disabled:opacity-60"
      >
        {isSigningOut ? "Signing out..." : "Sign out"}
      </button>
    </section>
  );
}
