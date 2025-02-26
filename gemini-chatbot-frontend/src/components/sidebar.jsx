import { useState, useEffect } from "react";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const recentSearches = [
    "What is AI?",
    "How does React work?",
    "Latest tech trends",
  ];

  return (
    <div className="relative flex transition-all duration-300">
      <aside
        className={`h-screen flex flex-col items-start py-6 shadow-lg transition-all duration-300 ${
          isExpanded ? "w-64" : "w-16"
        } ${darkMode ? "bg-[#1c1b1b] text-white" : "bg-white text-black"}`}
      >
        {/* Menu Button */}
        <button
          className={`flex items-center mt-6 text-xl w-full hover:bg-gray-600 transition rounded-full border-hidden ${darkMode ? "text-white bg-[#1c1b1b]" : "text-black bg-white"}`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          ☰ {isExpanded && <span> Menu </span>}
        </button>

        {/* Recent Searches Section */}
        {isExpanded && (
          <div className="px-4 mt-4">
            <h3 className="text-lg font-bold border-b pb-2">Recent Searches</h3>
            <ul className="mt-2 space-y-2">
              {recentSearches.map((search, index) => (
                <li
                  key={index}
                  className="text-sm p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 cursor-pointer transition"
                >
                  🔍 {search}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Sidebar Items */}
        <div className="flex flex-col space-y-4 mt-6 px-2 rounded-full border-hidden">
          {[
            { label: "Favorites", icon: "❤️" },
            { label: "Help", icon: "❓" },
            { label: "History", icon: "⏳" },
            { label: "Settings", icon: "⚙️" },
          ].map((item, index) => (
            <button
              key={index}
              className={`flex items-center space-x-3 p-3 text-md border-hidden hover:bg-gray-600 rounded-full transition w-full ${darkMode ? "text-white bg-[#1c1b1b]" : "text-black bg-white"}`}
            >
              {item.icon} {isExpanded && <span>{item.label}</span>}
            </button>
          ))}
        </div>

        {/* Theme Toggle */}
        <div className="mt-auto">
          <button
            className={`w-full rounded-full hover:bg-slate-700 hover:opacity-80 active:scale-95 transition flex items-right border-hidden ${darkMode ? "bg-[#1c1b1b] text-white" : "bg-white text-black"}`}
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "🌙" : "☀️"}
          </button>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
