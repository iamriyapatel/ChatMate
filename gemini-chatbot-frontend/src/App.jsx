// src/App.jsx
import React from 'react';
import Chatbot from './components/chatbot';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-lg p-4 text-center">
        <h1 className="text-2xl font-bold text-primary">Gemini AI Clone</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <Chatbot />
      </main>

      {/* Footer */}
      <footer className="bg-white shadow-lg p-4 text-center text-gray-600">
        <p>© 2023 Gemini AI. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
