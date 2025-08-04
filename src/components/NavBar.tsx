"use client"

import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import React from "react";

export const NavBar = React.memo(function NavBar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  
  // No mostrar navegación en la página principal si no hay sesión
  if (pathname === "/" && !session) {
    return null;
  }
  
  // No mostrar navegación en páginas de autenticación
  if (pathname.startsWith("/auth/")) {
    return null;
  }

  return (
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
  );
});