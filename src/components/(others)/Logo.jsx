import Image from "next/image";
import Link from "next/link";
import React from "react";
const logo_img =
  "https://res.cloudinary.com/dwfet15kj/image/upload/v1793863729/logo_image_sifk8n.webp";

const Logo = () => {
  return (
    <div>
      {/* Logo */}
      <Link href="/" className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm">
          <Image
            className="h-5 w-5"
            src={logo_img}
            width={12}
            height={12}
            alt="logo"
          />
        </span>
        <span className="text-base font-bold tracking-tight text-slate-800 sm:text-lg">
          Doctor<span className="text-teal-600">Tracker</span>
        </span>
      </Link>
    </div>
  );
};

export default Logo;
