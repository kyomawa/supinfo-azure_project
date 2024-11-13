import "./globals.css";
import { satoshi } from "@/fonts/fonts";
import { commonMetadata } from "@/constants/metadata";

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
      </body>
    </html>
  );
}
