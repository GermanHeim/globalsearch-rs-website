import starlightPlugin from "@astrojs/starlight-tailwind";
import colors from "tailwindcss/colors";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: { accent: colors.blue, gray: colors.zinc },
    },
  },
  plugins: [require("tailwindcss-animate"), starlightPlugin()],
};
