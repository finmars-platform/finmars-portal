import { defineConfig, loadEnv, PluginOption, ViteDevServer } from 'vite';
// import environmentPlugin from 'vite-plugin-environment';
import * as fs from 'node:fs'
import * as process from 'node:process'
import { resolve } from 'path';
import commonjs from '@rollup/plugin-commonjs';
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import vue from '@vitejs/plugin-vue'

const DynamicConfigPlugin : PluginOption = {
    name: 'dynamic-config-plugin',
    apply: 'serve',
    configureServer(server: ViteDevServer) {
        return () => {
            const env = loadEnv('', process.cwd(), '')
            server.middlewares.use('', (req, res, next) => {
                if (!req.originalUrl.endsWith('/config.js')) {
                    return next()
                }
                let content = fs.readFileSync('./public/config.js.template', 'utf-8');
                const variables = getEnvironmentVariablesFromString(content);
                for (const variable of variables) {
                    const value = env?.[variable] ?? '';
                    content = content.replace(`\${${variable}}`, value);
                }
                res.setHeader('Content-Type', 'application/javascript');
                res.end(content);
            })
        }
    }
}

export default defineConfig({
    base: './',
    plugins: [
        nodePolyfills(),
        // environmentPlugin({ /* Define your environment variables here */ })
        vue(),
        DynamicConfigPlugin
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'), // Adjust according to your project structure
            //'vite-plugin-node-polyfills/shims/buffer': 'buffer'
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
        rolldownOptions: {
            input: [
              'index.html',
              'node_modules/pdfjs-dist/build/pdf.worker.mjs'
                //main: resolve(__dirname, 'index.html'), // Main entry point
                // script: resolve(__dirname, 'src/portal/scripts/main.js'), // Main JS entry point
                // script: resolve(__dirname, 'src/shell/scripts/main.js'), // Main JS entry point
                // Define other entry points for core, database, portal, profile, shell, etc.
                // Example: core: resolve(__dirname, 'path/to/core/index.js')
            ],
            output: {
                dir: 'dist', // Output directory
                // format: 'esm', // Format of the modules (esm for ES Modules)
                format: 'es',
                chunkFileNames: 'chunks/[name]-[hash].js',
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        // Return the directory name under node_modules as the chunk name

                        // const modules = ['pdfjs']; // Specify your major dependencies here
                        // const match = modules.find(module => id.includes(`/node_modules/${module}`));
                        // if (match) {
                        //     return match; // Return the module name as the chunk name
                        // }

                        return 'vendor';
                    }
                }
                // globals: {
                //     jquery: 'window.jQuery', // not needed, see bootstrap.js
                // }
                // entryFileNames: '[name]/[name].js', // Entry files in their respective directories
            },
            external: [

            ], // External dependencies
        },
        outDir: 'dist', // Ensure the output directory is 'dist'
        assetsDir: 'public/', // Assets will be placed directly in the dist folder
        minify: false,
        sourcemap: true, // Enable source maps
    }
});

const ENVIRONMENT_VARIABLE_REGEX = new RegExp(/\$\{([a-zA-Z_][a-zA-Z0-9_]*)}/g);
function getEnvironmentVariablesFromString(string: string): string[] {
    const matches = [...string.matchAll(ENVIRONMENT_VARIABLE_REGEX)];
    const uniqueMatches = new Set(matches.map((match) => match[1]));
    return [...uniqueMatches];
}
