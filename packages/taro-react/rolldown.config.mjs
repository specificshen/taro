import { defineConfig } from 'rolldown'

const externalPackages = ['@tarojs/runtime', '@tarojs/shared', 'react', 'react-reconciler']
const external = (id) => externalPackages.some((pkg) => id === pkg || id.startsWith(`${pkg}/`))

export default defineConfig({
  input: 'src/index.ts',
  external,
  output: {
    sourcemap: true,
    format: 'es',
    file: 'dist/react.esm.js',
  },
})
