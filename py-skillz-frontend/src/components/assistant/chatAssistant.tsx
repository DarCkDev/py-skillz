import React, { useState } from "react";
import { consultarChatGPT } from "../../services/chatgpt";

const ChatAssistant: React.FC = () => {
  const [mensaje, setMensaje] = useState("");
  const [historial, setHistorial] = useState<string[]>([]);

  const manejarEnvio = async () => {
    if (!mensaje.trim()) return;

    setHistorial(prev => [...prev, `Tú: ${mensaje}`]);
    const respuesta = await consultarChatGPT(mensaje);
    setHistorial(prev => [...prev, `IA: ${respuesta}`]);
    setMensaje("");
  };

  return (
    <div className="chat-assistant p-4 border rounded shadow-md w-full max-w-md bg-white">
      <h2 className="text-xl font-bold mb-2">Asistente IA</h2>
      <div className="historial mb-2 h-64 overflow-y-auto border p-2">
        {historial.map((msg, i) => (
          <p key={i} className="mb-1">{msg}</p>
        ))}
      </div>
      <input
        type="text"
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)}
        className="w-full border p-2 mb-2"
        placeholder="Haz una pregunta..."
      />
      <button
        onClick={manejarEnvio}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Enviar
      </button>
    </div>
  );
};

export default ChatAssistant;