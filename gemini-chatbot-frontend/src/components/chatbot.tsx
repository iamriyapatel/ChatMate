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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-l from-indigo-900 via-purple-900 to-black px-4">
      
      {/* Heading */}
      <h1 className="text-2xl font-semibold mb-6 text-white">What can I help with?</h1>

      {/* Chatbox UI */}
      <div className="w-full max-w-3xl bg-transparent p-4 rounded-lg shadow-lg flex flex-col h-[400px] overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className={`my-2 p-2 rounded-lg max-w-[75%] ${msg.sender === 'user' ? 'self-end bg-blue-600 text-white' : 'self-start bg-gray-700 text-gray-300'}`}>
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input Field */}
      <form onSubmit={sendMessage} className="relative w-full max-w-2xl mt-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask the chatbot..."
          className="w-full bg-[#1c1b1b] text-white text-lg px-4 py-3 rounded-2xl outline-none"
        />
        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#2c2c2c] text-white p-2 rounded-full">
          <HiOutlinePaperAirplane className="w-6 h-6" />
        </button>
      </form>

      {/* Button Group */}
      <div className="flex flex-wrap justify-center gap-3 mt-6">
        {["Search with ChatGPT", "Talk with ChatGPT", "Research", "Sora", "More"].map((text, index) => (
          <button
            key={index}
            className="px-4 py-2 border border-gray-500 rounded-full text-white text-sm hover:bg-gray-700 transition"
          >
            {text}
          </button>
        ))}
      </div>
      
    </div>
  );
};

export default Chatbot;