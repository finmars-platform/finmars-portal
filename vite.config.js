import { defineConfig } from 'vite';
// import environmentPlugin from 'vite-plugin-environment';
import { resolve } from 'path';
import commonjs from '@rollup/plugin-commonjs';
import { nodePolyfills } from 'vite-plugin-node-polyfills'
// import { copy } from 'vite-plugin-copy'; // not working

// var viteStaticCopy = require('vite-plugin-static-copy').viteStaticCopy;

// import { viteStaticCopy } from 'vite-plugin-static-copy'
// import requireTransform from 'vite-plugin-require-transform'; // not working
// import { viteRequire } from 'vite-require' //  working
// import resolve from '@rollup/plugin-node-resolve'; // not working
// import { nodeResolve } from '@rollup/plugin-node-resolve'; // not working
// import babel from 'rollup-plugin-babel'; // not working

import path from 'path'

export default defineConfig({
    optimizeDeps: {
        esbuildOptions: {
            resolveExtensions: ['.js'],
        },
    },
    plugins: [
        // viteStaticCopy({
        //     targets: [
        //         { src: path.resolve(__dirname, 'src/portal/scripts/app/views/**/*.html'), dest: 'dist/views' }
        //     ],
        // }),
        // nodeResolve({ // not working
        //     browser: true, // Resolve browser-specific versions of packages if available
        //     preferBuiltins: true, // Prefer Node.js built-ins (set to false if not using Node.js built-ins)
        // }),
        commonjs(),
        nodePolyfills(),
        // babel({ // not working
        //     // babelHelpers: 'bundled',
        //     exclude: "node_modules/**",
        //     presets: ["@babel/preset-env"],
        //     include: [
        //         'src/**/*.js', // required, do not delete
        //     ],
        // }),


        // resolve(), // not working
        // commonjs() // not working
        // viteRequire(/* options */),

        // requireTransform({}),
        // nodePolyfills(),
        // environmentPlugin({ /* Define your environment variables here */ })
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'), // Adjust according to your project structure
        }
    },
    css: {
        preprocessorOptions: {
            less: {
                // Options for LESS
            }
        }
    },
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'), // Main entry point
                // script: resolve(__dirname, 'src/portal/scripts/main.js'), // Main JS entry point
                // script: resolve(__dirname, 'src/shell/scripts/main.js'), // Main JS entry point
                // Define other entry points for core, database, portal, profile, shell, etc.
                // Example: core: resolve(__dirname, 'path/to/core/index.js')
            },
            output: {
                dir: 'dist', // Output directory
                // format: 'esm', // Format of the modules (esm for ES Modules)
                format: 'cjs',
                // globals: {
                //     jquery: 'window.jQuery', // not needed, see bootstrap.js
                // }
                // entryFileNames: '[name]/[name].js', // Entry files in their respective directories
            },
            external: [

            ], // External dependencies
        },
        commonjsOptions: {
            transformMixedEsModules: true,
            strictRequires: true,
            include: [
                'node_modules/**',
                'src/**/*.js', // required, do not delete
            ],
            defaultIsModuleExports: false, // important
            requireReturnsDefault: true, // not working
        },
        outDir: 'dist', // Ensure the output directory is 'dist'
        assetsDir: '.', // Assets will be placed directly in the dist folder
        // minify: 'esbuild', // Use esbuild for minification
        // sourcemap: false // Set to true if you need source maps
        minify: false,
        sourcemap: true, // Enable source maps
    }
});