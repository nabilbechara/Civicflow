import type { Metadata } from "next";
import { DM_Sans, Sora } from "next/font/google";
import { AuthProvider } from "@/context/auth-context";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "CivicFlow Lebanon",
  description: "Web-based municipality services portal for Lebanon",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sora.variable} ${dmSans.variable}`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
