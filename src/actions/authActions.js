const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const signOut = async () => {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured.");
  }

  const response = await fetch(`${API_URL}/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || "Sign out failed.");
  }

  return result;
};
