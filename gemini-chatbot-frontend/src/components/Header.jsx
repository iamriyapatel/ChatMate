const Header = () => {
  return (
    <header className="w-full fixed top-0 left-0 z-50 bg-black text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-end">
        
        {/* Log In Button */}
        <button className="bg-gray-800 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition">
          Log in
        </button>

      </div>
    </header>
  );
};

export default Header;