import { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(240, 30%, 4%)",        // #0b0e1a almost black
        foreground: "hsl(240, 20%, 98%)",
        card: "hsl(240, 25%, 8%)",
        "card-foreground": "hsl(240, 20%, 98%)",
        primary: "hsl(272, 100%, 67%)",         // #a855f7 gorgeous violet (main accent)
        "primary-foreground": "hsl(240, 30%, 4%)",
        secondary: "hsl(260, 80%, 60%)",        // #9366f1 indigo
        muted: "hsl(240, 15%, 15%)",
        "muted-foreground": "hsl(240, 10%, 65%)",
        accent: "hsl(272, 100%, 75%)",
        destructive: "hsl(0, 84%, 60%)",
        border: "hsl(240, 20%, 15%)",
        input: "hsl(240, 20%, 15%)",
        ring: "hsl(272, 100%, 67%)",
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
export default config