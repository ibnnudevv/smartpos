import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)"]);
const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);
const isAPIRoute = createRouteMatcher(["/api(.*)"]);
const isPublicAPIRoute = createRouteMatcher(["/api/barang(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  // Biarkan request lanjut jika merupakan API publik
  if (isPublicAPIRoute(request)) {
    return NextResponse.next();
  }

  const { userId } = await auth();
  const url = new URL(request.url);

  // 1. Redirect ke sign-in jika belum login dan mencoba akses root atau protected route
  if (!userId && (url.pathname === "/" || isProtectedRoute(request))) {
    const signInUrl = new URL("/sign-in", request.url);
    if (url.pathname !== "/") {
      signInUrl.searchParams.set("redirect_url", request.url);
    }
    return NextResponse.redirect(signInUrl);
  }

  // 2. Redirect ke dashboard jika sudah login dan mencoba akses sign-in
  if (userId && isPublicRoute(request)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 3. Jika sudah login dan di root, redirect ke dashboard (opsional)
  if (userId && url.pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
