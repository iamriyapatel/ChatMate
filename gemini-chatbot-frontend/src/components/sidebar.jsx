import { useState, useEffect } from "react";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      document.body.style.backgroundColor = "black";
      document.body.style.color = "white";
    } else {
      document.documentElement.classList.remove("dark");
      document.body.style.backgroundColor = "white";
      document.body.style.color = "black";
    }
  }, [darkMode]);

  const recentSearches = [
    "What is AI?",
    "How does React work?",
    "Latest tech trends",
  ];

  return (
    <div className={`relative flex transition-all duration-300 ${darkMode ? 'bg-[#121212] text-white' : 'bg-white text-black'}`}>
      <aside
        className={`h-screen ${darkMode ? 'bg-[#1c1b1b] text-white' : 'bg-white text-black'} flex flex-col items-start py-6 shadow-lg rounded-r-lg`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Menu Button */}
        <button className="flex items-center space-x-3 p-3 text-xl hover:bg-gray-600 transition w-full bg-transparent">
          ☰ {isExpanded && <span>Menu</span>}
        </button>

        {/* Recent Searches Section */}
        {isExpanded && (
          <div className="px-4 mt-4">
            <h3 className="text-lg font-bold">Recent Searches</h3>
            <ul className="mt-2 space-y-2">
              {recentSearches.map((search, index) => (
                <li key={index} className="text-sm bg-transparent p-2 rounded-md">
                  {search}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Sidebar Items */}
        <div className="flex flex-col space-y-6 mt-6 px-2">
          <button className="flex items-center space-x-3 p-3 text-xl text-red-400 hover:bg-gray-600 transition w-full bg-transparent">
            ❤️ {isExpanded && <span>Favorites</span>}
          </button>
          <button className="flex items-center space-x-3 p-3 text-xl text-blue-400 hover:bg-gray-600 transition w-full bg-transparent">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9a3.75 3.75 0 017.5 0c0 2.25-3.75 3-3.75 6m0 3h.007" />
            </svg>
            {isExpanded && <span>Help</span>}
          </button>
          <button className="flex items-center space-x-3 p-3 text-xl text-yellow-400 hover:bg-gray-600 transition w-full bg-transparent">
            ⏳ {isExpanded && <span>History</span>}
          </button>
          <button className="flex items-center space-x-3 p-3 text-xl text-green-400 hover:bg-gray-600 transition w-full bg-transparent">
            ⚙️ {isExpanded && <span>Settings</span>}
          </button>
        </div>

        {/* Theme Toggle */}
        <div className="mt-auto px-4">
          <button
            className="w-full p-3 bg-[#1c1b1b] text-white rounded-md hover:bg-gray-900 transition"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
          </button>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;