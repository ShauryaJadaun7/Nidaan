import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SwasthyaAI - AI Health Triage",
  description: "Rural India multilingual AI health triage system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased text-slate-900 bg-warm-50" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
