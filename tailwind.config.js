/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        buffer: {
          primary: '#3778ff',
          secondary: '#6366f1',
          dark: '#1f2937',
          light: '#f3f4f6',
        }
      }
    },
  },
  plugins: [],
}
