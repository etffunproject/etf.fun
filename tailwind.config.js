/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#f9fafb', // Very light gray background
        surface: '#ffffff',    // Clean white surfaces
        accent: '#3b82f6',     // A pleasing blue accent (Tailwind blue-500)
        textPrimary: '#111827', // Dark gray (Tailwind gray-900)
        textSecondary: '#6b7280', // Mid gray for less important text (gray-500)
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
