import React from 'react';
import { assets } from '../assets/assets.js';

const Sidebar = () => {
  return (
    <div className="w-64 bg-card dark:bg-dark-card min-h-screen p-4 shadow-lg">
      <h2 className="text-xl font-bold text-primary dark:text-dark-text mb-4">Menu</h2>
      <ul className="space-y-4">
        {[
          { text: 'Home', icon: assets.home_icon },
          { text: 'Chats', icon: assets.chat_icon },
          { text: 'Settings', icon: assets.settings_icon },
          { text: 'Logout', icon: assets.logout_icon }
        ].map((item, index) => (
          <li key={index} className="flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 transition">
            <img src={item.icon} alt={item.text} className="w-6 h-6 mr-3" />
            <span className="text-text dark:text-dark-text">{item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
