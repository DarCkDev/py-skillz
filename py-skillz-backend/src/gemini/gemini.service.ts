// src/ia/gemini.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class GeminiService {
  private ai: GoogleGenAI;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    this.ai = new GoogleGenAI({ apiKey });
  }

  async sendMessage(message: string): Promise<string> {
    const model = 'gemini-2.5-flash-preview-05-20';
    const config = { responseMimeType: 'text/plain' };

    // Filtro para peticiones no educativas
    const bannedPhrases = [
      'hazme el código',
      'resuelve esto por mí',
      'dame la respuesta',
      'escribe el código completo',
    ];

    for (const phrase of bannedPhrases) {
      if (message.toLowerCase().includes(phrase)) {
        return 'Como asistente educativo, te ayudaré a entender el problema, pero no puedo darte la solución directa. ¿Quieres que te dé una pista o repasemos el concepto? 😊';
      }
    }

    const contents = [
      {
        role: 'system',
        parts: [
          {
            text: ` Eres un asistente educativo para estudiantes principiantes en programación con Python.
                    Tu rol es guiar, orientar y fomentar el pensamiento crítico.
                    No debes dar respuestas completas ni código directamente, a menos que sea absolutamente necesario.
                    En su lugar, debes hacer preguntas, dar pistas, explicar conceptos y ayudarles a entender por sí mismos.

                    Si el usuario muestra un error en su código, explícale qué significa el error, dale sugerencias para corregirlo y anímalo a intentarlo de nuevo.
                    Evita siempre resolverle el problema completo sin su participación activa.
                    Usa un tono amigable, paciente y alentador.`.trim(),
          },
        ],
      },
      {
        role: 'user',
        parts: [{ text: message }],
      },
    ];

    try {
      const response = await this.ai.models.generateContentStream({
        model,
        config,
        contents,
      });

      let result = '';
      for await (const chunk of response) {
        result += chunk.text;
      }

      return result || 'Sin respuesta del modelo';
    } catch (error) {
      console.error('Error con Gemini API:', error);
      return 'Error al contactar al asistente IA.';
    }
  }
}
