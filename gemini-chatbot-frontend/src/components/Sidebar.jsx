import React from 'react';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white dark:bg-dark-card shadow-lg p-4">
      <h2 className="text-lg font-bold text-primary dark:text-dark-text mb-4">Menu</h2>
      <ul className="space-y-2">
        <li>
          <a href="#" className="flex items-center space-x-2 text-gray-700 hover:text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0l-2-2m2 2V4a1 1 0 00-1-1h-3a1 1 0 00-1 1v10a1 1 0 001 1h3z"
              />
            </svg>
            <span>Dashboard</span>
          </a>
        </li>
        <li>
          <a href="#" className="flex items-center space-x-2 text-gray-700 hover:text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z"
              />
            </svg>
            <span>Chat</span>
          </a>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
