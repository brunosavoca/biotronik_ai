
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Biotronik",
  description: "Asistente de IA para cardiólogos con administración de usuarios",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <nav className="w-full bg-white dark:bg-blue-950 border-b border-blue-100 dark:border-blue-900 shadow-sm py-2 px-4 flex items-center gap-4 justify-between">
            <div className="flex items-center gap-2">
              <Link href="/">
                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-blue-700 dark:text-blue-200 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-800 shadow-sm hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors">
                  Biotronik
                </button>
              </Link>
              <Link href="/chat">
                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-blue-700 dark:text-blue-200 bg-white dark:bg-blue-950 border border-blue-200 dark:border-blue-800 shadow-sm hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors">
                  Chat
                </button>
              </Link>
              <Link href="/form">
                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-blue-700 dark:text-blue-200 bg-white dark:bg-blue-950 border border-blue-200 dark:border-blue-800 shadow-sm hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors">
                  Formulario
                </button>
              </Link>
            </div>
          </nav>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
