"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaBars,
  FaXmark,
  FaRegBell,
  FaGauge,
  FaUserDoctor,
  FaUserInjured,
  FaCalendarCheck,
  FaStethoscope,
  FaCalendarPlus,
  FaRegCircleUser,
} from "react-icons/fa6";
import Logo from "./Logo";

const navLinks = [
  { name: "Doctors", href: "/doctors", icon: FaUserDoctor },
  { name: "Patients", href: "/patients", icon: FaUserInjured },
  { name: "Appointments", href: "/appointments", icon: FaCalendarCheck },
  { name: "Services", href: "/services", icon: FaStethoscope },
  { name: "Dashboard", href: "/dashboard", icon: FaGauge },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu when the route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll when the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href) =>
    pathname === href || pathname?.startsWith(href + "/");

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur transition-shadow 
      }`}
    >
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Logo/>

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
          

          <Link
            href="/appointments/new"
            className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            <FaCalendarPlus className="h-4 w-4" aria-hidden="true" />
            Book Appointment
          </Link>

          <Link
            href="/profile"
            className="rounded-full text-slate-500 transition hover:text-teal-600"
            aria-label="Profile"
          >
            <FaRegCircleUser className="h-8 w-8" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? (
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
          open
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
            <Link
              href="/appointments/new"
              className="flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-base font-semibold text-white shadow-sm transition hover:bg-teal-700"
            >
              <FaCalendarPlus className="h-4 w-4" aria-hidden="true" />
              Book Appointment
            </Link>
            <Link
              href="/profile"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-100"
            >
              <FaRegCircleUser className="h-6 w-6 text-slate-500" />
              <span className="text-base font-medium">My Profile</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
