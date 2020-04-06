import sourceMaps from 'rollup-plugin-sourcemaps'
import typescript from 'rollup-plugin-typescript2'

import { terser } from "rollup-plugin-terser";
import pkg from './package.json';

export default {
    input: `src/viewportchecker.ts`,
    output: [
        { file: pkg.main, name: 'ViewportChecker', format: 'umd', sourcemap: true },
        { file: pkg.module, format: 'es', sourcemap: true },
    ],
    watch: {
        include: 'src/**',
    },
    plugins: [
        // Compile TypeScript files
        typescript({ useTsconfigDeclarationDir: true }),
        // Resolve source maps to the original source
        sourceMaps(),
        terser()
    ],
}