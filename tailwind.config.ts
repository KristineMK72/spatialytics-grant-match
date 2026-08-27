import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          cyan: '#22d3ee',
          amber: '#fbbf24',
          navy: '#020617',
        },
      },
    },
  },
  plugins: [],
};

export default config;
