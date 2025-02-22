import React from 'react';
import { assets } from '../assets/assets.js';

const Main = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background dark:bg-dark-background p-6">
      {/* Navigation Bar */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-xl font-bold text-primary dark:text-dark-text">Gemini</p>
        <img src={assets.user_icon} alt="User Icon" className="w-8 h-8 rounded-full" />
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Greeting Section */}
        <div className="greet">
          <p className="text-lg font-semibold">
            <span className="text-primary dark:text-dark-text">Hello, Riya.</span>
          </p>
          <p className="text-gray-700 dark:text-dark-text">How can I assist you today?</p>
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { text: "Suggest beautiful places to visit on a road trip", icon: assets.compass_icon },
            { text: "Summarize the concept of urban planning", icon: assets.bulb_icon },
            { text: "Brainstorm team bonding activities for a work retreat", icon: assets.message_icon },
            { text: "Improve the readability of the following code", icon: assets.code_icon }
          ].map((item, index) => (
            <div key={index} className="card bg-card dark:bg-dark-card shadow-card rounded-lg p-4 flex flex-col items-center space-y-2 transition-transform transform hover:scale-105 hover:shadow-lg">
              <p className="text-center text-gray-700 dark:text-dark-text">{item.text}</p>
              <img src={item.icon} alt="Icon" className="w-10 h-10" />
            </div>
          ))}
        </div>

        {/* Search Box and Bottom Info */}
        <div className="main-bottom space-y-4">
          <div className="search-box bg-card dark:bg-dark-card shadow-card rounded-lg p-4 flex items-center justify-between">
            <input
              type="text"
              placeholder="Enter a prompt here..."
              className="flex-1 p-2 border-none focus:outline-none text-text dark:text-dark-text"
            />
            <div className="flex space-x-2">
              <img src={assets.gallery_icon} alt="Gallery Icon" className="w-6 h-6 cursor-pointer" />
              <img src={assets.mic_icon} alt="Mic Icon" className="w-6 h-6 cursor-pointer" />
              <img src={assets.send_icon} alt="Send Icon" className="w-6 h-6 cursor-pointer" />
            </div>
          </div>
          <p className="bottom-info text-xs text-gray-500 dark:text-dark-text text-center">
            Gemini AI may display inaccurate info, so verify its responses. Your privacy and Gemini Apps.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Main;
