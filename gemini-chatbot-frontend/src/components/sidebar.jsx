const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-36 bg-[#1c1b1b] flex flex-col px-4 py-6 z-50 overflow-y-auto">
      {/* Logo */}
      <h1 className="text-xl font-bold text-white">OpenAI</h1>

      {/* Menu Items */}
      <nav className="mt-10 space-y-6 text-white">
        <ul className="space-y-6 text-gray-300">
          <li>
            <a href="#research" className="block hover:text-white transition">
              Research
            </a>
          </li>
          <li>
            <a href="#safety" className="block hover:text-white transition">
              Safety
            </a>
          </li>
          <li>
            <a href="#chatgpt" className="block hover:text-white transition">
              ChatGPT
            </a>
          </li>
          <li>
            <a href="#sora" className="block hover:text-white transition">
              Sora
            </a>
          </li>
          <li>
            <a href="#apiplatform" className="block hover:text-white transition">
              API Platform
            </a>
          </li>
          <li>
            <a href="#forbusiness" className="block hover:text-white transition">
              For Business
            </a>
          </li>
          <li>
            <a href="#stories" className="block hover:text-white transition">
              Stories
            </a>
          </li>
          <li>
            <a href="#company" className="block hover:text-white transition">
              Company
            </a>
          </li>
          <li>
            <a href="#news" className="block hover:text-white transition">
              News
            </a>
          </li>
        </ul>
      </nav>

      {/* Bottom Icon */}
      <div className="mt-auto">
        <button className="text-white opacity-60 hover:opacity-100 transition">
          ↻
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;