import "./globals.css";
import { satoshi } from "@/fonts/fonts";
import { commonMetadata } from "@/constants/metadata";
import { Toaster } from "react-hot-toast";

export const metadata = commonMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${satoshi.variable} ${satoshi.className} antialiased bg-neutral-50 bodyWebSite`}>
        {children}
        <Toaster
          toastOptions={{
            className: "dark:bg-primary-900 bg-neutral-50 dark:text-white text-black",
          }}
        />
      </body>
    </html>
  );
}
