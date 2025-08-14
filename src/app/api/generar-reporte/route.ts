import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

export async function POST(request: NextRequest) {
  try {
    if (!openai) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }
    
    const formData = await request.json();

    // Create a readable stream
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        
        // Send progress updates
        const sendProgress = (step: string, percentage: number) => {
          const data = JSON.stringify({ type: 'progress', step, percentage }) + '\n';
          controller.enqueue(encoder.encode(data));
        };

        try {
          sendProgress('Analizando datos del paciente...', 10);
          await new Promise(resolve => setTimeout(resolve, 500));

          sendProgress('Procesando síntomas y antecedentes clínicos...', 20);
          await new Promise(resolve => setTimeout(resolve, 500));

          sendProgress('Evaluando estudios complementarios (ECG, Holter, Ecocardiograma)...', 30);
          await new Promise(resolve => setTimeout(resolve, 500));

          sendProgress('Consultando guías médicas internacionales (ESC, AHA, SAC)...', 40);
          await new Promise(resolve => setTimeout(resolve, 500));

          sendProgress('Determinando clasificación de indicación según criterios clínicos...', 50);
          await new Promise(resolve => setTimeout(resolve, 500));

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

Por favor, genera un informe médico completo en formato HTML limpio que incluya:

1. HISTORIA CLÍNICA RESUMIDA: Resumen profesional del caso clínico

2. JUSTIFICACIÓN MÉDICA: Justificación detallada para la solicitud del dispositivo, incluyendo citas específicas de guías clínicas relevantes (ESC, AHA, SAC) con sus DOI correspondientes

3. CLASIFICACIÓN DE INDICACIÓN: Determina si es Clase I, IIa o IIb según las guías internacionales

4. CONCLUSIÓN: Recomendación clara para la obra social

IMPORTANTE: 
- Utiliza formato HTML con etiquetas <h3>, <p>, <strong>, <em>, <ul>, <li> para estructurar el contenido
- NO uses markdown (**, *, etc.)
- Utiliza terminología médica profesional argentina
- Sigue el formato estándar para presentaciones a obras sociales
- Estructura el contenido de forma clara y profesional
`;

          sendProgress('Generando informe médico con inteligencia artificial...', 60);

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
            stream: true, // Enable streaming
          });

          sendProgress('Redactando historia clínica y justificación médica...', 70);

          let reporte = '';
          let charCount = 0;
          
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content || '';
            reporte += content;
            charCount += content.length;
            
            // Update progress based on content generation
            if (charCount > 500 && charCount < 1000) {
              sendProgress('Elaborando justificación con referencias bibliográficas...', 80);
            } else if (charCount > 1500 && charCount < 2000) {
              sendProgress('Determinando clasificación según guías internacionales...', 90);
            }
          }

          sendProgress('Finalizando y formateando el informe...', 95);
          await new Promise(resolve => setTimeout(resolve, 500));

          // Send the final report
          const finalData = JSON.stringify({
            type: 'complete',
            success: true,
            reporte,
            paciente: {
              nombre: formData.nombre,
              apellido: formData.apellido,
              edad: formData.edad,
              historiaClinica: formData.historiaClinica
            },
            tipoSolicitud: formData.tipoSolicitud
          }) + '\n';
          
          controller.enqueue(encoder.encode(finalData));
          sendProgress('¡Informe médico generado exitosamente!', 100);
          
        } catch (error) {
          console.error("Error generando reporte:", error);
          const errorData = JSON.stringify({
            type: 'error',
            success: false,
            error: "Error al generar el reporte médico. Verifique que todos los campos estén completos."
          }) + '\n';
          controller.enqueue(encoder.encode(errorData));
        } finally {
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error("Error in request:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Error al procesar la solicitud." 
      },
      { status: 500 }
    );
  }
}