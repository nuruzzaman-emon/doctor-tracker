"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiLogIn, FiUserPlus } from "react-icons/fi";
import { HiShieldCheck } from "react-icons/hi";

import Logo from "../(others)/Logo";

const AuthHeader = () => {
  const pathname = usePathname();
  const isRegisterPage = pathname === "/register";

  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div style={{ width: "calc(100vw - 1.5rem)" }} className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-4 sm:gap-4 sm:px-6">
        {/* Logo */}
        <Logo />

        {/* Portal Information */}
        <div className="hidden items-center gap-2 sm:flex">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <HiShieldCheck size={20} />
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-800">
              Secure Healthcare Portal
            </p>
            <p className="text-xs text-gray-500">
              Your health information matters
            </p>
          </div>
        </div>

        {/* Switch between sign in and registration */}
        <Link
          href={isRegisterPage ? "/login" : "/register"}
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-emerald-200 px-2.5 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50 sm:gap-2 sm:px-3 sm:text-sm"
        >
          {isRegisterPage ? <FiLogIn size={17} /> : <FiUserPlus size={17} />}
          <span className="hidden sm:inline">{isRegisterPage ? "Sign in" : "Create account"}</span>
        </Link>
      </div>
    </header>
  );
};

export default AuthHeader;
