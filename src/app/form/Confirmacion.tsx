import React from "react";
import { CheckCircleIcon } from "@/lib/icons";

export default function Confirmacion() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-8">
      <CheckCircleIcon className="w-16 h-16 text-blue-600 mb-4" />
      <h2 className="text-2xl font-bold text-blue-700 mb-2">¡Formulario recibido!</h2>
      <p className="text-blue-900 text-center">Gracias por enviar la información del paciente.<br />Nos pondremos en contacto si es necesario.</p>
    </div>
  );
}
