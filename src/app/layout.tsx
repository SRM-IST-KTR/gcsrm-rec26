import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SRM GitHub Community",
  description: "Join the GitHub SRM Community — your path to the playground.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}