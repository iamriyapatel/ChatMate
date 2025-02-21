import React from 'react';
import { assets } from '../assets/assets.js';

const Main = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background p-6">
      {/* Navigation Bar */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-xl font-bold text-primary">Gemini</p>
        <img src={assets.user_icon} alt="User Icon" className="w-8 h-8 rounded-full" />
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Greeting Section */}
        <div className="greet">
          <p className="text-lg font-semibold">
            <span className="text-primary">Hello, Riya.</span>
          </p>
          <p className="text-gray-700">How can I help you today?</p>
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card bg-white shadow-md rounded-lg p-4 flex flex-col items-center space-y-2">
            <p className="text-center text-gray-700">Suggest beautiful places to see on an upcoming road trip</p>
            <img src={assets.compass_icon} alt="Compass Icon" className="w-10 h-10" />
          </div>
          <div className="card bg-white shadow-md rounded-lg p-4 flex flex-col items-center space-y-2">
            <p className="text-center text-gray-700">Briefly summarize this concept: urban planning</p>
            <img src={assets.bulb_icon} alt="Bulb Icon" className="w-10 h-10" />
          </div>
          <div className="card bg-white shadow-md rounded-lg p-4 flex flex-col items-center space-y-2">
            <p className="text-center text-gray-700">Brainstorm team bonding activities for our work retreat</p>
            <img src={assets.message_icon} alt="Message Icon" className="w-10 h-10" />
          </div>
          <div className="card bg-white shadow-md rounded-lg p-4 flex flex-col items-center space-y-2">
            <p className="text-center text-gray-700">Improve the readability of the following code</p>
            <img src={assets.code_icon} alt="Code Icon" className="w-10 h-10" />
          </div>
        </div>

        {/* Search Box and Bottom Info */}
        <div className="main-bottom space-y-4">
          <div className="search-box bg-white shadow-md rounded-lg p-4 flex items-center justify-between">
            <input
              type="text"
              placeholder="Enter a prompt here"
              className="flex-1 p-2 border-none focus:outline-none"
            />
            <div className="flex space-x-2">
              <img src={assets.gallery_icon} alt="Gallery Icon" className="w-6 h-6 cursor-pointer" />
              <img src={assets.mic_icon} alt="Mic Icon" className="w-6 h-6 cursor-pointer" />
              <img src={assets.send_icon} alt="Send Icon" className="w-6 h-6 cursor-pointer" />
            </div>
          </div>
          <p className="bottom-info text-xs text-gray-500 text-center">
            Gemini may display inaccurate info, including about people, so double-check its responses. Your privacy and Gemini Apps.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Main;
