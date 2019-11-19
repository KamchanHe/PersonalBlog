---
title: vue-cli3 配置webpack
date: 2019-11-19
categories: article
author: Kamchan
tags:
- vue
- vue-cli3
- webpack
---

:::tip vue-cli 3 生成内部webpack配置文件
terminal 中 vue inspect > output.js
:::

:::tip vue-cli 3 之 2.0模版
使用 vue init webpack [项目名] 来创建
:::

vue create [项目名] 之后 在根目录下创建 <font color="#e7254e">vue.config.js</font>

```js
const path = require('path');

function resolve(dir) {
 return path.join(__dirname, dir);
}
module.exports = {
 // 基本路径
 publicPath: '/',
 // 输出文件目录
 outputDir: 'dist',
 // eslint-loader 是否在保存的时候检查
 assetsDir: '',
 indexPath: 'index.html',
 filenameHashing: true,
 pages: undefined,
 lintOnSave: true,
 runtimeCompiler: false,
 transpileDependencies: [],
 productionSourceMap: true,
 crossorigin: undefined,
 integrity: false,
 // use the full build with in-browser compiler?
 // https://vuejs.org/v2/guide/installation.html#Runtime-Compiler-vs-Runtime-only
 // compiler: false,
 // webpack配置
 // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
 chainWebpack: config => {
  config.resolve.alias.set('@', resolve('src')).set('@public', resolve('public'));
  // 这里只写了两个个，你可以自己再加，按这种格式.set('', resolve(''))
 },
 configureWebpack: () => {},
 // vue-loader 配置项
 // https://vue-loader.vuejs.org/en/options.html
 // vueLoader: {},
 // css相关配置
 css: {
  // 是否使用css分离插件 ExtractTextPlugin
  extract: true,
  // 开启 CSS source maps?
  sourceMap: true,
  // css预设器配置项
  loaderOptions: {
   less: {
    // @是src的别名
    prependData: `@import "@/assets/css/global.less";`
    // sourceMap: true
   }
  }
  // 启用 CSS modules for all css / pre-processor files.
  // modules: false
 },
 // use thread-loader for babel & TS in production build
 // enabled by default if the machine has more than 1 cores
 parallel: require('os').cpus().length > 1,
 // 是否启用dll
 // See https://github.com/vuejs/vue-cli/blob/dev/docs/cli-service.md#dll-mode
 // dll: false,
 // PWA 插件相关配置
 // see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
 pwa: {},
 // webpack-dev-server 相关配置
 devServer: {
  // hot: true,
  open: true,
  host: '0.0.0.0',
  port: 8080,
  https: false,
  hotOnly: false,
  proxy: null, // 设置代理
  before: app => {},
  overlay: {
   warnings: true,
   errors: true
  }
 },
 // 第三方插件配置
 pluginOptions: {
  'style-resources-loader': {
   preProcessor: 'less',
   patterns: [
    // 这个是加上自己的路径，
    // 注意：试过不能使用别名路径
    path.resolve(__dirname, './src/assets/css/global.less')
   ]
  }
 }
};
```