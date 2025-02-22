import React, { useState, useEffect } from 'react';
import Chatbot from './components/chatbot';
import Sidebar from './components/Sidebar';
import Main from './components/Main';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-background dark:bg-dark-background text-text dark:text-dark-text">
      {/* Header */}
      <header className="bg-white dark:bg-dark-card shadow-lg p-4 text-center">
        <h1 className="text-2xl font-bold text-primary dark:text-dark-text">Gemini AI Clone</h1>
        </button>
      </header>

      {/* Layout with Sidebar and Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <Main />
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-dark-card shadow-lg p-4 text-center text-gray-600 dark:text-dark-text">
        <p>© 2025 Gemini AI. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
