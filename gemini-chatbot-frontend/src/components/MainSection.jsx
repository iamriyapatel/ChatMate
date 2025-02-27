const MainSection = () => {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-l from-indigo-900 via-purple-900 to-black px-4">
        {/* Heading */}
        <h1 className="text-2xl font-semibold mb-6 text-white">What can I help with?</h1>
  
        {/* Search Bar */}
        <div className="relative w-full max-w-2xl">
          <input
            type="text"
            placeholder="Rank dog breeds for a small apartment"
            className="w-full bg-[#1c1b1b] text-white text-lg px-4 py-3 rounded-2xl outline-none"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#2c2c2c] text-white p-2 rounded-full">
            ↑
          </button>
        </div>
  
        {/* Button Group */}
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          {["Search with ChatGPT", "Talk with ChatGPT", "Research", "Sora", "More"].map((text, index) => (
            <button
              key={index}
              className="px-4 py-2 border border-gray-500 rounded-full text-white text-sm hover:bg-gray-700 transition"
            >
              {text}
            </button>
          ))}
        </div>
      </div>
    );
  };
  
  export default MainSection;  