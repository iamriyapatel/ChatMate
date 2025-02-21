import React, { useState } from 'react';
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
      const apiKey = import.meta.env.VITE_API_KEY;
      if (!apiKey) {
        throw new Error('API key is undefined');
      }

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          contents: [
            {
              parts: [{ text: input }],
            },
          ],
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
        { sender: 'gemini', text: reply },
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'gemini', text: 'Oops! Something went wrong.' },
      ]);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background p-6">
      
      {/* Chat Messages */}
      <div
        className="flex-1 space-y-4 overflow-y-auto border border-gray-300 rounded-lg p-4 bg-white shadow-md"
        style={{ maxHeight: '400px' }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-xs p-3 rounded-lg shadow-card animate-fade-in ${
              msg.sender === 'user'
                ? 'self-end bg-primary text-white'
                : 'self-start bg-gray-100 text-gray-800'
            }`}
          >
            <strong>{msg.sender === 'user' ? 'You:' : 'Gemini:'}</strong> {msg.text}
          </div>
        ))}
      </div>

      {/* Input Field */}
      <form onSubmit={sendMessage} className="mt-4 flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-primary"
        />
        <button
          type="submit"
          className="bg-primary text-white p-3 rounded-lg hover:bg-accent transition duration-300"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chatbot;
