import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        lightNavy: "#262848",
        darkNavy: "#16182F",
        darkerNavy: "#111326",
        lighterNavy :"#343B5B",
        blurryColor: "#20223C",
        blurryBorder: "#ADA1E4"
      },
    },
  },
  plugins: [],
} satisfies Config;
