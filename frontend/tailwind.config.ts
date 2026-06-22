import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        "bg-subtle": "var(--bg-subtle)",
        surface: "var(--surface)",
        border: {
          DEFAULT: "var(--border)",
          strong: "var(--border-strong)",
        },
        text: {
          DEFAULT: "var(--text)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          soft: "var(--primary-soft)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          soft: "var(--accent-soft)",
        },
        success: "var(--success)",
        danger: "var(--danger)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15,23,42,.05), 0 1px 3px rgba(15,23,42,.04)",
        focus: "0 0 0 4px var(--focus-ring)",
      },
      borderRadius: {
        pill: "9999px",
        btn: "12px",
        card: "20px",
        search: "16px",
      },
      backgroundImage: {
        "signature-gradient": "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
        "search-gradient": "linear-gradient(135deg, #6366F1 0%, #818CF8 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
