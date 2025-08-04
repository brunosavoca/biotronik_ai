
"use client";
import React, { useState } from "react";
import Confirmacion from "./Confirmacion";

export default function FormPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    fecha_nacimiento: "",
    genero: "",
    cardiopatia: "",
    hipertension: false,
    diabetes: false,
    marcapasos: false,
    otros: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) return <Confirmacion />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 font-sans">
      <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-6">
        {/* Stepper */}
        <div className="flex justify-center mb-6">
          <div className="flex gap-2">
            <div className={`w-3 h-3 rounded-full ${step === 1 ? 'bg-blue-700' : 'bg-blue-200'}`}></div>
            <div className={`w-3 h-3 rounded-full ${step === 2 ? 'bg-blue-700' : 'bg-blue-200'}`}></div>
          </div>
        </div>

        {step === 1 && (
          <div className="bg-white dark:bg-blue-950 rounded-xl shadow-lg p-8 border border-blue-200 dark:border-blue-800 animate-fade-in">
            <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-4 text-center">Datos Personales</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-blue-900 dark:text-blue-200 font-semibold mb-1" htmlFor="nombre">Nombre</label>
                <input id="nombre" name="nombre" type="text" required value={form.nombre} onChange={handleChange} className="w-full px-4 py-2 border border-blue-300 dark:border-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-900 dark:text-blue-100" />
              </div>
              <div>
                <label className="block text-blue-900 dark:text-blue-200 font-semibold mb-1" htmlFor="apellido">Apellido</label>
                <input id="apellido" name="apellido" type="text" required value={form.apellido} onChange={handleChange} className="w-full px-4 py-2 border border-blue-300 dark:border-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-900 dark:text-blue-100" />
              </div>
              <div>
                <label className="block text-blue-900 dark:text-blue-200 font-semibold mb-1" htmlFor="dni">DNI</label>
                <input id="dni" name="dni" type="text" required value={form.dni} onChange={handleChange} className="w-full px-4 py-2 border border-blue-300 dark:border-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-900 dark:text-blue-100" />
              </div>
              <div>
                <label className="block text-blue-900 dark:text-blue-200 font-semibold mb-1" htmlFor="fecha_nacimiento">Fecha de nacimiento</label>
                <input id="fecha_nacimiento" name="fecha_nacimiento" type="date" required value={form.fecha_nacimiento} onChange={handleChange} className="w-full px-4 py-2 border border-blue-300 dark:border-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-900 dark:text-blue-100" />
              </div>
              <div>
                <label className="block text-blue-900 dark:text-blue-200 font-semibold mb-1" htmlFor="genero">Género</label>
                <select id="genero" name="genero" required value={form.genero} onChange={handleChange} className="w-full px-4 py-2 border border-blue-300 dark:border-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-900 dark:text-blue-100">
                  <option value="">Seleccione</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button type="button" onClick={nextStep} className="px-6 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold shadow transition-colors duration-200">Siguiente</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white dark:bg-blue-950 rounded-xl shadow-lg p-8 border border-blue-200 dark:border-blue-800 animate-fade-in">
            <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-4 text-center">Condiciones del Corazón</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-blue-900 dark:text-blue-200 font-semibold mb-1" htmlFor="cardiopatia">¿Tiene alguna cardiopatía diagnosticada?</label>
                <input id="cardiopatia" name="cardiopatia" type="text" value={form.cardiopatia} onChange={handleChange} className="w-full px-4 py-2 border border-blue-300 dark:border-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-900 dark:text-blue-100" placeholder="Ej: Insuficiencia cardíaca, arritmia..." />
              </div>
              <div className="flex items-center gap-3">
                <input id="hipertension" name="hipertension" type="checkbox" checked={form.hipertension} onChange={handleChange} className="accent-blue-700 w-5 h-5" />
                <label htmlFor="hipertension" className="text-blue-900 dark:text-blue-200 font-semibold">Hipertensión</label>
              </div>
              <div className="flex items-center gap-3">
                <input id="diabetes" name="diabetes" type="checkbox" checked={form.diabetes} onChange={handleChange} className="accent-blue-700 w-5 h-5" />
                <label htmlFor="diabetes" className="text-blue-900 dark:text-blue-200 font-semibold">Diabetes</label>
              </div>
              <div className="flex items-center gap-3">
                <input id="marcapasos" name="marcapasos" type="checkbox" checked={form.marcapasos} onChange={handleChange} className="accent-blue-700 w-5 h-5" />
                <label htmlFor="marcapasos" className="text-blue-900 dark:text-blue-200 font-semibold">Marcapasos</label>
              </div>
              <div>
                <label className="block text-blue-900 dark:text-blue-200 font-semibold mb-1" htmlFor="otros">Otros</label>
                <input id="otros" name="otros" type="text" value={form.otros} onChange={handleChange} className="w-full px-4 py-2 border border-blue-300 dark:border-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-900 dark:text-blue-100" placeholder="Otras condiciones..." />
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <button type="button" onClick={prevStep} className="px-6 py-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold shadow transition-colors duration-200">Anterior</button>
              <button type="submit" className="px-6 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold shadow transition-colors duration-200">Enviar</button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
