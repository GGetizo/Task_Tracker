import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/context/authProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Task Tracker",
  description: "For ALPHA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
      <body className={inter.className}>{children}</body>
      </AuthProvider>
    </html>
  );
}
