import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "GCSRM Recruitments 2026",
  description: "Join the GitHub SRM Community — your path to the playground.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/image.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/image.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}