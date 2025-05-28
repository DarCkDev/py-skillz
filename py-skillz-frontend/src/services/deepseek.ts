import axios from "axios";

const HF_API_KEY = import.meta.env.VITE_HUGGINGFACE_API_KEY;

export const consultarDeepseek = async (prompt: string): Promise<string> => {
  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/deepseek-ai/deepseek-coder-6.7b-instruct",
      {
        inputs: prompt,
      },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
        },
      }
    );

    return response.data?.generated_text ?? "Sin respuesta";
  } catch (error) {
    console.error("Error consultando Deepseek:", error);
    return "Error al consultar Deepseek.";
  }
};
