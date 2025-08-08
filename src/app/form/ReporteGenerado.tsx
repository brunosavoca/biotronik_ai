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
  const [progress, setProgress] = useState({ step: "", percentage: 0 });

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

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No se pudo leer la respuesta');
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        const lines = text.split('\n').filter(line => line.trim());

        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            
            if (data.type === 'progress') {
              setProgress({ step: data.step, percentage: data.percentage });
            } else if (data.type === 'complete') {
              if (data.success) {
                setReporte(data.reporte);
                setLoading(false);
              } else {
                setError(data.error || "Error al generar el reporte");
                setLoading(false);
              }
            } else if (data.type === 'error') {
              setError(data.error || "Error al generar el reporte");
              setLoading(false);
            }
          } catch (e) {
            console.error('Error parsing JSON:', e);
          }
        }
      }
    } catch (err) {
      setError("Error de conexión al generar el reporte");
      console.error("Error:", err);
      setLoading(false);
    }
  }, [formData]);

  useEffect(() => {
    generateReport();
  }, [generateReport]);

  const downloadPDF = () => {
    // Crear el contenido HTML para el PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Reporte Médico - ${formData.nombre} ${formData.apellido}</title>
        <style>
          body {
            font-family: 'Times New Roman', serif;
            line-height: 1.6;
            color: #333;
            max-width: 210mm;
            margin: 0 auto;
            padding: 20mm;
            background: white;
          }
          
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 20px;
          }
          
          .header h1 {
            color: #2563eb;
            font-size: 24px;
            margin: 0;
          }
          
          .header h2 {
            color: #666;
            font-size: 16px;
            margin: 5px 0;
          }
          
          .patient-info {
            background: #f8fafc;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 25px;
            border-left: 4px solid #2563eb;
          }
          
          .patient-info h3 {
            color: #2563eb;
            margin-top: 0;
          }
          
          .content {
            font-size: 14px;
            line-height: 1.8;
          }
          
          .content h3 {
            color: #1e40af;
            font-weight: bold;
            font-size: 16px;
            margin: 20px 0 10px 0;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 5px;
          }
          
          .content p {
            margin: 10px 0;
            text-align: justify;
          }
          
          .content strong {
            font-weight: bold;
            color: #374151;
          }
          
          .content ul {
            margin: 10px 0;
            padding-left: 20px;
          }
          
          .content li {
            margin: 5px 0;
          }
          
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            text-align: center;
            color: #666;
            font-size: 12px;
          }
          
          @media print {
            body { margin: 0; padding: 15mm; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>INFORME MÉDICO CARDIOVASCULAR</h1>
          <h2>Solicitud de Dispositivo Médico</h2>
          <p>Fecha: ${new Date().toLocaleDateString('es-AR')}</p>
        </div>
        
        <div class="patient-info">
          <h3>DATOS DEL PACIENTE</h3>
          <p><strong>Nombre:</strong> ${formData.nombre} ${formData.apellido}</p>
          <p><strong>Edad:</strong> ${formData.edad} años</p>
          <p><strong>Historia Clínica:</strong> ${formData.historiaClinica}</p>
          <p><strong>Solicitud:</strong> ${formData.tipoSolicitud.replace(/-/g, ' ').toUpperCase()}</p>
        </div>
        
        <div class="content">
          ${reporte}
        </div>
        
        <div class="footer">
          <p>Documento generado por Sistema Biotronik - ${new Date().toLocaleString('es-AR')}</p>
          <p>Este informe ha sido generado con asistencia de inteligencia artificial y debe ser revisado por un profesional médico.</p>
        </div>
      </body>
      </html>
    `;

    // Crear un Blob con el contenido HTML
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Crear un enlace temporal para descargar
    const link = document.createElement('a');
    link.href = url;
    link.download = `Reporte_Medico_${formData.apellido}_${formData.nombre}_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const printReport = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-2xl w-full mx-auto p-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h2 className="text-3xl font-bold text-blue-700 mb-2">Generando Reporte Médico</h2>
              <p className="text-gray-600 text-lg">Procesando información con inteligencia artificial</p>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progreso</span>
                <span>{progress.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
            </div>

            {/* Current Step */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-blue-800 font-medium">{progress.step || 'Iniciando proceso...'}</p>
                </div>
              </div>
            </div>

            {/* Process Steps */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Etapas del proceso:</h3>
              {[
                { step: 'Análisis de datos del paciente', threshold: 10 },
                { step: 'Procesamiento de síntomas y antecedentes', threshold: 20 },
                { step: 'Evaluación de estudios complementarios', threshold: 30 },
                { step: 'Consulta de guías médicas internacionales', threshold: 40 },
                { step: 'Clasificación según criterios clínicos', threshold: 50 },
                { step: 'Generación del informe con IA', threshold: 60 },
                { step: 'Redacción y referencias bibliográficas', threshold: 80 },
                { step: 'Finalización y formato profesional', threshold: 95 }
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                    progress.percentage >= item.threshold 
                      ? 'bg-green-500' 
                      : progress.percentage > item.threshold - 10 
                      ? 'bg-blue-500' 
                      : 'bg-gray-300'
                  }`}>
                    {progress.percentage >= item.threshold ? (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : progress.percentage > item.threshold - 10 ? (
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    ) : null}
                  </div>
                  <span className={`text-sm ${
                    progress.percentage >= item.threshold 
                      ? 'text-green-700 font-medium' 
                      : progress.percentage > item.threshold - 10 
                      ? 'text-blue-700 font-medium' 
                      : 'text-gray-500'
                  }`}>
                    {item.step}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                Este proceso utiliza tecnología avanzada de IA para generar un informe médico completo y profesional.
              </p>
            </div>
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
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <button
              onClick={printReport}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
            >
              🖨️ Imprimir PDF
            </button>
            <button
              onClick={downloadPDF}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 font-medium"
            >
              📄 Descargar HTML
            </button>
          </div>
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