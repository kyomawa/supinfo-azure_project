import NextAuth from "next-auth";
import authConfig from "./lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

const publicRoutes = ["/connexion", "/verification", "/connexion-echoue"];
// const allowedOrigins = ["https://supinfo-azure-project.fr", "https://api.supinfo-azure-project.fr"];

export default auth((req) => {
  const { nextUrl, headers } = req;

  const isApiRoute = nextUrl.pathname.startsWith("/api");
  const isAuthRoute = nextUrl.pathname.startsWith("/api/auth/");

  // Check the origin
  // if (isApiRoute && !isAuthRoute) {
  //   const origin = headers.get("origin");

  //   if (!origin) {
  //     // Allow local development
  //     if (process.env.NODE_ENV === "development") {
  //       return NextResponse.next();
  //     }

  //     return NextResponse.json({ success: false, message: "L'origine est manquante." }, { status: 401 });
  //   }

  //   if (!allowedOrigins.includes(origin)) {
  //     return NextResponse.json({ success: false, message: "Origine invalide." }, { status: 403 });
  //   }

  //   return NextResponse.next();
  // }

  // Check the API key
  if (isApiRoute && !isAuthRoute) {
    const apiKey = headers.get("x-sap-secret-api-key");

    if (!apiKey) {
      return NextResponse.json({ success: false, message: "La clé API est manquante." }, { status: 401 });
    }

    const validApiKeys = process.env.SAP_SECRET_API_KEY?.split(",") || [];

    if (!validApiKeys.includes(apiKey)) {
      return NextResponse.json({ success: false, message: "Clé API invalide." }, { status: 403 });
    }

    return NextResponse.next();
  }

  const isAuthenticated = !!req.auth;
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

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
