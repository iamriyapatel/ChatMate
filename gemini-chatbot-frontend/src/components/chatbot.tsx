import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState<string>('');


  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prevMessages) => [...prevMessages, { sender: 'user', text: input }]);
    setInput('');

    try {
      const apiKey = import.meta.env.VITE_API_KEY; // Corrected here
      if (!apiKey) {
        throw new Error('API key is undefined');
      }

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          contents: [{
            parts: [{ text: input }]
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const reply = response.data.candidates[0].content.parts[0].text;
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'gemina', text: reply },
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'gemina', text: 'Oops! Something went wrong.' },
      ]);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 className='text-center'>AI Chatbot</h1>
      <div style={{ marginBottom: '20px', maxHeight: '400px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.sender === 'user' ? 'right' : 'left', marginBottom: '10px' }}>
            <strong>{msg.sender === 'user' ? 'You:' : 'Gemina:'}</strong> {msg.text}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          style={{ width: '80%', padding: '10px', marginRight: '5px' }}
        />
        <button type="submit" style={{ padding: '10px 20px' }}>Send</button>
      </form>
    </div>
  );
};

export default Chatbot;