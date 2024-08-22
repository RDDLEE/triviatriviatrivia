/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./.storybook/preview.tsx"
  ],
  theme: {
    extend: {
      colors: {
        "floater-blue": "#8379DE",
        "floater-red": "#DE8379",
        "floater-yellow": "#79DE83",
      },
    },
  },
  plugins: [],
}

