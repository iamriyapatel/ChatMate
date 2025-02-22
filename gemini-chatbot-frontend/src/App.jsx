import React from 'react';

function App() {
  return (
    <div>
      {/* Header Section */}
      <header className="bg-white dark:bg-dark-card shadow-lg p-4 text-center">
        <h1 className="text-2xl font-bold text-primary dark:text-dark-text">
          Gemini AI Clone
        </h1>
      </header>

      {/* Layout with Sidebar and Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-200 p-4">
          Sidebar Content
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4">
          Main Content
        </main>
      </div>
    </div>
  );
}

export default App;
