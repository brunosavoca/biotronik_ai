"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { Building, Heart, Cog, Message } from "@mynaui/icons-react";

export default function Home() {
  const { data: session } = useSession();
  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-lg">
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
                      <Message className="w-4 h-4" />
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
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-600/25">
                <Heart className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 dark:text-white mb-4 tracking-tight">
              <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">Biotronik</span>
              <br />
              Asistente IA para Cardiólogos
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-lg mx-auto">
              Soporte avanzado de IA para medicina cardiovascular. Chat inteligente y formularios profesionales para solicitudes de dispositivos.
            </p>
          </div>

          {/* Main Tools */}
          <div className="flex flex-col md:flex-row justify-center gap-6 mb-8">
            {/* Chat IA */}
            <Link href="/chat">
              <Button 
                size="lg" 
                className="w-full md:w-80 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-6 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl shadow-blue-600/25 hover:shadow-blue-600/40 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex flex-col items-center justify-center space-y-2"
              >
                <Message className="w-8 h-8" />
                <div className="text-center">
                  <div className="font-bold">Chat IA Médico</div>
                  <div className="text-sm text-blue-100">Consulta inteligente cardiovascular</div>
                </div>
              </Button>
            </Link>

            {/* Formulario Médico */}
            <Link href="/form">
              <Button 
                size="lg" 
                className="w-full md:w-80 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-6 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl shadow-green-600/25 hover:shadow-green-600/40 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex flex-col items-center justify-center space-y-2"
              >
                <span className="text-3xl">📋</span>
                <div className="text-center">
                  <div className="font-bold">Formulario Médico</div>
                  <div className="text-sm text-green-100">Solicitud de dispositivos IA</div>
                </div>
              </Button>
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto text-sm">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
              <div className="text-blue-600 dark:text-blue-400 font-semibold mb-1">Chat Inteligente</div>
              <div className="text-gray-600 dark:text-gray-400">Diagnósticos, protocolos y guías clínicas con IA</div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
              <div className="text-green-600 dark:text-green-400 font-semibold mb-1">Reportes Profesionales</div>
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