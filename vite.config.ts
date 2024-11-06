import pkg from './package.json'
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';
import banner from 'vite-plugin-banner'

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'Spring',
            formats: ['es', 'cjs', 'umd'],
            fileName: (format) => {
                switch (format) {
                    case 'es':
                        return 'index.mjs';
                    case 'cjs':
                        return 'index.cjs';
                    case 'umd':
                        return 'index.umd.js';
                    default:
                        return 'index.js';
                }
            },
        },
        sourcemap: true,
        // Optimize output
        minify: 'terser',
        terserOptions: {
            compress: {
                passes: 2,
            },
        },
    },
    plugins: [
        dts({
            insertTypesEntry: true,
        }),
        banner(
            `/*!
 * Rk4thSpring - ${pkg.version}
 * Copyright (c) ${new Date().getFullYear()}. Khaled Sameer<khaled.smq@hotmail.com>
 *
 * Licensed under MIT, https://opensource.org/licenses/MIT/
 * Please visit https://github.com/KhaledSMQ/Rk4thSpring for details.
 */

/* eslint-disable */
`,
        ),
    ],
});
