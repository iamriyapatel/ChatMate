import React, { useState } from 'react';
import axios from 'axios';

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<{ id: string; sender: string; text: string }[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate input
    if (!input.trim() || input.length > 500) return;

    // Add user message to chat
    const newMessage = { id: Date.now().toString(), sender: 'user', text: input };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput('');

    // Set loading state
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_API_KEY;
      if (!apiKey) {
        throw new Error('API key is undefined');
      }

      // Call Gemini API
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

      // Extract bot reply
      const reply = response.data.candidates[0].content.parts[0].text;
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: Date.now().toString(), sender: 'gemini', text: reply },
      ]);
    } catch (error) {
      console.error('Error sending message:', error.response?.data || error.message);
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: Date.now().toString(), sender: 'gemini', text: 'Oops! Something went wrong.' },
      ]);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-6">
      {/* Chat Messages */}
      <div
        className="flex-1 space-y-4 overflow-y-auto border border-gray-300 rounded-lg p-4 bg-white shadow-md"
        style={{ maxHeight: '400px' }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-xs p-3 rounded-lg shadow-card ${
              msg.sender === 'user'
                ? 'self-end bg-blue-500 text-white'
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
          className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
          maxLength={500} // Limit input length
        />
        <button
          type="submit"
          disabled={isLoading}
          className={`bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-300 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default Chatbot;
