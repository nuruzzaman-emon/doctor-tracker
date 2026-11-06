"use client";

import { getImageLink } from "@/actions/imageActions";
import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import SubmitLoader from "../(others)/SubmitLoader";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const RegisterForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [err, setErr] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const handleRegister = async (data) => {
    setIsSubmitting(true);
    setErr("");
    setIsSuccess(false);
    try {
      const photo_url = data?.photo?.[0]
        ? await getImageLink(data.photo[0])
        : null;

      const userData = {
        name: data?.name,
        photo_url,
        email: data?.email,
        phone: data?.phone,
        password: data?.password,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const result = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(result.message || "Failed to register");

      setIsSuccess(true);
      router.push("/login");
      Swal.fire({
        title: "Account has created",
        text: "Please login with email and password",
        icon: "success",
        draggable: true,
      });
    } catch (error) {
      console.error("Registration failed:", error);
      setIsSuccess(false);
      setErr(
        error.name === "TimeoutError"
          ? "The image upload took too long. Check your connection and try again."
          : error.message || "Registration failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const password = useWatch({ control, name: "password" });

  return (
    <form onSubmit={handleSubmit(handleRegister)} className="space-y-5">
      {/* Name */}
      <div>
        <label
          htmlFor="name"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Full Name
        </label>
        <input
          id="name"
          type="text"
          placeholder="Enter your full name"
          autoComplete="name"
          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          {...register("name", {
            required: "Name is required",
          })}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>
      {/* Profile Picture */}
      <div>
        <label
          htmlFor="photo"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Profile Picture
        </label>
        <input
          id="photo"
          type="file"
          accept="image/*"
          className="w-full cursor-pointer rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-600 outline-none transition file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-emerald-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-emerald-700 hover:file:bg-emerald-100 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          {...register("photo", {
            required: "Profile picture is required",
            validate: {
              isImage: (files) =>
                files[0]?.type.startsWith("image/") ||
                "Please select a valid image",
              maxSize: (files) =>
                files[0]?.size <= 2 * 1024 * 1024 ||
                "Image size must be less than 2MB",
            },
          })}
        />

        {errors.photo && (
          <p className="mt-1 text-sm text-red-500">{errors.photo.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Email Address
        </label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          autoComplete="email"
          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: "Enter a valid email address",
            },
          })}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label
          htmlFor="phone"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Phone Number
        </label>
        <input
          id="phone"
          type="tel"
          placeholder="Enter your phone number"
          autoComplete="tel"
          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          {...register("phone", {
            required: "Phone number is required",
          })}
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a password"
            autoComplete="new-password"
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 pr-12 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
          />
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Confirm Password
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            autoComplete="new-password"
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 pr-12 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((visible) => !visible)}
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            aria-pressed={showConfirmPassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-500">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>
      {err && (
        <p
          className={`mt-1 text-sm ${isSuccess ? "text-emerald-700" : "text-red-500"}`}
        >
          {err}
        </p>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-emerald-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <SubmitLoader />
            <p> Creating Account...</p>
          </span>
        ) : (
          <span>Create Account</span>
        )}
      </button>
    </form>
  );
};

export default RegisterForm;
