const Sections = () => {
    return (
      <section className="bg-white text-black py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center">Our Research</h2>
          <p className="mt-4 text-center text-gray-600">Exploring new frontiers in AI.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="p-6 bg-gray-100 rounded-lg shadow">
              <h3 className="text-xl font-semibold">Machine Learning</h3>
              <p className="mt-2 text-gray-600">Deep learning research & breakthroughs.</p>
            </div>
            <div className="p-6 bg-gray-100 rounded-lg shadow">
              <h3 className="text-xl font-semibold">Ethics & Safety</h3>
              <p className="mt-2 text-gray-600">Ensuring AI aligns with human values.</p>
            </div>
            <div className="p-6 bg-gray-100 rounded-lg shadow">
              <h3 className="text-xl font-semibold">Applications</h3>
              <p className="mt-2 text-gray-600">Using AI to solve real-world problems.</p>
            </div>
          </div>
        </div>
      </section>
    );
  };
  
  export default Sections;  