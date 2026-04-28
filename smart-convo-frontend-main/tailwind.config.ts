import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)"],
        sans:    ["var(--font-sans)"],
        mono:    ["var(--font-mono)"],
        arabic:  ["var(--font-arabic)"],
      },
      colors: {
        /* canvas / paper */
        canvas:      "var(--canvas)",
        paper:       "var(--paper)",
        ink:         "var(--ink)",

        /* graphite scale */
        graphite: {
          900: "var(--graphite-900)",
          800: "var(--graphite-800)",
          700: "var(--graphite-700)",
          600: "var(--graphite-600)",
          500: "var(--graphite-500)",
          400: "var(--graphite-400)",
          300: "var(--graphite-300)",
          200: "var(--graphite-200)",
          100: "var(--graphite-100)",
          50:  "var(--graphite-50)",
        },

        /* signal teal */
        signal: {
          DEFAULT: "var(--signal)",
          deep:    "var(--signal-deep)",
          soft:    "var(--signal-soft)",
          ink:     "var(--signal-ink)",
        },

        /* pastel tints */
        mist:   { bg: "var(--mist-bg)",   ink: "var(--mist-ink)"   },
        sand:   { bg: "var(--sand-bg)",   ink: "var(--sand-ink)"   },
        sage:   { bg: "var(--sage-bg)",   ink: "var(--sage-ink)"   },
        blush:  { bg: "var(--blush-bg)",  ink: "var(--blush-ink)"  },
        sky:    { bg: "var(--sky-bg)",    ink: "var(--sky-ink)"    },
        butter: { bg: "var(--butter-bg)", ink: "var(--butter-ink)" },

        /* semantic */
        success: { DEFAULT: "var(--success)", soft: "var(--success-soft)" },
        warning: { DEFAULT: "var(--warning)", soft: "var(--warning-soft)" },
        danger:  { DEFAULT: "var(--danger)",  soft: "var(--danger-soft)"  },
        info:    { DEFAULT: "var(--info)",     soft: "var(--info-soft)"    },

        /* shadcn passthrough */
        background:  "hsl(var(--background))",
        foreground:  "hsl(var(--foreground))",
        card:        { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        popover:     { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        primary:     { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary:   { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        muted:       { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent:      { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        border:      "hsl(var(--border))",
        input:       "hsl(var(--input))",
        ring:        "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1, 12 76% 61%))",
          "2": "hsl(var(--chart-2, 173 58% 39%))",
          "3": "hsl(var(--chart-3, 197 37% 24%))",
          "4": "hsl(var(--chart-4, 43 74% 66%))",
          "5": "hsl(var(--chart-5, 27 87% 67%))",
        },
        sidebar: {
          DEFAULT:              "hsl(var(--sidebar-background, 0 0% 100%))",
          foreground:           "hsl(var(--sidebar-foreground, 0 0% 4%))",
          primary:              "hsl(var(--sidebar-primary, 0 0% 4%))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground, 0 0% 97%))",
          accent:               "hsl(var(--sidebar-accent, 40 8% 93%))",
          "accent-foreground":  "hsl(var(--sidebar-accent-foreground, 0 0% 4%))",
          border:               "hsl(var(--sidebar-border, 0 0% 91%))",
          ring:                 "hsl(var(--sidebar-ring, 180 31% 25%))",
        },
      },
      borderRadius: {
        xs:   "var(--radius-xs)",
        sm:   "var(--radius-sm)",
        md:   "var(--radius-md)",
        lg:   "var(--radius-lg)",
        xl:   "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        pill: "var(--radius-pill)",
        DEFAULT: "var(--radius)",
      },
      boxShadow: {
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to:   { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to:   { height: "0" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%":       { opacity: "0.5", transform: "scale(0.8)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
        "pulse-dot":      "pulse-dot 2s ease-in-out infinite",
        "fade-up":        "fade-up 0.22s cubic-bezier(0.2,0.7,0.2,1) both",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
