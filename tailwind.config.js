/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",

  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {

      /* =========================
       * Fonts
       * ========================= */
      fontFamily: {
        Cairo: ['"Cairo"', 'sans-serif'],

        "body-md": ["Inter", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"],
        "body-sm": ["Inter", "sans-serif"],

        "headline-lg": ["Inter", "sans-serif"],
        "headline-lg-mobile": ["Inter", "sans-serif"],
        "headline-md": ["Inter", "sans-serif"],

        "label-caps": ["Inter", "sans-serif"],

        "currency-display": ["JetBrains Mono", "monospace"],
        "currency-table": ["JetBrains Mono", "monospace"],
      },

      /* =========================
       * Breakpoints
       * ========================= */
      screens: {
        // ── Mobile ──────────────────────────
        "xs": "320px",   // Small phones (iPhone SE)
        "sm": "390px",   // Standard phones (iPhone 14, Pixel 7)
        "md": "430px",   // Large phones (iPhone 14 Plus, Pro Max)

        // ── Tablet ──────────────────────────
        "tab-sm": "600px",    // Small tablets / large phones landscape
        "tab-md": "768px",    // iPad Mini / iPad portrait
        "tab-lg": "1024px",   // iPad Pro 11" / iPad Air landscape

        // ── Desktop / Web App ───────────────
        "lg": "1280px",  // Small laptops / desktops
        "xl": "1440px",  // Standard desktops / MacBook Pro 14"
        "2xl": "1680px",  // Wide desktops

        // ── Large / TV ──────────────────────
        "3xl": "1920px",  // Full HD
        "4xl": "2560px",  // 2K / QHD
        "tv": "3840px",  // 4K UHD
      },
      /* =========================
       * Colors
       * ========================= */
      colors: {
        primary: {
          50: 'var(--color-primary-50)',
          100: 'var(--color-primary-100)',
          200: 'var(--color-primary-200)',
          300: 'var(--color-primary-300)',
          400: 'var(--color-primary-400)',
          500: 'var(--color-primary-500)',  // Your main color
          600: 'var(--color-primary-600)',
          700: 'var(--color-primary-700)',
          800: 'var(--color-primary-800)',
          900: 'var(--color-primary-900)',
        },
        secondary: '#ffffff',
        accent: '#3a7bfd',
        success: '#10b981',
        danger: '#ef4444',
        warning: '#f59e0b',
        info: '#4e8cff',
      },

      /* =========================
       * Border Radius
       * ========================= */
      /* =========================
       * Animations (Loader)
       * ========================= */
      keyframes: {
        'rotation-back-3': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(-360deg)' },
        },
        'rotation-back-4': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'rotation-back-3': 'rotation-back-3 3s linear infinite',
        'rotation-back-4': 'rotation-back-4 4s linear infinite',
      },

      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },

      /* =========================
       * Spacing
       * ========================= */
      spacing: {
        18: "4.5rem",
        88: "22rem",
        100: "25rem",
        128: "32rem",

        container_max_width: "1280px",
        base_unit: "8px",
        sidebar_width: "280px",
        margin_mobile: "16px",
        gutter: "24px",
      },

      /* =========================
       * Font Sizes
       * ========================= */
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1" }],
        "6xl": ["3.75rem", { lineHeight: "1" }],
        "7xl": ["4.5rem", { lineHeight: "1" }],
        "8xl": ["6rem", { lineHeight: "1" }],
        tv: ["8rem", { lineHeight: "1.1" }],

        "body-md": [
          "16px",
          {
            lineHeight: "24px",
            fontWeight: "400",
          },
        ],

        "body-lg": [
          "18px",
          {
            lineHeight: "28px",
            fontWeight: "400",
          },
        ],

        "body-sm": [
          "14px",
          {
            lineHeight: "20px",
            fontWeight: "400",
          },
        ],

        "headline-lg": [
          "32px",
          {
            lineHeight: "40px",
            letterSpacing: "-0.02em",
            fontWeight: "700",
          },
        ],

        "headline-lg-mobile": [
          "24px",
          {
            lineHeight: "32px",
            fontWeight: "700",
          },
        ],

        "headline-md": [
          "20px",
          {
            lineHeight: "28px",
            fontWeight: "600",
          },
        ],

        "label-caps": [
          "12px",
          {
            lineHeight: "16px",
            letterSpacing: "0.05em",
            fontWeight: "600",
          },
        ],

        "currency-display": [
          "24px",
          {
            lineHeight: "32px",
            letterSpacing: "-0.01em",
            fontWeight: "500",
          },
        ],

        "currency-table": [
          "14px",
          {
            lineHeight: "20px",
            fontWeight: "500",
          },
        ],
      },
    },
  },

  plugins: [],
};