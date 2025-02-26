import { useState } from "react";
import Chatbot from "./components/chatbot";
import Sidebar from "./components/sidebar";

const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`flex h-screen transition-all duration-300 ${darkMode ? "bg-black text-white" : "bg-white text-black"}`}>
      
      <Sidebar darkMode={darkMode} setDarkMode={setDarkMode} />

      
      <div className="flex-1 h-screen">
        <Chatbot />
      </div>
    </div>
  );
};

export default App;
