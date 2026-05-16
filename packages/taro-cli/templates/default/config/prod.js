{{#if typescript }}import type { UserConfigExport } from "@tarojs/cli"{{/if}}

export default {
  mini: {}
}{{#if typescript }} satisfies UserConfigExport<'vite'>{{/if}}
