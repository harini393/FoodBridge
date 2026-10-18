/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#174D3A',
          hover: '#103B2C',
          dark: '#0B291E',
        },
        sage: {
          DEFAULT: '#E8F2E8',
          light: '#F4F8F4',
        },
        cream: {
          DEFAULT: '#FAF7F0',
        },
        main: {
          DEFAULT: '#25312B',
        },
        muted: {
          DEFAULT: '#69756D',
        },
        harvest: {
          DEFAULT: '#D58B45',
          hover: '#B87233',
        },
        status: {
          success: '#237A4B',
          warning: '#946200',
          error: '#B42318',
        },
        border: {
          subtle: '#DFE6DF',
        },
      },
      fontFamily: {
        heading: ['Manrope', 'system-ui', '-apple-system', 'sans-serif'],
        body: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      maxWidth: {
        content: '1240px',
      },
      borderRadius: {
        DEFAULT: '8px',
        md: '10px',
        lg: '12px',
      },
    },
  },
  plugins: [],
};
