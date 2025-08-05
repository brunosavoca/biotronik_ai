import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();

    // Construir el prompt para OpenAI
    const prompt = `
Como especialista en cardiología, genera un informe médico profesional para solicitud de dispositivo cardiovascular basado en los siguientes datos del paciente:

DATOS DEL PACIENTE:
- Nombre: ${formData.nombre} ${formData.apellido}
- Edad: ${formData.edad} años
- Historia Clínica: ${formData.historiaClinica}
- Resumen clínico: ${formData.resumenClinico}

SÍNTOMAS ACTUALES:
${Object.entries(formData.sintomas)
  .filter(([key, value]) => value === true && key !== 'otroDescripcion')
  .map(([key]) => `- ${key.charAt(0).toUpperCase() + key.slice(1)}`)
  .join('\n')}
${formData.sintomas.otro && formData.sintomas.otroDescripcion ? `- Otro: ${formData.sintomas.otroDescripcion}` : ''}

ESTUDIOS COMPLEMENTARIOS:
Ecocardiograma:
- FEVI: ${formData.ecocardiograma.fevi}
- Diámetros: ${formData.ecocardiograma.diametros}
- Valvulopatías: ${formData.ecocardiograma.valvulopatias}

Holter:
- Pausas: ${formData.holter.pausas}
- Bloqueos AV: ${formData.holter.bloqueosAV}
- Episodios de FA: ${formData.holter.episodiosFA}

ECG:
- Ritmo: ${formData.ecg.ritmo}
- Bloqueos: ${formData.ecg.bloqueos}
- QRS: ${formData.ecg.qrs}
- Alteraciones: ${formData.ecg.alteraciones}

SOLICITUD: ${formData.tipoSolicitud}

Por favor, genera un informe médico completo que incluya:

1. HISTORIA CLÍNICA RESUMIDA: Resumen profesional del caso clínico

2. JUSTIFICACIÓN MÉDICA: Justificación detallada para la solicitud del dispositivo, incluyendo citas específicas de guías clínicas relevantes (ESC, AHA, SAC) con sus DOI correspondientes

3. CLASIFICACIÓN DE INDICACIÓN: Determina si es Clase I, IIa o IIb según las guías internacionales

4. CONCLUSIÓN: Recomendación clara para la obra social

El informe debe estar redactado en terminología médica profesional argentina, siguiendo el formato estándar para presentaciones a obras sociales.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Eres un cardiólogo especialista en Argentina con amplia experiencia en solicitudes de dispositivos cardiovasculares para obras sociales. Redacta informes médicos profesionales siguiendo las guías internacionales ESC, AHA y SAC."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });

    const reporte = completion.choices[0].message.content;

    return NextResponse.json({
      success: true,
      reporte,
      paciente: {
        nombre: formData.nombre,
        apellido: formData.apellido,
        edad: formData.edad,
        historiaClinica: formData.historiaClinica
      },
      tipoSolicitud: formData.tipoSolicitud
    });

  } catch (error) {
    console.error("Error generando reporte:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Error al generar el reporte médico. Verifique que todos los campos estén completos." 
      },
      { status: 500 }
    );
  }
}