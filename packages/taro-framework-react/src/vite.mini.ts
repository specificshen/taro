import { defaultMainFields, fs, resolveSync } from '@tarojs/helper'

import { getLoaderMeta } from './loader-meta'

import type { IPluginContext } from '@tarojs/service'
import type { PluginOption } from 'vite'
import type { Frameworks } from './index'

export function miniVitePlugin(ctx: IPluginContext, framework: Frameworks): PluginOption {
  return [injectLoaderMeta(ctx, framework), aliasPlugin(ctx)]
}

function injectLoaderMeta(ctx: IPluginContext, framework: Frameworks): PluginOption {
  return {
    name: 'taro-react:loader-meta',
    buildStart() {
      const { runnerUtils } = ctx
      const { getViteMiniCompilerContext } = runnerUtils
      const viteCompilerContext = getViteMiniCompilerContext(this)
      if (viteCompilerContext) {
        viteCompilerContext.loaderMeta ||= {}
        Object.assign(viteCompilerContext.loaderMeta, getLoaderMeta(framework))
      }
    },
  }
}

function aliasPlugin(ctx: IPluginContext): PluginOption {
  return {
    name: 'taro-react:alias',
    config(config) {
      const alias: { find: string | RegExp; replacement: string }[] = [
        { find: /react-dom$/, replacement: '@tarojs/react' },
        { find: /react-dom\/client$/, replacement: '@tarojs/react' },
      ]

      const mainFields = ['unpkg', ...defaultMainFields]
      const resolveOptions = {
        basedir: process.cwd(),
        mainFields,
      }
      const isProd = config.mode === 'production'
      if (!isProd && ctx.initialConfig.mini?.debugReact !== true) {
        // 开发模式下默认使用 production 版本的 react 减小体积。debugReact 时保留 dev 版本。
        alias.push({
          find: /react-reconciler$/,
          replacement: 'react-reconciler/cjs/react-reconciler.production.min.js',
        })
        alias.push({ find: /^react$/, replacement: 'react/cjs/react.production.min.js' })
        alias.push({ find: /scheduler$/, replacement: 'scheduler/cjs/scheduler.production.min.js' })
        alias.push({ find: /react\/jsx-runtime$/, replacement: 'react/cjs/react-jsx-runtime.production.min.js' })

        // 在 React 18+ 中，package.json#exports 未暴露 ./cjs/ 路径，需要在编译期补齐。
        const reactPkgPath = resolveSync('react/package.json', resolveOptions)
        if (reactPkgPath) {
          const reactPkg = require('react/package.json')
          const reactVersion = reactPkg.version || ''
          if (/^[~^]?(18|19)/.test(reactVersion) && reactPkg.exports) {
            reactPkg.exports = Object.assign(reactPkg.exports, {
              './cjs/': './cjs/',
            })
            fs.writeJsonSync(reactPkgPath, reactPkg, { spaces: 2 })
          }
        }
      }

      return {
        resolve: {
          alias,
        },
      }
    },
  }
}
