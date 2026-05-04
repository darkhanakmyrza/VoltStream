import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: "VoltStream | Live Battery Telemetry",
  description: "Industrial-grade IoT battery analytics dashboard for real-time telemetry monitoring.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-sans text-slate-950">{children}</body>
    </html>
  );
}
