import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { DEMO_USER_COOKIE } from "@/lib/session";
import { ROLE_HOME, type Role } from "@/lib/types";
import { USERS } from "@/lib/seed-data";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/no-access",
  "/api/demo(.*)",
  "/api/webhooks(.*)",
]);

const isEmployeeRoute = createRouteMatcher(["/employee(.*)"]);
const isManagerRoute = createRouteMatcher(["/manager(.*)"]);
const isHrRoute = createRouteMatcher(["/hr(.*)"]);

function roleHome(role: Role | undefined) {
  if (!role) return "/";
  return ROLE_HOME[role];
}

function demoProxy(request: NextRequest) {
  if (isPublicRoute(request)) return NextResponse.next();
  const userId = request.cookies.get(DEMO_USER_COOKIE)?.value;
  const user = USERS.find((u) => u.id === userId);
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  if (isEmployeeRoute(request) && user.role !== "employee") {
    return NextResponse.redirect(new URL(roleHome(user.role), request.url));
  }
  if (isManagerRoute(request) && user.role !== "manager") {
    return NextResponse.redirect(new URL(roleHome(user.role), request.url));
  }
  if (isHrRoute(request) && user.role !== "hr") {
    return NextResponse.redirect(new URL(roleHome(user.role), request.url));
  }
  return NextResponse.next();
}

const clerkHandler = clerkMiddleware(async (auth, request) => {
  if (isPublicRoute(request)) return;
  await auth.protect();
  const { sessionClaims } = await auth();
  const metadata = sessionClaims?.metadata as { role?: Role } | undefined;
  const role = metadata?.role;
  if (role) {
    if (isEmployeeRoute(request) && role !== "employee") {
      return NextResponse.redirect(new URL(roleHome(role), request.url));
    }
    if (isManagerRoute(request) && role !== "manager") {
      return NextResponse.redirect(new URL(roleHome(role), request.url));
    }
    if (isHrRoute(request) && role !== "hr") {
      return NextResponse.redirect(new URL(roleHome(role), request.url));
    }
  }
});

export default function proxy(request: NextRequest, event: Parameters<typeof clerkHandler>[1]) {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return demoProxy(request);
  }
  return clerkHandler(request, event);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
