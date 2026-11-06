import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { HiShieldCheck } from "react-icons/hi";

import Logo from "../Logo";

const AuthHeader = () => {
  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
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

        {/* Back to Home */}
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-emerald-600"
        >
          <FiArrowLeft size={17} />
          <span>Back to Home</span>
        </Link>
      </div>
    </header>
  );
};

export default AuthHeader;
