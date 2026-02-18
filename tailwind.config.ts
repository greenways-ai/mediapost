import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base
        background: "var(--background)",
        foreground: "var(--foreground)",
        
        // Surface
        surface: {
          DEFAULT: "var(--surface)",
          elevated: "var(--surface-elevated)",
          sunken: "var(--surface-sunken)",
          hover: "var(--surface-hover)",
        },
        
        // Text
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          tertiary: "var(--text-tertiary)",
          inverse: "var(--text-inverse)",
        },
        
        // Accent - Neon Green
        accent: {
          DEFAULT: "var(--accent)",
          light: "var(--accent-light)",
          dark: "var(--accent-dark)",
          muted: "var(--accent-muted)",
          glow: "var(--accent-glow)",
        },
        
        // Alert - Vibrant Red
        alert: {
          DEFAULT: "var(--alert)",
          light: "var(--alert-light)",
          dark: "var(--alert-dark)",
          muted: "var(--alert-muted)",
        },
        
        // Warning
        warning: {
          DEFAULT: "var(--warning)",
          muted: "var(--warning-muted)",
        },
        
        // Info - Cyan
        info: {
          DEFAULT: "var(--info)",
          muted: "var(--info-muted)",
        },
        
        // Status
        success: "var(--success)",
        error: "var(--error)",
        pending: "var(--pending)",
        
        // Border
        border: "var(--border)",
        "border-strong": "var(--border-strong)",
        divider: "var(--divider)",
      },
      
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      
      fontSize: {
        'display-xl': ['6rem', { lineHeight: '1', letterSpacing: '-0.04em' }],
        'display-lg': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
        'display-md': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
        'display-sm': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'display-xs': ['1.75rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
      },
      
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        full: "var(--radius-full)",
      },
      
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        glow: "var(--shadow-glow)",
        'glow-red': "var(--shadow-glow-red)",
      },
      
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-accent': 'linear-gradient(135deg, var(--accent) 0%, var(--info) 100%)',
        'gradient-alert': 'linear-gradient(135deg, var(--alert) 0%, #ff6b6b 100%)',
      },
      
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px var(--accent-glow)' },
          '50%': { boxShadow: '0 0 40px var(--accent-glow)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
      
      transitionTimingFunction: {
        'bounce-out': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
