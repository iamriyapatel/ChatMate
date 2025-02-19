import { useState } from 'react';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  // Function to handle sending messages to the chatbot
  const sendMessage = async () => {
    if (!input.trim()) return; // Don't send empty messages

    // Add the user's message to the chat
    setMessages((prevMessages) => [...prevMessages, { sender: 'user', text: input }]);
    setInput(''); // Clear the input field

    try {
      // Send the message to the Cloudflare Worker endpoint
      const response = await fetch('https://deno-gemini-chatbot.riya-dev.workers.dev/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      // Add the bot's response to the chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', text: data.response || 'Sorry, I could not understand that.' },
      ]);
    } catch (error) {
      console.error('Error communicating with the chatbot:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', text: 'An error occurred while processing your request.' },
      ]);
    }
  };

  return (
    <div className="chat-container">
      <h1>Gemini Chatbot</h1>
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            <strong>{msg.sender === 'user' ? 'You' : 'Bot'}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message here..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;