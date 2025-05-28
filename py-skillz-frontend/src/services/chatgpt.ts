import axios from "axios";

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

export const consultarChatGPT = async (mensaje: string) => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Eres un asistente de programación útil." },
          { role: "user", content: mensaje }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error consultando ChatGPT:", error);
    return "Hubo un error al comunicarse con ChatGPT.";
  }
};
