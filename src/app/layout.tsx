import "./globals.css";
import { satoshi } from "@/fonts/fonts";
import { commonMetadata } from "@/constants/metadata";
import { ViewTransitions } from "next-view-transitions";
import { Toaster } from "react-hot-toast";
import NextTopLoader from "nextjs-toploader";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata = commonMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="fr">
        <body
          className={`${satoshi.variable} ${satoshi.className} antialiased bg-neutral-50 dark:bg-neutral-950 bodyWebSite`}
        >
          {/* Loading Bar */}
          <NextTopLoader color="#b21e4b" zIndex={10} showSpinner={false} />
          {/* Theme */}
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {/* App Content */}
            {children}
          </ThemeProvider>
          {/* Toaster */}
          <Toaster
            toastOptions={{
              className: "dark:bg-primary-900 bg-neutral-50 dark:text-white text-black",
            }}
          />
        </body>
      </html>
    </ViewTransitions>
  );
}
