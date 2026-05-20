import { defineConfig } from 'rolldown';

const baseOutput = {
  sourcemap: true,
  exports: 'named',
};

export default defineConfig([
  {
    input: 'src/index.ts',
    output: {
      ...baseOutput,
      dir: 'dist',
      preserveModules: true,
      preserveModulesRoot: 'src',
    },
  },
  {
    input: 'src/index.ts',
    output: {
      ...baseOutput,
      file: 'dist/index.cjs.js',
      format: 'cjs',
    },
  },
  {
    input: 'src/index.ts',
    output: {
      ...baseOutput,
      file: 'dist/shared.esm.js',
      format: 'es',
    },
  },
  {
    input: 'src/template.ts',
    output: {
      ...baseOutput,
      file: 'dist/template.js',
      format: 'cjs',
    },
  },
]);
