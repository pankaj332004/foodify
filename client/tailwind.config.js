/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                heading: ['Poppins', 'Inter', 'sans-serif'],
            },
            colors: {
                primary: {
                    DEFAULT: '#ff5722',
                    dark: '#e64a19',
                    light: '#ff8a65',
                    50: '#fff3ee',
                    100: '#ffe8dd',
                    200: '#ffd4c2',
                },
                secondary: {
                    DEFAULT: '#ffa726',
                    dark: '#fb8c00',
                },
                brand: {
                    bg: '#fff8f5',
                    footer: '#1a0a00',
                },
            },
            boxShadow: {
                'primary-sm': '0 2px 8px rgba(255,87,34,0.10)',
                'primary-md': '0 8px 32px rgba(255,87,34,0.15)',
                'card': '0 4px 24px rgba(0,0,0,0.08)',
                'card-hover': '0 8px 32px rgba(255,87,34,0.15)',
                'btn': '0 6px 20px rgba(255,87,34,0.35)',
                'auth-card': '0 20px 60px rgba(255,87,34,0.15), 0 4px 16px rgba(0,0,0,0.06)',
            },
        },
    },
    plugins: [],
};
