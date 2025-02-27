import Header from "./components/Header";
import MainSection from "./components/MainSection";
import Sidebar from "./components/sidebar";
import Sections from "./components/Sections";
import Footer from "./components/Footer";

const App = () => {
  return (
    <div className="font-sans">
      <Header />
      <MainSection />
      <Sidebar />
      <Sections />
      <Footer />
    </div>
  );
};

export default App;