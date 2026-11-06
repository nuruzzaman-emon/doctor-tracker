"use client";

import { useForm } from "react-hook-form";
import { FaEnvelope, FaLock } from "react-icons/fa6";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    console.log("Login Data:", data);

    // Connect your login API here later.
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Email */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Email Address
        </label>

        <div className="relative">
          <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            type="email"
            placeholder="Enter your email"
            className="w-full rounded-lg border border-gray-200 py-3 pl-11 pr-4 outline-none focus:border-emerald-500"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Enter a valid email address",
              },
            })}
          />
        </div>

        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Password
        </label>

        <div className="relative">
          <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            type="password"
            placeholder="Enter your password"
            className="w-full rounded-lg border border-gray-200 py-3 pl-11 pr-4 outline-none focus:border-emerald-500"
            {...register("password", {
              required: "Password is required",
            })}
          />
        </div>

        {errors.password && (
          <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
