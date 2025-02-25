import React, { useState } from 'react';
import axios from 'axios';
import { HiOutlinePaperAirplane } from "react-icons/hi";

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
        { contents: [{ parts: [{ text: input }] }] },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const reply = response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'Oops! Something went wrong.';
      setMessages((prevMessages) => [...prevMessages, { sender: 'gemini', text: reply }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prevMessages) => [...prevMessages, { sender: 'gemini', text: 'Oops! Something went wrong.' }]);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-black text-white p-4 overflow-hidden">
      {/* Chatbox UI */}
      <div className="flex flex-col flex-grow w-full h-full items-center justify-center overflow-hidden">
        <div className="w-full max-w-3xl bg-black p-4 rounded-lg shadow-lg flex flex-col h-full overflow-y-auto">
          {messages.map((msg, index) => (
            <div key={index} className={`my-2 p-2 rounded-lg max-w-[75%] ${msg.sender === 'user' ? 'self-end bg-blue-600 text-white' : 'self-start bg-gray-700 text-gray-300'}`}>
              {msg.text}
            </div>
          ))}
        </div>
      </div>

      {/* Input Field */}
      <form onSubmit={sendMessage} className="w-full max-w-3xl mx-auto bg-black rounded-full p-3 flex items-center mt-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask the chatbot..."
          className="flex-grow bg-transparent text-white px-4 focus:outline-none"
        />
        <button type="submit" className="p-2 text-gray-400 hover:text-white">
          <HiOutlinePaperAirplane className="w-6 h-6" />
        </button>
      </form>
    </div>
  );
};

export default Chatbot;