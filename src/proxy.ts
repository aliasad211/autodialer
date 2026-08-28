import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/session";

const publicRoutes = ["/login"];

export default async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isAdminRoute = path.startsWith("/admin");
  const isAgentRoute = path.startsWith("/agent");
  const isPublicRoute = publicRoutes.includes(path);

  const cookie = request.cookies.get("session")?.value;
  const session = await decrypt(cookie);

  if ((isAdminRoute || isAgentRoute) && !session?.userId) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  if (isAdminRoute && session?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/agent/dashboard", request.nextUrl));
  }

  if (isAgentRoute && session?.role !== "AGENT") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.nextUrl));
  }

  if (isPublicRoute && session?.userId) {
    const destination = session.role === "ADMIN" ? "/admin/dashboard" : "/agent/dashboard";
    return NextResponse.redirect(new URL(destination, request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/agent/:path*", "/login"],
};
