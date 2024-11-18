import NextAuth from "next-auth";
import authConfig from "./lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

const publicRoutes = ["/connexion", "/verification", "/connexion-echoue"];

export default auth((req) => {
  const { nextUrl } = req;

  const isAuthenticated = !!req.auth;
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

  if (nextUrl.pathname.startsWith("/api") && !isAuthenticated) {
    return new Response(JSON.stringify({ error: "Veuillez vous connecter" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (isPublicRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  if (!isAuthenticated && !isPublicRoute) {
    return NextResponse.redirect(new URL(`/connexion${nextUrl.search}`, nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!\\.swa|api/auth/|_next/static|_next/image|_next/css|robots\\.txt|sitemap\\.xml|manifest\\.json|icons/|.*\\.png$|.*\\.ico$|.*\\.svg$|.*\\.jpg$|.*\\.css$|.*\\.js$).*)",
  ],
};
