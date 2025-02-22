import React from 'react';
import Chatbot from './components/chatbot';
import Sidebar from './components/Sidebar';
import Main from './components/Main';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-background dark:bg-dark-background text-text dark:text-dark-text">
      {/* Header */}
      <header className="bg-white dark:bg-dark-card shadow-lg p-4 text-center">
        <h1 className="text-2xl font-bold text-primary dark:text-dark-text">Gemini AI Clone</h1>
        {/* Dark Mode Toggle Button */}
        <button
          onClick={toggleDarkMode}
          className="mt-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-accent transition duration-300"
          >
            {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </button>
      </header>

      {/* Layout with Sidebar and Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 p-4">
          <Main />
          <Chatbot />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-dark-card shadow-lg p-4 text-center text-gray-600 dark:text-dark-text">
        <p>© 2025 Gemini AI. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
