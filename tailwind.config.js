/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "vert-fonce": "#264653",
        "vert-pastel": "#2a9d8f",
        "jaune-pastel": "#e9c46a",
        "orange-pastel": "#f4a261",
        "rouge-pastel": "#e76f51",
        "beige-pastel": "#faedcd",
      }
    },
  },
  plugins: [],
}