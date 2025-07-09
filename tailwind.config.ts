import type { Config } from "tailwindcss"

import defaultTheme from 'tailwindcss/defaultTheme'

export default {
    darkMode: 'class', // Enable dark mode support
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                // sans: ['Poppins', ...defaultTheme.fontFamily.sans],
                // display: ['Playfair Display', ...defaultTheme.fontFamily.mono]
            },
            aspectRatio: {
                'cinema': '21/9'
            }
        },
    },
    plugins: [],
} satisfies Config
