import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class HuggingFaceService {
  private readonly API_URL = 'https://api-inference.huggingface.co/models/flax-community/gpt-2-spanish';
  private readonly API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;

  async generateResponse(prompt: string): Promise<string> {
    try {
      const response = await axios.post(
        this.API_URL,
        { inputs: prompt },
        {
          headers: {
            Authorization: `Bearer ${this.API_TOKEN}`,
            'Content-Type': 'application/json',
          },
        },
      );

      // El modelo responde como string o array de resultados
      const data = response.data;

      if (typeof data === 'string') return data;
      if (Array.isArray(data) && data[0]?.generated_text) {
        return data[0].generated_text;
      }

      return 'No se pudo generar respuesta.';
    } catch (error) {
      console.error('Error en HuggingFace:', error?.response?.data || error.message);
      return 'Error al conectar con Hugging Face.';
    }
  }
}
