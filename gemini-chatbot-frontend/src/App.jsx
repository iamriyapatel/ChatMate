import Header from "./components/Header";
import Sidebar from "./components/sidebar";
import Sections from "./components/Sections";
import Footer from "./components/Footer";
import Chatbot from "./components/chatbot";

const App = () => {
  return (
    <div className="font-sans">
      <Header />
      <Chatbot />
      <Sidebar />
      <Sections />
      <Footer />
    </div>
  );
};

export default App;