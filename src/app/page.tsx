"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { Building, Heart, Cog } from "@mynaui/icons-react";

export default function Home() {
  const { data: session } = useSession();
  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-medium text-gray-900 dark:text-white">
                Biotronik
              </span>
            </div>
            <div className="flex items-center space-x-4">
              {session && (session.user.role === "ADMIN" || session.user.role === "SUPERADMIN") && (
                <Link href="/admin">
                  <Button variant="outline" size="sm" className="flex items-center space-x-2">
                    <Cog className="w-4 h-4" />
                    <span>Admin</span>
                  </Button>
                </Link>
              )}
              {session && (
                <>
                  <Link href="/chat">
                    <Button variant="outline" size="sm" className="flex items-center space-x-2">
                      <span className="text-sm">💬</span>
                      <span>Chat</span>
                    </Button>
                  </Link>
                  <Link href="/form">
                    <Button variant="outline" size="sm" className="flex items-center space-x-2">
                      <span className="text-sm">📋</span>
                      <span>Formulario</span>
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            {/* Hero Logo */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center">
                <Heart className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 dark:text-white mb-4 tracking-tight">
              <span className="text-blue-600 dark:text-blue-400">Biotronik</span>
              <br />
              Asistente IA para Cardiólogos
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-lg mx-auto">
              Soporte avanzado de IA para medicina cardiovascular. Chat inteligente y formularios profesionales para solicitudes de dispositivos.
            </p>
          </div>

          {/* Main Tools */}
          <div className="flex flex-col md:flex-row justify-center gap-8 mb-12">
            {/* Chat IA */}
            <Link href="/chat" className="group">
              <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/30 border border-blue-200 dark:border-blue-700 rounded-2xl p-8 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1 cursor-pointer w-full md:w-80 h-48">
                <div className="absolute top-6 right-6 w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div className="space-y-3 pr-16">
                  <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100 group-hover:text-blue-600 transition-colors">
                    Chat IA Médico
                  </h3>
                  <p className="text-blue-700 dark:text-blue-300 text-base leading-relaxed">
                    Consulta inteligente con IA especializada en medicina cardiovascular
                  </p>
                  <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium pt-2">
                    <span>Iniciar consulta</span>
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>

            {/* Formulario Médico */}
            <Link href="/form" className="group">
              <div className="relative overflow-hidden bg-gradient-to-br from-teal-50 to-cyan-100 dark:from-teal-900/20 dark:to-cyan-800/30 border border-teal-200 dark:border-teal-700 rounded-2xl p-8 hover:shadow-lg hover:shadow-teal-500/10 transition-all duration-300 hover:-translate-y-1 cursor-pointer w-full md:w-80 h-48">
                <div className="absolute top-6 right-6 w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="space-y-3 pr-16">
                  <h3 className="text-2xl font-bold text-teal-900 dark:text-teal-100 group-hover:text-teal-600 transition-colors">
                    Formulario Médico
                  </h3>
                  <p className="text-teal-700 dark:text-teal-300 text-base leading-relaxed">
                    Solicitudes de dispositivos con justificación médica automática
                  </p>
                  <div className="flex items-center text-teal-600 dark:text-teal-400 text-sm font-medium pt-2">
                    <span>Crear formulario</span>
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto text-sm mt-12">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
              <div className="text-blue-600 dark:text-blue-400 font-semibold mb-1">Chat Inteligente</div>
              <div className="text-gray-600 dark:text-gray-400">Diagnósticos, protocolos y guías clínicas con IA</div>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
              <div className="text-teal-600 dark:text-teal-400 font-semibold mb-1">Reportes Profesionales</div>
              <div className="text-gray-600 dark:text-gray-400">Formularios con justificación médica automática</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 dark:border-gray-800 py-6">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Para uso profesional de cardiólogos licenciados. No para diagnóstico de pacientes.
          </p>
        </div>
      </footer>
    </div>
  );
}