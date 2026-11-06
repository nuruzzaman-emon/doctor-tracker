import { NextResponse } from "next/server";

export function proxy(request) {
  // 1. Get the token from the cookies
  const token = request.cookies.get("token")?.value;

  // 2. Define your public paths (routes that don't require authentication)
  const publicPaths = ["/login", "/register"];
  const currentPath = request.nextUrl.pathname;

  const isPublicPath = publicPaths.includes(currentPath);

  // 3. If the route is private and there is NO token, redirect to /login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 4. If the user is ALREADY logged in and tries to visit /login or /register, redirect to home (/)
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Otherwise, allow the request to proceed normally
  return NextResponse.next();
}

// 5. Configure which paths the middleware should run on (excludes static files, api routes, etc.)
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
