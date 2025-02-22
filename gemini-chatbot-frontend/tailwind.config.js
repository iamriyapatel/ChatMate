// tailwind.config.js
@type {import('tailwindcss').Config}
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
      extend: {
          colors: {
              primary: '#007bff',
              secondary: '#6c757d',
              background: '#f9f9f9',
              card: '#ffffff',
              text: '#333333',
              accent: '#ffc107',
          },
          fontFamily: {
              outfit: ['Outfit', 'sans-serif'],
          },
          boxShadow: {
              card: '0 4px 6px rgba(0, 0, 0, 0.1)',
          },
          borderRadius: {
             lg: '12px',
          },
       },
   },
   plugins: [],
};
