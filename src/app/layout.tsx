import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";

export const metadata: Metadata = {
    title: "Nirdaan - Clinical Sanctuary",
    description: "Multilingual AI-powered health symptom triage & logistics dashboard",
};

import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import BackgroundAnimation from "@/components/layout/BackgroundAnimation";
import Navbar from "@/components/layout/Navbar";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`font-sans antialiased bg-slate-50 flex flex-col h-screen overflow-hidden text-slate-900`}>
                <AuthProvider>
                    <ProtectedRoute>
                        <BackgroundAnimation />
                        <Navbar />
                        <main className="flex-1 flex flex-col h-full overflow-y-auto relative z-10 pt-28">
                           {children}
                        </main>
                    </ProtectedRoute>
                </AuthProvider>
            </body>
        </html>
    );
}