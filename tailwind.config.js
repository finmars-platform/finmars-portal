import {tailwindCssVariables} from "@finmars/ui";

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/portal/scripts/app/views/**/*.html",
        "./node_modules/@finmars/ui/dist/finmars-ui.css",
        "./node_modules/@finmars/ui/dist/finmars-ui.es.js",
    ],
    theme: {
        extend: {},
    },
    plugins: [tailwindCssVariables],
}
