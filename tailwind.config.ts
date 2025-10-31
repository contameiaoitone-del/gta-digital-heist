import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        gta: ['Bebas Neue', 'sans-serif'],
        heading: ['Teko', 'sans-serif'],
        body: ['Barlow', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        neon: {
          pink: "hsl(var(--neon-pink))",
          purple: "hsl(var(--neon-purple))",
          cyan: "hsl(var(--neon-cyan))",
          orange: "hsl(var(--neon-orange))",
          yellow: "hsl(var(--neon-yellow))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "glow-pulse": {
          "0%, 100%": {
            opacity: "1",
            filter: "brightness(1)",
          },
          "50%": {
            opacity: "0.8",
            filter: "brightness(1.2)",
          },
        },
        "slide-up": {
          "0%": {
            transform: "translateY(30px)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
        "ken-burns": {
          "0%": {
            transform: "scale(1) translate(0, 0)",
          },
          "100%": {
            transform: "scale(1.15) translate(-5%, -5%)",
          },
        },
         "ken-burns-alt": {
           "0%": {
             transform: "scale(1) translate(0, 0)",
           },
           "100%": {
             transform: "scale(1.12) translate(5%, 3%)",
           },
         },
         "neon-flicker": {
           "0%, 100%": { opacity: "1", filter: "brightness(1)" },
           "2%": { opacity: "0.9", filter: "brightness(0.95)" },
           "4%": { opacity: "1", filter: "brightness(1)" },
           "8%": { opacity: "0.95", filter: "brightness(0.98)" },
           "10%": { opacity: "1", filter: "brightness(1)" },
         },
         "pulse-neon": {
           "0%, 100%": {
             boxShadow: "0 0 20px hsl(var(--neon-pink) / 0.5), 0 0 40px hsl(var(--neon-pink) / 0.3), 0 0 60px hsl(var(--neon-pink) / 0.2)",
           },
           "50%": {
             boxShadow: "0 0 30px hsl(var(--neon-pink) / 0.7), 0 0 60px hsl(var(--neon-pink) / 0.5), 0 0 90px hsl(var(--neon-pink) / 0.3), 0 0 120px hsl(var(--neon-pink) / 0.2)",
           },
         },
         "border-run": {
           "0%": { backgroundPosition: "0% 0%" },
           "100%": { backgroundPosition: "200% 0%" },
         },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "slide-up": "slide-up 0.6s ease-out",
         "fade-in": "fade-in 0.8s ease-out",
         "ken-burns": "ken-burns 7s ease-out forwards",
         "ken-burns-alt": "ken-burns-alt 7s ease-out forwards",
         "neon-flicker": "neon-flicker 4s ease-in-out infinite",
         "pulse-neon": "pulse-neon 2s ease-in-out infinite",
         "border-run": "border-run 3s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
