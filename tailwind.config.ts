/* eslint-env node */

import { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const classNames = {
  base: {
    body: "text-normal bg-neutral-200 antialiased transition-all dark:bg-neutral-800  text-base",
    h1: "text-4xl font-extrabold tracking-wider text-normal",
    h2: "text-2xl font-semibold tracking-wide text-normal",
    label: "text-muted",
    'input:not([type="radio"]):not([type="checkbox"]),textarea':
      "rounded border border-neutral-300 bg-neutral-100 px-2 py-1 shadow-none hover:border-neutral-500  hover:ring hover:ring-purple-500/50 focus:border-purple-700 focus:outline-none focus:ring focus:ring-purple-500/50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white",
    dialog: "fixed min-w-[50%] rounded-lg bg-neutral-200 p-4 shadow-2xl dark:bg-neutral-800",
    "dialog::backdrop": "bg-black/20 dark:bg-white/20",
  },
  utilities: {
    ".text-normal": "text-neutral-800 dark:text-neutral-200",
    ".text-muted": "text-neutral-700 dark:text-neutral-300",
    ".border-normal": "border-neutral-300 dark:border-neutral-700",
  },
  components: {
    ".btn":
      "rounded-lg border border-transparent px-2 py-0.5 font-semibold tracking-wide text-neutral-900  hover:text-purple-500 dark:text-neutral-100",
    ".btn-outlined":
      "rounded-lg border border-neutral-500 bg-transparent px-2 py-0.5 font-semibold tracking-wide text-neutral-700 hover:border-purple-700  hover:text-purple-700 hover:ring-2 hover:ring-purple-500/50 focus:ring-2 active:bg-neutral-200 dark:text-neutral-300 dark:active:bg-neutral-800",
    ".btn-filled":
      "rounded-lg border border-transparent bg-purple-700 px-2 py-0.5 font-semibold tracking-wide text-white  hover:bg-purple-800 hover:ring-2 hover:ring-purple-500/50 focus:ring-2 active:bg-purple-900",
  },
};

function formatClassNames(obj: Record<string, string>) {
  const formatted: Record<string, Record<string, string>> = {};
  for (const key in obj) {
    formatted[key] = { ["@apply " + obj[key]]: "" };
  }
  return formatted;
}

const myPlugin = plugin(({ addUtilities, addComponents, addBase }) => {
  addBase(formatClassNames(classNames.base));
  addUtilities(formatClassNames(classNames.utilities));
  addComponents(formatClassNames(classNames.components));
});

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [myPlugin],
} as Config;
