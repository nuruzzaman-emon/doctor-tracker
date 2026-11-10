import "server-only";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/+$/, "");

export const getCurrentUser = async () => {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured.");
  }

  const token = (await cookies()).get("token")?.value;
  if (!token) return null;

  const response = await fetch(`${API_URL}/me`, {
    headers: { Cookie: `token=${token}` },
    cache: "no-store",
  });

  if (response.status === 401 || response.status === 403) return null;

  const result = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(result?.message || "Could not get the current user.");
  }

  return result?.user ?? result;
};
