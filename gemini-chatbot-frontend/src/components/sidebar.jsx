import { useState } from "react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Menu Button (Only Visible on Mobile) */}
      <button
        className="fixed top-4 left-4 z-50 text-white md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>

      {/* Overlay (Shows when sidebar is open) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-[80%] max-w-[250px] bg-[#1c1b1b] flex flex-col px-4 py-6 z-50 transition-transform duration-300 
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:w-36`}
      >
        {/* Close Button (Mobile) */}
        <button
          className="absolute top-4 right-4 text-white md:hidden"
          onClick={() => setIsOpen(false)}
        >
          ✕
        </button>

        {/* Logo */}
        <h1 className="text-xl font-bold text-white">ChatMate</h1>

        {/* Menu Items */}
        <nav className="mt-10 space-y-6 text-white">
          <ul className="space-y-6 text-gray-300">
            {[
              "Research",
              "Safety",
              "ChatGPT",
              "Sora",
              "API Platform",
              "For Business",
              "Stories",
              "Company",
              "News",
            ].map((item) => (
              <li key={item}>
                <a
                  href={`#${item.toLowerCase().replace(/\s+/g, "")}`}
                  className="block hover:text-white transition"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Icon */}
        <div className="mt-auto">
          <button className="text-white opacity-60 hover:opacity-100 transition">
            ↻
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;