import Footer from "@/components/(others)/Footer";
import Navbar from "@/components/(others)/Navbar";
import { getCurrentUser } from "@/lib/auth/server";
import { redirect } from "next/navigation";

export default async function Homelayout({ children }) {
  const user = await getCurrentUser();
  if (user?.role !== "admin") redirect("/access-denied");

  return (
    <div className="flex min-h-dvh w-full min-w-0 flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
