import React, { useState } from 'react';
import axios from 'axios';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: 'user', text: input };
    setMessages([...messages, userMessage]);
    setInput('');

    try {
      const response = await axios.post('/gemini/chat', { message: input });
      const botMessage = { sender: 'bot', text: response.data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
    }
  };

  return (
    <div style={{
      maxWidth: '600px',
      margin: '40px auto',
      padding: '20px',
      borderRadius: '12px',
      backgroundColor: '#f4f4f4',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)'
    }}>
      <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '20px' }}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              marginBottom: '10px',
              textAlign: msg.sender === 'user' ? 'right' : 'left'
            }}
          >
            <div
              style={{
                display: 'inline-block',
                padding: '10px 15px',
                borderRadius: '15px',
                backgroundColor: msg.sender === 'user' ? '#007bff' : '#e0e0e0',
                color: msg.sender === 'user' ? '#fff' : '#000',
                maxWidth: '80%'
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            backgroundColor: '#fff',
            color: '#000'
          }}
          placeholder="Escribe un mensaje..."
        />
        <button
          onClick={sendMessage}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Enviar
        </button>
      </div>
    </div>
  );
};

export default Chat;
