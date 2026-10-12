import type { Config } from "tailwindcss";

const withAlpha = (v: string) => `rgb(var(${v}) / <alpha-value>)`;

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Aileron", "Hanken Grotesk", "system-ui", "sans-serif"],
        sans: ["Aileron", "Hanken Grotesk", "system-ui", "sans-serif"],
        body: ["Hanken Grotesk", "Aileron", "system-ui", "sans-serif"],
      },
      colors: {
        bg: withAlpha("--bg"),
        surface: withAlpha("--surface"),
        elevated: withAlpha("--elevated"),
        ink: withAlpha("--ink"),
        muted: withAlpha("--muted"),
        line: withAlpha("--line"),
        accent: withAlpha("--accent"),
        "accent-ink": withAlpha("--accent-ink"),
        success: withAlpha("--success"),
        warning: withAlpha("--warning"),
        danger: withAlpha("--danger"),
      },
      borderRadius: { xl: "14px", "2xl": "20px", "3xl": "28px", "4xl": "36px" },
      boxShadow: {
        soft: "0 1px 2px rgb(0 0 0 / 0.04), 0 8px 24px rgb(0 0 0 / 0.06)",
        lift: "0 2px 6px rgb(0 0 0 / 0.06), 0 18px 48px rgb(0 0 0 / 0.10)",
        glow: "0 0 0 4px rgb(var(--accent) / 0.18), 0 0 24px rgb(var(--accent) / 0.45)",
      },
      transitionDuration: { DEFAULT: "150ms" },
      keyframes: {
        pulseDot: { "0%,100%": { transform: "scale(1)", opacity: "1" }, "50%": { transform: "scale(1.6)", opacity: "0" } },
        shimmer: { "100%": { transform: "translateX(100%)" } },
        scan: { "0%": { top: "6%" }, "50%": { top: "90%" }, "100%": { top: "6%" } },
      },
      animation: {
        "pulse-dot": "pulseDot 1.8s ease-out infinite",
        shimmer: "shimmer 1.4s infinite",
        scan: "scan 2.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
