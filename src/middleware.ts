import NextAuth from "next-auth";
import authConfig from "./lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;

  const publicRoutes = ["/connexion"];
  const isAuthenticated = !!req.auth;
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

  if (isPublicRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  if (!isAuthenticated && !isPublicRoute) {
    return NextResponse.redirect(new URL("/connexion", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|_next/css|robots\\.txt|sitemap\\.xml|.*\\.png$|.*\\.ico$|.*\\.svg$|.*\\.jpg$|.*\\.css$|.*\\.js$).*)",
  ],
};
