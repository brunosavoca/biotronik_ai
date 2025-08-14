"use client";
import React, { useState } from "react";
import Link from "next/link";
import ReporteGenerado from "./ReporteGenerado";

export default function FormPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    // Parte 1: Datos del paciente
    nombre: "",
    apellido: "",
    edad: "",
    historiaClinica: "",
    resumenClinico: "",
    sintomas: {
      palpitaciones: false,
      mareos: false,
      disnea: false,
      dolorToracico: false,
      otro: false,
      otroDescripcion: ""
    },
    
    // Parte 2: Estudios
    ecocardiograma: {
      fevi: "",
      diametros: "",
      valvulopatias: ""
    },
    holter: {
      pausas: "",
      bloqueosAV: "",
      episodiosFA: ""
    },
    ecg: {
      ritmo: "",
      bloqueos: "",
      qrs: "",
      alteraciones: ""
    },
    
    // Parte 3: Solicitud
    tipoSolicitud: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setForm(prev => ({
        ...prev,
        [section]: {
          ...prev[section as keyof typeof prev] as object,
          [field]: type === "checkbox" ? checked : value
        }
      }));
    } else if (name.startsWith('sintomas.')) {
      const field = name.replace('sintomas.', '');
      setForm(prev => ({
        ...prev,
        sintomas: {
          ...prev.sintomas,
          [field]: type === "checkbox" ? checked : value
        }
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value
      }));
    }
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) return <ReporteGenerado formData={form} />;

  return (
    <div className="min-h-screen bg-background px-4 font-sans py-8">
      {/* Header with navigation */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-lg font-bold">🏥</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-blue-700">Formulario Médico</h1>
              <p className="text-sm text-gray-600">Sistema de solicitud de dispositivos cardiovasculares</p>
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
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center">
        <form onSubmit={handleSubmit} className="w-full max-w-4xl space-y-6">
        {/* Stepper */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${step === 1 ? 'bg-blue-700' : 'bg-blue-300'}`}>1</div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${step === 2 ? 'bg-blue-700' : 'bg-blue-300'}`}>2</div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${step === 3 ? 'bg-blue-700' : 'bg-blue-300'}`}>3</div>
          </div>
        </div>

        {/* Parte 1: Datos del Paciente */}
        {step === 1 && (
          <div className="bg-white dark:bg-blue-950 rounded-xl shadow-lg p-8 border border-blue-200 dark:border-blue-800">
            <h2 className="text-3xl font-bold text-blue-700 dark:text-blue-300 mb-6 text-center">Parte 1: Datos del Paciente</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-blue-900 dark:text-blue-200 font-semibold mb-2" htmlFor="nombre">Nombre *</label>
                <input 
                  id="nombre" 
                  name="nombre" 
                  type="text" 
                  required 
                  value={form.nombre} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border border-blue-300 dark:border-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-900 dark:text-blue-100" 
                />
              </div>
              
              <div>
                <label className="block text-blue-900 dark:text-blue-200 font-semibold mb-2" htmlFor="apellido">Apellido *</label>
                <input 
                  id="apellido" 
                  name="apellido" 
                  type="text" 
                  required 
                  value={form.apellido} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border border-blue-300 dark:border-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-900 dark:text-blue-100" 
                />
              </div>
              
              <div>
                <label className="block text-blue-900 dark:text-blue-200 font-semibold mb-2" htmlFor="edad">Edad *</label>
                <input 
                  id="edad" 
                  name="edad" 
                  type="number" 
                  required 
                  value={form.edad} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border border-blue-300 dark:border-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-900 dark:text-blue-100" 
                />
              </div>
              
              <div>
                <label className="block text-blue-900 dark:text-blue-200 font-semibold mb-2" htmlFor="historiaClinica">Nº Historia Clínica *</label>
                <input 
                  id="historiaClinica" 
                  name="historiaClinica" 
                  type="text" 
                  required 
                  value={form.historiaClinica} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border border-blue-300 dark:border-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-900 dark:text-blue-100" 
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-blue-900 dark:text-blue-200 font-semibold mb-2" htmlFor="resumenClinico">Resumen clínico abreviado *</label>
              <textarea 
                id="resumenClinico" 
                name="resumenClinico" 
                required 
                value={form.resumenClinico} 
                onChange={handleChange} 
                rows={4}
                placeholder="Ej: síncope, bloqueos, FA, ICC, etc."
                className="w-full px-4 py-3 border border-blue-300 dark:border-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-900 dark:text-blue-100" 
              />
            </div>

            <div className="mb-6">
              <label className="block text-blue-900 dark:text-blue-200 font-semibold mb-4">Síntomas actuales:</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'palpitaciones', label: 'Palpitaciones' },
                  { key: 'mareos', label: 'Mareos' },
                  { key: 'disnea', label: 'Disnea' },
                  { key: 'dolorToracico', label: 'Dolor torácico' },
                  { key: 'otro', label: 'Otro' }
                ].map(sintoma => (
                  <div key={sintoma.key} className="flex items-center gap-3">
                    <input 
                      id={`sintomas.${sintoma.key}`}
                      name={`sintomas.${sintoma.key}`}
                      type="checkbox" 
                      checked={form.sintomas[sintoma.key as keyof typeof form.sintomas] as boolean}
                      onChange={handleChange} 
                      className="accent-blue-700 w-5 h-5" 
                    />
                    <label htmlFor={`sintomas.${sintoma.key}`} className="text-blue-900 dark:text-blue-200 font-medium">{sintoma.label}</label>
                  </div>
                ))}
              </div>
              
              {form.sintomas.otro && (
                <div className="mt-4">
                  <input 
                    name="sintomas.otroDescripcion"
                    type="text" 
                    value={form.sintomas.otroDescripcion}
                    onChange={handleChange} 
                    placeholder="Especificar otro síntoma"
                    className="w-full px-4 py-3 border border-blue-300 dark:border-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-900 dark:text-blue-100" 
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button 
                type="button" 
                onClick={nextStep} 
                className="px-8 py-3 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold shadow-lg transition-colors duration-200"
              >
                Siguiente →
              </button>
            </div>
          </div>
        )}

        {/* Parte 2: Estudios */}
        {step === 2 && (
          <div className="bg-white dark:bg-blue-950 rounded-xl shadow-lg p-8 border border-blue-200 dark:border-blue-800">
            <h2 className="text-3xl font-bold text-blue-700 dark:text-blue-300 mb-6 text-center">Parte 2: Estudios Complementarios</h2>
            
            {/* Ecocardiograma */}
            <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <h3 className="text-xl font-bold text-blue-800 dark:text-blue-200 mb-4">📊 Ecocardiograma abreviado</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-blue-900 dark:text-blue-200 font-semibold mb-2">FEVI (%)</label>
                  <input 
                    name="ecocardiograma.fevi"
                    type="text" 
                    value={form.ecocardiograma.fevi}
                    onChange={handleChange} 
                    placeholder="Ej: 55%"
                    className="w-full px-4 py-3 border border-blue-300 dark:border-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-blue-950 text-blue-900 dark:text-blue-100" 
                  />
                </div>
                <div>
                  <label className="block text-blue-900 dark:text-blue-200 font-semibold mb-2">Diámetros</label>
                  <input 
                    name="ecocardiograma.diametros"
                    type="text" 
                    value={form.ecocardiograma.diametros}
                    onChange={handleChange} 
                    placeholder="Ej: VI 50mm, AI 40mm"
                    className="w-full px-4 py-3 border border-blue-300 dark:border-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-blue-950 text-blue-900 dark:text-blue-100" 
                  />
                </div>
                <div>
                  <label className="block text-blue-900 dark:text-blue-200 font-semibold mb-2">Valvulopatías</label>
                  <input 
                    name="ecocardiograma.valvulopatias"
                    type="text" 
                    value={form.ecocardiograma.valvulopatias}
                    onChange={handleChange} 
                    placeholder="Ej: IM leve, EAo moderada"
                    className="w-full px-4 py-3 border border-blue-300 dark:border-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-blue-950 text-blue-900 dark:text-blue-100" 
                  />
                </div>
              </div>
            </div>

            {/* Holter */}
            <div className="mb-8 p-6 bg-green-50 dark:bg-green-900/30 rounded-lg">
              <h3 className="text-xl font-bold text-green-800 dark:text-green-200 mb-4">📱 Holter</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-green-900 dark:text-green-200 font-semibold mb-2">Pausas</label>
                  <input 
                    name="holter.pausas"
                    type="text" 
                    value={form.holter.pausas}
                    onChange={handleChange} 
                    placeholder="Ej: Pausas máx 3.2s"
                    className="w-full px-4 py-3 border border-green-300 dark:border-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-green-950 text-green-900 dark:text-green-100" 
                  />
                </div>
                <div>
                  <label className="block text-green-900 dark:text-green-200 font-semibold mb-2">Bloqueos AV</label>
                  <input 
                    name="holter.bloqueosAV"
                    type="text" 
                    value={form.holter.bloqueosAV}
                    onChange={handleChange} 
                    placeholder="Ej: BAV 2:1 nocturno"
                    className="w-full px-4 py-3 border border-green-300 dark:border-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-green-950 text-green-900 dark:text-green-100" 
                  />
                </div>
                <div>
                  <label className="block text-green-900 dark:text-green-200 font-semibold mb-2">Episodios de FA</label>
                  <input 
                    name="holter.episodiosFA"
                    type="text" 
                    value={form.holter.episodiosFA}
                    onChange={handleChange} 
                    placeholder="Ej: FA paroxística 3h"
                    className="w-full px-4 py-3 border border-green-300 dark:border-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-green-950 text-green-900 dark:text-green-100" 
                  />
                </div>
              </div>
            </div>

            {/* ECG */}
            <div className="mb-6 p-6 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
              <h3 className="text-xl font-bold text-purple-800 dark:text-purple-200 mb-4">📈 ECG</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-purple-900 dark:text-purple-200 font-semibold mb-2">Ritmo</label>
                  <input 
                    name="ecg.ritmo"
                    type="text" 
                    value={form.ecg.ritmo}
                    onChange={handleChange} 
                    placeholder="Ej: RS, FA, flutter"
                    className="w-full px-4 py-3 border border-purple-300 dark:border-purple-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-purple-950 text-purple-900 dark:text-purple-100" 
                  />
                </div>
                <div>
                  <label className="block text-purple-900 dark:text-purple-200 font-semibold mb-2">Bloqueos</label>
                  <input 
                    name="ecg.bloqueos"
                    type="text" 
                    value={form.ecg.bloqueos}
                    onChange={handleChange} 
                    placeholder="Ej: BRI completo, BAV 1º"
                    className="w-full px-4 py-3 border border-purple-300 dark:border-purple-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-purple-950 text-purple-900 dark:text-purple-100" 
                  />
                </div>
                <div>
                  <label className="block text-purple-900 dark:text-purple-200 font-semibold mb-2">QRS (ms)</label>
                  <input 
                    name="ecg.qrs"
                    type="text" 
                    value={form.ecg.qrs}
                    onChange={handleChange} 
                    placeholder="Ej: 120ms"
                    className="w-full px-4 py-3 border border-purple-300 dark:border-purple-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-purple-950 text-purple-900 dark:text-purple-100" 
                  />
                </div>
                <div>
                  <label className="block text-purple-900 dark:text-purple-200 font-semibold mb-2">Alteraciones relevantes</label>
                  <input 
                    name="ecg.alteraciones"
                    type="text" 
                    value={form.ecg.alteraciones}
                    onChange={handleChange} 
                    placeholder="Ej: HVI, isquemia lateral"
                    className="w-full px-4 py-3 border border-purple-300 dark:border-purple-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-purple-950 text-purple-900 dark:text-purple-100" 
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button 
                type="button" 
                onClick={prevStep} 
                className="px-8 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold shadow-lg transition-colors duration-200"
              >
                ← Anterior
              </button>
              <button 
                type="button" 
                onClick={nextStep} 
                className="px-8 py-3 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold shadow-lg transition-colors duration-200"
              >
                Siguiente →
              </button>
            </div>
          </div>
        )}

        {/* Parte 3: Solicitud */}
        {step === 3 && (
          <div className="bg-white dark:bg-blue-950 rounded-xl shadow-lg p-8 border border-blue-200 dark:border-blue-800">
            <h2 className="text-3xl font-bold text-blue-700 dark:text-blue-300 mb-6 text-center">Parte 3: Solicitud de Dispositivo</h2>
            
            <div className="mb-8">
              <label className="block text-blue-900 dark:text-blue-200 font-semibold mb-4 text-lg">Palabra clave de solicitud *</label>
              <select 
                name="tipoSolicitud"
                required 
                value={form.tipoSolicitud}
                onChange={handleChange} 
                className="w-full px-6 py-4 border border-blue-300 dark:border-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-900 dark:text-blue-100 text-lg font-medium"
              >
                <option value="">Seleccione el tipo de solicitud</option>
                <option value="marcapasos-convencional">Marcapasos convencional</option>
                <option value="marcapasos-cdi">Marcapasos + CDI</option>
                <option value="marcapasos-csp">Marcapasos de estimulación del sistema de conducción (CSP)</option>
                <option value="smartecg-biomonitor">SmartECG con BIOMONITOR IV</option>
                <option value="holter-24hs">Holter 24 hs</option>
              </select>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-bold text-yellow-800 dark:text-yellow-200 mb-2">📋 Resumen de la solicitud</h3>
              <p className="text-yellow-700 dark:text-yellow-300">
                Se generará un reporte médico profesional con:
              </p>
              <ul className="list-disc list-inside text-yellow-700 dark:text-yellow-300 mt-2 space-y-1">
                <li>Historia clínica resumida automática</li>
                <li>Justificación con citas DOI de guías ESC, AHA, SAC</li>
                <li>Clasificación de indicación: Clase I / IIa / IIb</li>
                <li>PDF descargable listo para presentar a la obra social</li>
              </ul>
            </div>

            <div className="flex justify-between">
              <button 
                type="button" 
                onClick={prevStep} 
                className="px-8 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold shadow-lg transition-colors duration-200"
              >
                ← Anterior
              </button>
              <button 
                type="submit" 
                className="px-8 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg transition-colors duration-200"
              >
                🏥 Generar Reporte Médico
              </button>
            </div>
          </div>
        )}
      </form>
      </div>
    </div>
  );
}