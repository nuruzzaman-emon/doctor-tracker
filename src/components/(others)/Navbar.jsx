"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FaBars,
  FaXmark,
  FaGauge,
  FaUserDoctor,
  FaUserInjured,
  FaArrowRightFromBracket,
} from "react-icons/fa6";
import Logo from "./Logo";
import { signOut } from "@/actions/authActions";
import Swal from "sweetalert2";

const navLinks = [
  { name: "Doctors", href: "/doctors", icon: FaUserDoctor },
  { name: "Patients", href: "/patients", icon: FaUserInjured },
  { name: "Dashboard", href: "/dashboard", icon: FaGauge },
];

export default function Navbar() {
  const [menuState, setMenuState] = useState({ open: false, pathname: null });
  const [isSigningOut, setIsSigningOut] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isMenuOpen = menuState.open && menuState.pathname === pathname;

  // Lock body scroll when the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const isActive = (href) =>
    pathname === href || (href !== "/" && pathname?.startsWith(href + "/"));

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      setMenuState({ open: false, pathname });
      router.replace("/login");
      router.refresh();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Could not sign out",
        text: error.message || "Please try again.",
      });
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur transition-shadow">
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Logo />

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map(({ name, href, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                aria-current={isActive(href) ? "page" : undefined}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(href)
                    ? "bg-teal-50 text-teal-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 lg:flex">
          <button
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="flex items-center gap-2 rounded-lg border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-wait disabled:opacity-60"
          >
            <FaArrowRightFromBracket className="h-4 w-4" aria-hidden="true" />
            {isSigningOut ? "Signing out…" : "Sign out"}
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMenuState({ open: !isMenuOpen, pathname })}
          className="inline-flex items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 lg:hidden"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? (
            <FaXmark className="h-6 w-6" />
          ) : (
            <FaBars className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`absolute inset-x-0 top-16 origin-top border-b border-slate-200 bg-white shadow-lg transition-all duration-200 lg:hidden ${
          isMenuOpen
            ? "visible scale-y-100 opacity-100"
            : "invisible scale-y-95 opacity-0"
        }`}
      >
        <div className="max-h-[calc(100vh-4rem)] overflow-y-auto px-4 py-4 sm:px-6">
          <ul className="space-y-1">
            {navLinks.map(({ name, href, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={isActive(href) ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium transition-colors ${
                    isActive(href)
                      ? "bg-teal-50 text-teal-700"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  {name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex flex-col gap-3 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-base font-medium text-rose-700 transition hover:bg-rose-50 disabled:cursor-wait disabled:opacity-60"
            >
              <FaArrowRightFromBracket className="h-5 w-5" aria-hidden="true" />
              {isSigningOut ? "Signing out…" : "Sign out"}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
