import Main from "./components/Main.jsx";
import Sidebar from "./components/Sidebar.jsx";

const App = () => {
  const sendMessage = async (message) => {
    try {
      const response = await fetch("http://localhost:8000/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
  
      const data = await response.json();
      console.log("AI Response:", data.response);
      return data.response;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  };

  return (
    <>
      <Sidebar />
      <Main onSendMessage={sendMessage} />
    </>
  );
};

export default App;
