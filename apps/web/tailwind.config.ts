import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light theme colors
        'light-bg': 'var(--light-bg)',
        'light-text': 'var(--light-text)',
        'light-accent': 'var(--light-accent)',
        'light-border': 'var(--light-border)',
        'light-card': 'var(--light-card)',
        
        // Dark theme colors
        'dark-bg': 'var(--dark-bg)',
        'dark-text': 'var(--dark-text)',
        'dark-accent': 'var(--dark-accent)',
        'dark-card': 'var(--dark-card)',
        'dark-border': 'var(--dark-border)',
        
        // McDonald's theme colors (for the memes 🍟)
        'mcd-bg': 'var(--mcd-bg)',
        'mcd-text': 'var(--mcd-text)',
        'mcd-accent': 'var(--mcd-accent)',
        'mcd-secondary': 'var(--mcd-secondary)',
        'mcd-card': 'var(--mcd-card)',
        'mcd-border': 'var(--mcd-border)',
        
        // Cyberpunk theme colors (futuristic vibes 🤖)
        'cyber-bg': 'var(--cyber-bg)',
        'cyber-text': 'var(--cyber-text)',
        'cyber-accent': 'var(--cyber-accent)',
        'cyber-secondary': 'var(--cyber-secondary)',
        'cyber-card': 'var(--cyber-card)',
        'cyber-border': 'var(--cyber-border)',
        
        // Semantic color mappings
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        accent: 'var(--accent)',
        border: 'var(--border)',
        card: 'var(--card)',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'Arial', 'Helvetica', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'soft-dark': '0 2px 8px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
}

export default config
