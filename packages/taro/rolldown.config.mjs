import { defineConfig } from 'rolldown'

const externalPackages = ['@tarojs/api', '@tarojs/runtime', '@tarojs/shared', 'react']
const external = (id) => externalPackages.some((pkg) => id === pkg || id.startsWith(`${pkg}/`))

export default defineConfig({
  input: 'src/index.js',
  external,
  output: {
    file: 'dist/index.js',
    format: 'cjs',
    sourcemap: true,
    exports: 'auto',
  },
})
