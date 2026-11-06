"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEnvelope, FaEye, FaEyeSlash, FaLock } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import SubmitLoader from "../(others)/SubmitLoader";
import Swal from "sweetalert2";

export default function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState();
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleLogin = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
        credentials: "include",
      });

      const result = await res.json();

      if (res.ok) {
        router.push("/dashboard");
      } else {
        console.log(result);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: result?.message || "Login failed",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "An error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">
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
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="w-full rounded-lg border border-gray-200 py-3 pl-11 pr-12 outline-none focus:border-emerald-500"
            {...register("password", {
              required: "Password is required",
            })}
          />
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
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
        {isSubmitting ? (
          <span className="flex justify-center items-center gap-2">
            <SubmitLoader />
            <p>Logging in</p>
          </span>
        ) : (
          <p>Login</p>
        )}
      </button>
    </form>
  );
}
