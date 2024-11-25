import "./globals.css";
import { satoshi } from "@/fonts/fonts";
import { commonMetadata } from "@/constants/metadata";
import { ViewTransitions } from "next-view-transitions";
import { Toaster } from "react-hot-toast";
import NextTopLoader from "nextjs-toploader";
import { ThemeProvider } from "@/components/Providers/ThemeProvider";
import { SessionProvider } from "next-auth/react";
import RecoilProvider from "@/components/Providers/RecoilProvider";

export const metadata = commonMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html className="scroll-smooth" style={{ scrollBehavior: "smooth" }} lang="fr">
        <body
          className={`${satoshi.variable} ${satoshi.className} antialiased bg-neutral-50 dark:bg-neutral-950 bodyWebSite`}
        >
          {/* Manifests Color */}
          <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fafafa" />
          <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0a0a0a" />
          {/* Loading Bar */}
          <NextTopLoader color="#b21e4b" zIndex={10} showSpinner={false} />
          <SessionProvider>
            <RecoilProvider>
              <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                {children}
              </ThemeProvider>
            </RecoilProvider>
          </SessionProvider>
          {/* Toaster */}
          <Toaster
            toastOptions={{
              className: "dark:bg-neutral-800 bg-neutral-50 dark:text-white text-black",
            }}
          />
        </body>
      </html>
    </ViewTransitions>
  );
}
