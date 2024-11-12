export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: [
    "/app/:path*((?!api|_next/static|_next/image|robots\\.txt|sitemap\\.xml|.*\\.png$|.*\\.ico$|.*\\.svg$|.*\\.jpg$).*)",
  ],
};
