<div align="center">
  <h1>SPCSN Taro Mini Runtime</h1>
  <p>本仓库是从 Taro 代码基线演进出来的 <strong>@spcsn 独立底座</strong>，长期维护目标：<strong>React 19 + Vite + 微信小程序（Skyline / glass-easel 优先）</strong>。</p>
  <p>从 <code>0.1.0</code> 开始，本仓库不再使用上游 Taro 的 <code>4.x</code> 版本语义；所有可发布包统一走 <code>@spcsn/*</code> 私有发行线。Vue / Solid / Nerv 等框架路径、H5 / RN / 支付宝 / 字节 / 百度 / QQ / 鸿蒙 等平台路径、Webpack runner 已不在维护范围内。</p>
  <hr />
  <a href="https://github.com/specificshen/taro">
    <img src="https://img.shields.io/badge/@spcsn-React%2019%20%2B%20WeApp-blue?style=flat-square" alt="SPCSN Release">
  </a>
  <a href="./LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="MIT License">
  </a>
  <p>
    <a href="./README.md">简体中文</a> | <a href="./README_EN.md">English</a>
  </p>
</div>

> 👽 Taro['tɑ:roʊ]，泰罗·奥特曼，宇宙警备队总教官，实力最强的奥特曼。

## 目录

1. [简介](#简介)
2. [学习资源](#学习资源)
3. [社区共享](#社区共享)
4. [项目状态](#项目状态)
5. [使用案例](#使用案例)
6. [加入共建](#加入共建)
7. [问题反馈与建议](#问题反馈与建议)
8. [特别鸣谢](#特别鸣谢)
9. [贡献者们](#贡献者们)
10. [开发计划](#开发计划)
11. [更新日志](#更新日志)
12. [开发交流](#开发交流)

## 简介

本仓库不再按原 Taro 的“多框架、多平台、多编译器”路线继续演进，而是作为 `@spcsn` 独立私有发行线，聚焦 React 19 + Vite + 微信小程序。业务侧只需要理解自己直接使用的运行 API、组件包和 CLI；Vite、Babel、PostCSS、Terser、React framework 插件、WeApp 平台插件、runtime 注入等构建实现细节由底座内部包闭包承接。

### 独立版本线

`@spcsn` 底座从 `0.1.0` 开始发布。这个版本号不再映射上游 Taro 的 `4.x`，含义是：

- `0.x`：私有底座快速迭代阶段，允许继续收敛不需要的上游跨端能力。
- `0.1.x`：React 19 + Vite + WeApp / Skyline 这条主链路的 patch 修复。
- 后续 `0.2.0`、`0.3.0` 用于表达底座能力边界变化，而不是跟随上游 Taro minor。

不要把 `@spcsn/*` 与官方 `@tarojs/*` 混装，也不要用上游 Taro 版本号判断本仓库能力范围。

### 当前 fork 支持范围

- 仅保证 **React 19 + 微信小程序（WeApp）**
- 默认并推荐使用 **Vite**
- CI / build / private publish 已收敛到 React + WeApp 保留链路
- 本 fork 不再保证 H5、React Native、Harmony 以及 Vue / Solid 相关能力可用
- 建议使用 **Node.js 22+** 与 **pnpm 10**
- 所有 `@spcsn/*` 底座包必须来自同一个私有发行版本，不要与官方 `@tarojs/*` 混装

### 版本迁移

Taro 1/2 迁移至 Taro 3，请阅读[《Taro 版本升级权威指南》](https://docs.taro.zone/blog/2020-09-01-taro-versions)

### 最小依赖集（本 fork）

使用本 fork 开发微信小程序时，核心依赖为：

```json
{
  "dependencies": {
    "@spcsn/taro": "0.1.0",
    "@spcsn/taro-components": "0.1.0",
    "react": "^19.2.0"
  },
  "devDependencies": {
    "@spcsn/taro-cli": "0.1.0"
  }
}
```

业务工程不要显式安装 `@spcsn/taro-runtime`、`@spcsn/taro-react`、`@spcsn/taro-vite-runner`、`@spcsn/taro-plugin-framework-react`、`@spcsn/taro-plugin-platform-weapp`、`@spcsn/babel-preset-taro`、`vite`、`postcss`、`terser`、`@vitejs/plugin-react`、`@babel/core`、`@babel/preset-react`、`react-refresh` 等底座内部实现依赖。它们属于 CLI / runner / framework / platform 包的实现闭包。

### 私有发行包组

私有发布和业务验证必须成组替换，不要只替换 CLI 或 runtime。当前低风险发行包组由脚本维护：

```bash
pnpm run pack:private -- --dry-run
pnpm run pack:private -- --dest ../taro-private-packs
```

生成 tarball 前请先完成构建；业务工程安装时，所有 `@spcsn/*` 底座包应指向同一个私有版本或同一批 tarball。

项目配置示例 (`config/index.ts`)：

```ts
export default {
  framework: 'react',
  compiler: 'vite',
  mini: {
    compile: { prerender: true },
    output: { renderer: 'skyline', componentFramework: 'glass-easel' },
  },
}
```

## 学习资源

[5 分钟上手 Taro 开发](https://docs.taro.zone/docs/guide)

[awesome-taro](https://github.com/NervJS/awesome-taro)

## 社区共享

[Taro 物料市场——让每一个轮子产生价值](http://taro-ext.jd.com/)

### UI 库

| 名称                                               | 地址                                             | 介绍                                                            | 支持的框架 | 支持的 Taro 版本 |
| -------------------------------------------------- | ------------------------------------------------ | --------------------------------------------------------------- | ---------- | ---------------- |
| [taro-ui](https://github.com/NervJS/taro-ui)       | https://taro-ui.jd.com/#/                        | 一套基于 Taro 框架开发的多端 UI 组件库                          | React      | Taro 1/2/3       |
| [NutUI](https://github.com/jdf2e/nutui)            | https://nutui.jd.com/#/                          | 京东风格的轻量级移动端 Vue 组件库                               | Vue3       | Taro 3           |
| [taroify](https://github.com/mallfoundry/taroify)  | https://taroify.github.io/taroify.com/introduce/ | 轻量、可靠的小程序端 Taro 组件库（Vant 的 Taro 版本）           | React      | Taro 3           |
| [@antmjs/vantui](https://github.com/AntmJS/vantui) | https://antmjs.github.io/vantui/#/home           | 基于有赞 VantWeapp 开发的同时支持 Taro 和 React 的 UI 库        | React      | Taro 3           |
| [Tard](https://github.com/jd-antelope/tard)        | https://tard-ui.selling.cn/                      | 一套基于 Taro 框架开发的多端 React UI 组件库                    | React      | Taro 3           |
| [duxui](https://github.com/duxapp/duxui)           | https://duxapp.cn/docs/duxui/start/              | 一套能同时兼容小程序、React Native、鸿蒙、H5 的移动端 ui 组件库 | React      | Taro 4           |

## 项目状态

![Alt](https://repobeats.axiom.co/api/embed/275806b6f177f7e4c005e956d94440562635c36d.svg 'Repobeats analytics image')

## 使用案例

Taro 已经投入了我们的生产环境中使用，业界也在广泛地使用 Taro 开发多端应用。

<a href="https://nervjs.github.io/taro-user-cases/"><img src="https://raw.githubusercontent.com/NervJS/taro-user-cases/master/user-cases.jpg" /></a>

[征集更多优秀案例](https://github.com/NervJS/taro/issues/244)

## 加入共建

#### 加入 Taro 社区共建倡议

[Taro 邀你加入社区共建](https://github.com/NervJS/taro/issues/4714)

#### 为 Taro 贡献代码

Taro 非常欢迎社区开发者为 Taro 贡献代码，在贡献之前请先阅读[贡献指南](https://nervjs.github.io/taro/docs/CONTRIBUTING.html)。

如果你想为 Taro 实现一个重要功能，需要先撰写 RFC 文档，按照 Taro 的[RFC 机制](https://github.com/NervJS/taro-rfcs)进行操作，在经过社区讨论完善后才可以进行代码的提交。

## 问题反馈与建议

[给 Taro 提 ISSUE](https://nervjs.github.io/taro-issue-helper/)

> 强烈推荐阅读 [《提问的智慧》](https://github.com/ryanhanwu/How-To-Ask-Questions-The-Smart-Way)、[《如何向开源社区提问题》](https://github.com/seajs/seajs/issues/545) 和 [《如何有效地报告 Bug》](http://www.chiark.greenend.org.uk/%7Esgtatham/bugs-cn.html)、[《如何向开源项目提交无法解答的问题》](https://zhuanlan.zhihu.com/p/25795393)，更好的问题更容易获得帮助。

[![Let's fund issues in this repository](https://issuehunt.io/static/embed/issuehunt-button-v1.svg)](https://issuehunt.io/repos/128624453)

## 特别鸣谢

| [![nanjingboy](https://avatars1.githubusercontent.com/u/1390888?s=100&v=4)](https://github.com/nanjingboy/) | [![jsNewbee](https://avatars3.githubusercontent.com/u/20449400?s=100&v=4)](https://github.com/js-newbee/) | [![Qiyu8](https://avatars2.githubusercontent.com/u/15245051?s=100&v=4)](https://github.com/Qiyu8/) | [![Garfield550](https://avatars2.githubusercontent.com/u/3471836?s=100&v=4)](https://github.com/Garfield550/) |
| :---------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------: |
|                                [nanjingboy](https://github.com/nanjingboy/)                                 |                                 [jsNewbee](https://github.com/js-newbee/)                                 |                                 [Qiyu8](https://github.com/Qiyu8/)                                 |                                [Garfield Lee](https://github.com/Garfield550/)                                |

## 贡献者们

<a href="https://github.com/NervJS/taro/graphs/contributors"><img src="https://opencollective.com/taro/contributors.svg?width=890&button=false" /></a>

## 开发计划

[Milestones](https://github.com/NervJS/taro/milestones)

## 更新日志

本项目遵从 [Angular Style Commit Message Conventions](https://gist.github.com/stephenparish/9941e89d80e2bc58a153)，更新日志请查阅 [Release](https://github.com/NervJS/taro/releases)。

## 开发交流

[官方交流微信群](https://github.com/NervJS/taro/issues/198)

## License

MIT License

Copyright (c) O2Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
