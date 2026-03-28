// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "20px",
        sm: "30px",
        lg: "40px",
        xl: "60px",
      },
      screens: {
        "2xl": "1232px",
      },
    },
    extend: {
      screens: {
        lg: "1025px",
        md: "880px",
        sm: "740px",
      },
      colors: {
        /* ========================
           Base
        ======================== */
        black: "#202430",
        white: "#FFFFFF",

        /* ========================
           Brand
        ======================== */
        primary: {
          DEFAULT: "#4640DE",
        },

        /* ========================
           Accent
        ======================== */
        accent: {
          blue: "#26A4FF",
          yellow: "#FFB836",
          green: "#56CDAD",
          red: "#FF6550",
        },

        /* ========================
           Neutrals
        ======================== */
        neutral: {
          0: "#FFFFFF",
          20: "#D6DDEB",
          60: "#7C8493",
          80: "#515B6F",
          100: "#25324B",
        },
        border: {
          DEFAULT: "#D6DDEB",
        },

        /* ========================
           Light / Background
        ======================== */
        light: {
          gray: "#F8F8FD",
        },
      },
      fontFamily: {
        clash: ["var(--font-display)"],
        epilogue: ["var(--font-epilogue)"],
        inter: ["var(--font-inter)"],
      },
    },
  },
  plugins: [],
};
