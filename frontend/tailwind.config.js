/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'background': '#222831',
                'primary-100': '#BDDADC',
                'primary-200': '#96C3C6',
                'primary-300': '#76ABAE',
                'primary-400': '#669A9B',
                'primary-500': '#54898A',
                'primary-600': '#4F7D7D',
                'primary-700': '#486D6D',
                'primary-800': '#425E5D',
                'primary-900': '#344241',

                'secondary-200': '#BAC0CB',
                'secondary-300': '#9EA7B6',
                'secondary-400': '#8993A5',
                'secondary-500': '#748095',
                'secondary-600': '#667184',
                'secondary-700': '#545D6D',
                'secondary-800': '#444B57',
                'secondary-900': '#31363F',

                'success-100': '#D9FFBE',
                'success-200': '#BCFF91',
                'success-300': '#99FF59',
                'success-400': '#74FF03',
                'success-500': '#48FD00',
                'success-600': '#28EA00',
                'success-700': '#00D400',
                'success-800': '#00C000',
                'success-900': '#009B00',
                
                'error-100': '#FFCDD2',
                'error-200': '#EF9A9A',
                'error-300': '#E57373',
                'error-400': '#EF5350',
                'error-500': '#F44336',
                'error-600': '#E53935',
                'error-700': '#D32F2F',
                'error-800': '#B71B1C',
                'error-900': '#B71B1C',
            },
        },
    },
    plugins: [],
}

