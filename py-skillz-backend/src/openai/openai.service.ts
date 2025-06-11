import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class OpenAIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY, // asegúrate de tener esta variable en .env
    });
  }

  async generateResponse(prompt: string): Promise<string> {
  try {
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    return completion.choices[0]?.message?.content ?? 'Sin respuesta.';
  } catch (error) {
    console.error('Error en OpenAIService:', error);
    throw error; // Deja que Nest lo maneje como 500
  }
}

}
