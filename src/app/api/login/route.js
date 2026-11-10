import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/+$/, "");

export async function POST(request) {
  if (!API_URL) {
    return NextResponse.json(
      { message: "The backend API is not configured." },
      { status: 500 },
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  let backendResponse;
  try {
    backendResponse = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
  } catch (error) {
    console.error("Backend login request failed:", error);
    return NextResponse.json(
      { message: "Could not connect to the login service." },
      { status: 502 },
    );
  }

  const result = await backendResponse.json().catch(() => ({}));
  if (!backendResponse.ok) {
    return NextResponse.json(result, { status: backendResponse.status });
  }

  const setCookieHeaders =
    backendResponse.headers.getSetCookie?.() ??
    [backendResponse.headers.get("set-cookie")].filter(Boolean);
  const tokenCookie = setCookieHeaders.find((cookie) => /^token=/i.test(cookie));
  const token = tokenCookie?.match(/^token=([^;]+)/i)?.[1];

  if (!token) {
    console.error("Backend login succeeded without setting a token cookie.");
    return NextResponse.json(
      { message: "Login service did not return a session cookie." },
      { status: 502 },
    );
  }

  const response = NextResponse.json(result, { status: backendResponse.status });
  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 24 * 60 * 60,
  });

  return response;
}
