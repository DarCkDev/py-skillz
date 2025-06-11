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

    const contents = [
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
