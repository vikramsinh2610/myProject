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
        bgColor: "#f9f5f5",
        transparent: "transparent",
        themeColor: "#ed1d24",
        lightGray: "#bdc8cd",
        white: "#ffffff",
        lightPink: "#ffeced",
        lightPurple: "#eee5ff",
        purple: "#8950fc",
        lightGreen: "#d2f1d0",
        green: "#14a176",
        lightBlue: "#c9eaf7",
        blue: "#4399bb",
        textColor: "#35809f",
      },
      boxShadow: {
        theme: "0px 0px 10px 1px rgba(239,28,38,0.20)",
      },
      height: {
        template: "calc(100vh - 66px)",
      },
      zIndex: {
        '999': '999',
      }
    },
  },
  daisyui: {
    themes: ["light"],
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
};
