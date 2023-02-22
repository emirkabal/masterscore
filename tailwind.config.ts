/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./*.vue"
  ],
  theme: {
    extend: {
      fontFamily: {
        maven: ["Maven Pro", "sans-serif"]
      },
      backgroundSize: {
        "blur-cover": "auto 120%"
      }
    }
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@headlessui/tailwindcss"),
    require("@tailwindcss/line-clamp")
  ]
}
