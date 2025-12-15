/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // must include this
  ],
  theme: {
     screens: {
      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }
    },
    extend: {
      // FONT FAMILY FOR EDIFY
      fontFamily: {
        manrope: ["Manrope", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"]
      },
      // COLOR PALLETE OF EDIFY
      colors: {
            // Define your custom colors here
            'accent': '#6956E5', // the purple one
            'secondary-accent': '#E9EAFF', // the light purple one 
            'font-color': '#23262F', // Dark gray one
            'gray-87': '#878787' // gray one
      }
    },
  },
  plugins: [],
}
