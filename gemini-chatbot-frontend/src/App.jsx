import Chatbot from "./components/chatbot";
import Sidebar from "./components/sidebar";

const App = () => {
  return (
    <div className="flex h-screen bg-[#1c1b1b] text-white">
      
      <Sidebar />
      
      <div className="flex-1 h-screen">
        <Chatbot />
      </div>
    </div>
  );
};

export default App;
