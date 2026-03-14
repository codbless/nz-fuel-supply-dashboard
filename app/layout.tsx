import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NZ Fuel Supply Dashboard",
  description:
    "A dark-market dashboard tracking global oil signals, NZ imports, tanker activity, pump prices, and storage cover.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
