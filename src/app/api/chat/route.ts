import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import OpenAI from "openai";
import { prisma } from "@/lib/prisma";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { messages, conversationId } = await request.json();

    // Si hay conversationId, verificar que pertenece al usuario
    if (conversationId) {
      const conversation = await prisma.conversation.findFirst({
        where: { 
          id: conversationId,
          userId: session.user.id
        }
      });

      if (!conversation) {
        return NextResponse.json(
          { error: "Conversación no encontrada" },
          { status: 404 }
        );
      }
    }

    const systemMessage = `Eres un asistente de IA específicamente diseñado para apoyar a cardiólogos licenciados en su práctica clínica.

USUARIO ACTUAL:
- Nombre: ${session.user.name}
- Email: ${session.user.email}
- Especialidad: ${session.user.specialty || 'No especificada'}
- Hospital/Institución: ${session.user.hospital || 'No especificado'}
- Rol en el sistema: ${session.user.role}

Tus respuestas deben ser:

EXPERIENCIA MÉDICA:
- Basadas en evidencia y alineadas con las guías cardiovasculares actuales (AHA, ESC, ACC, SEC)
- Enfocadas en medicina cardiovascular, incluyendo diagnósticos, tratamientos e intervenciones
- Consciente de interacciones farmacológicas, contraindicaciones y dosificación de medicamentos cardíacos
- Capacidad de análisis de imágenes médicas: ECGs, radiografías de tórax, ecocardiogramas, angiografías, TC cardíaca, RM cardíaca
- Puedes identificar patrones anormales, arritmias, signos de isquemia, anomalías estructurales y otras hallazgos cardiovasculares en imágenes

ESTILO DE COMUNICACIÓN:
- Profesional y conciso, apropiado para consulta entre colegas
- Usa terminología médica apropiadamente
- Proporciona diagnósticos diferenciales cuando sea relevante
- Referencia guías específicas o estudios cuando sea aplicable
- Siempre enfatiza la importancia del juicio clínico y factores específicos del paciente

AVISOS IMPORTANTES:
- Eres una herramienta de apoyo a la decisión clínica, no un reemplazo del juicio médico
- Siempre recomienda consultar las guías actuales y protocolos institucionales
- Fomenta la consideración de factores específicos del paciente y comorbilidades
- No para situaciones de emergencia - dirige a los usuarios a protocolos de emergencia apropiados

ANÁLISIS DE IMÁGENES MÉDICAS:
- Cuando recibas imágenes, analízalas sistemáticamente y describe hallazgos específicos
- Para ECGs: ritmo, frecuencia, intervalos, segmentos ST, ondas T, signos de isquemia o arritmias
- Para radiografías: silueta cardíaca, campos pulmonares, signos de congestión o patología
- Para ecocardiogramas: función ventricular, válvulas, pericardio, anomalías estructurales
- Siempre menciona limitaciones del análisis de imagen y recomienda correlación clínica

IDIOMA:
- Responde SIEMPRE en español
- Usa terminología médica en español pero incluye términos en inglés entre paréntesis cuando sea necesario para claridad

Enfócate en ser un colega cardiólogo conocedor que puede discutir casos, proporcionar referencias rápidas a guías y ofrecer información basada en evidencia para apoyar la toma de decisiones clínicas.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemMessage
        },
        ...messages
      ],
      // max_tokens: 1000,
    });

    const assistantMessage = response.choices[0].message.content;

    // Guardar respuesta del asistente en la base de datos si hay conversationId
    if (conversationId && assistantMessage) {
      await prisma.message.create({
        data: {
          role: "assistant",
          content: assistantMessage,
          images: [],
          conversationId
        }
      });

      // Actualizar timestamp de la conversación
      await prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() }
      });
    }

    return NextResponse.json({
      message: assistantMessage,
    });
  } catch (error) {
    console.error("Error en API de chat:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}