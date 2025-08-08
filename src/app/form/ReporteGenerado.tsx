"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

interface FormData {
  nombre: string;
  apellido: string;
  edad: string;
  historiaClinica: string;
  resumenClinico: string;
  sintomas: {
    palpitaciones: boolean;
    mareos: boolean;
    disnea: boolean;
    dolorToracico: boolean;
    otro: boolean;
    otroDescripcion: string;
  };
  ecocardiograma: {
    fevi: string;
    diametros: string;
    valvulopatias: string;
  };
  holter: {
    pausas: string;
    bloqueosAV: string;
    episodiosFA: string;
  };
  ecg: {
    ritmo: string;
    bloqueos: string;
    qrs: string;
    alteraciones: string;
  };
  tipoSolicitud: string;
}

interface ReporteGeneradoProps {
  formData: FormData;
}

export default function ReporteGenerado({ formData }: ReporteGeneradoProps) {
  const [reporte, setReporte] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [sending, setSending] = useState(false)
  const [sendMessage, setSendMessage] = useState<string>("")
  const [recipients, setRecipients] = useState<{id:string,email:string,name?:string}[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [extraEmail, setExtraEmail] = useState<string>("")

  const generateReport = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/generar-reporte", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setReporte(data.reporte);
      } else {
        setError(data.error || "Error al generar el reporte");
      }
    } catch (err) {
      setError("Error de conexión al generar el reporte");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  }, [formData]);

  useEffect(() => {
    generateReport();
  }, [generateReport]);

  useEffect(() => {
    // cargar destinatarios habilitados desde la DB (Neon via Prisma)
    (async ()=>{
      try {
        const res = await fetch('/api/email-recipients')
        if (res.ok) {
          const data = await res.json()
          setRecipients(data.recipients || [])
        }
      } catch (e) {
        console.error('No se pudieron cargar destinatarios', e)
      }
    })()
  }, [])

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const printReport = () => {
    window.print();
  };

  const sendReportByEmail = async () => {
    setSendMessage("")
    setSending(true)
    try {
      const subject = `Reporte Médico - ${formData.apellido}, ${formData.nombre} (${new Date().toLocaleDateString('es-AR')})`
      const htmlContent = `
        <div style="font-family: Georgia, serif; font-size: 16px; line-height: 1.7; color: #111">
          <div style="border-bottom: 2px solid #2563eb; padding-bottom: 12px; margin-bottom: 16px">
            <h2 style="margin:0;color:#2563eb">INFORME MÉDICO CARDIOVASCULAR</h2>
            <p style="margin:4px 0;color:#555">Paciente: <strong>${formData.nombre} ${formData.apellido}</strong> | Edad: ${formData.edad} | HC: ${formData.historiaClinica}</p>
            <p style="margin:0;color:#777">Solicitud: ${formData.tipoSolicitud.replace(/-/g, ' ').toUpperCase()}</p>
          </div>
          ${reporte}
          <hr />
          <p style="font-size:12px;color:#666">Documento generado por Sistema Biotronik - ${new Date().toLocaleString('es-AR')}</p>
        </div>`
      // construir override recipients: seleccionados + extraEmail válido
      let override: string[] | undefined
      const selected = recipients.filter(r => selectedIds.has(r.id)).map(r => r.email)
      const extra = extraEmail.trim()
      const looksEmail = extra.length === 0 || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(extra)
      if (!looksEmail) {
        throw new Error('El email adicional no es válido')
      }
      override = [...selected]
      if (extra.length > 0) override.push(extra)
      if (override.length === 0) {
        // si no hay override, la API usará la lista pre-cargada habilitada
        override = undefined
      }
      const res = await fetch('/api/reporte/enviar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, html: htmlContent, overrideRecipients: override })
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'No se pudo enviar el reporte')
      }
      setSendMessage('Reporte enviado correctamente a la lista pre-cargada ✅')
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'desconocido'
      setSendMessage(`Error al enviar: ${msg}`)
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-blue-700 mb-2">Generando Reporte Médico</h2>
          <p className="text-gray-600">Procesando información con inteligencia artificial...</p>
          <div className="mt-4 text-sm text-gray-500">
            Esto puede tomar unos momentos mientras nuestro sistema analiza los datos clínicos.
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error al Generar Reporte</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Intentar Nuevamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Navigation */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6 no-print">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-lg font-bold">🏥</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-blue-700">✅ Reporte Médico Generado</h1>
                <p className="text-sm text-gray-600">Paciente: {formData.nombre} {formData.apellido}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/">
                <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors flex items-center gap-2">
                  🏠 Inicio
                </button>
              </Link>
              <Link href="/chat">
                <button className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium transition-colors flex items-center gap-2">
                  💬 Chat IA
                </button>
              </Link>
              <Link href="/form">
                <button className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg font-medium transition-colors flex items-center gap-2">
                  📋 Nuevo Formulario
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 no-print">
          {/* Selector de destinatarios */}
          <div className="mb-4">
            <h3 className="text-md font-semibold mb-2">Destinatarios frecuentes</h3>
            {recipients.length === 0 ? (
              <div className="text-sm text-gray-500">No hay destinatarios pre-cargados habilitados. Usa el campo de email adicional o configura la lista en Admin.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {recipients.map(r => (
                  <label key={r.id} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="accent-blue-600" checked={selectedIds.has(r.id)} onChange={()=>toggleSelect(r.id)} />
                    <span>{r.email}{r.name ? ` — ${r.name}` : ''}</span>
                  </label>
                ))}
              </div>
            )}
            <div className="mt-3">
              <input
                type="email"
                value={extraEmail}
                onChange={(e)=>setExtraEmail(e.target.value)}
                placeholder="Agregar email adicional (opcional)"
                className="w-full md:w-1/2 px-3 py-2 border rounded-md"
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <button
              onClick={printReport}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
            >
              🖨️ Imprimir PDF
            </button>
            <button
              onClick={sendReportByEmail}
              disabled={sending}
              className={`px-6 py-3 rounded-lg transition-colors flex items-center gap-2 font-medium ${sending ? 'bg-gray-400 text-white' : 'bg-purple-600 hover:bg-purple-700 text-white'}`}
            >
              {sending ? 'Enviando…' : '✉️ Enviar'}
            </button>
          </div>
          {sendMessage && (
            <div className={`mt-4 text-sm ${sendMessage.startsWith('Error') ? 'text-red-600' : 'text-green-700'}`}>
              {sendMessage}
            </div>
          )}
        </div>

        {/* Datos del paciente */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-blue-800 mb-4">📋 DATOS DEL PACIENTE</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><strong>Nombre:</strong> {formData.nombre} {formData.apellido}</div>
            <div><strong>Edad:</strong> {formData.edad} años</div>
            <div><strong>Historia Clínica:</strong> {formData.historiaClinica}</div>
            <div><strong>Tipo de Solicitud:</strong> {formData.tipoSolicitud.replace(/-/g, ' ').toUpperCase()}</div>
          </div>
        </div>

        {/* Reporte médico */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          <div className="bg-blue-600 text-white p-4">
            <h2 className="text-xl font-bold text-center">INFORME MÉDICO CARDIOVASCULAR</h2>
            <p className="text-center text-blue-100">Fecha: {new Date().toLocaleDateString('es-AR')}</p>
          </div>
          
          <div className="p-8">
            <div className="prose prose-lg max-w-none">
              <div 
                className="text-gray-800 leading-relaxed medical-report"
                style={{ fontFamily: 'Georgia, serif', fontSize: '16px', lineHeight: '1.7' }}
                dangerouslySetInnerHTML={{ __html: reporte }}
              />
            </div>
            
            <style jsx>{`
              .medical-report h3 {
                color: #1e40af;
                font-weight: bold;
                font-size: 18px;
                margin: 25px 0 15px 0;
                border-bottom: 2px solid #e5e7eb;
                padding-bottom: 8px;
              }
              
              .medical-report p {
                margin: 12px 0;
                text-align: justify;
                line-height: 1.8;
              }
              
              .medical-report strong {
                font-weight: bold;
                color: #374151;
              }
              
              .medical-report ul {
                margin: 15px 0;
                padding-left: 25px;
              }
              
              .medical-report li {
                margin: 8px 0;
                line-height: 1.6;
              }
              
              .medical-report em {
                font-style: italic;
                color: #6b7280;
              }
            `}</style>
          </div>
          
          <div className="bg-gray-50 p-4 border-t text-center text-sm text-gray-600">
            <p>Documento generado por Sistema Biotronik - {new Date().toLocaleString('es-AR')}</p>
            <p className="mt-1">Este informe ha sido generado con asistencia de inteligencia artificial y debe ser revisado por un profesional médico.</p>
          </div>
        </div>

        {/* Instrucciones */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mt-6 no-print">
          <h3 className="text-lg font-bold text-yellow-800 mb-3">📌 Instrucciones</h3>
          <ul className="text-yellow-700 space-y-2 text-sm">
            <li>• <strong>Revisión:</strong> Este reporte debe ser revisado y validado por un médico especialista antes de su presentación.</li>
            <li>• <strong>Documentación:</strong> Adjunte todos los estudios complementarios mencionados en el informe.</li>
            <li>• <strong>Presentación:</strong> El reporte está listo para ser presentado a la obra social correspondiente.</li>
            <li>• <strong>Formato:</strong> Para obtener un PDF profesional, use la función &quot;Imprimir&quot; y seleccione &quot;Guardar como PDF&quot;.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}