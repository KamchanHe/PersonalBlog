---
title: webpack概述
date: 2019-08-31
categories: article
author: Kamchan
tags:
- picGo
- Github
---

- [webpack官网](http://webpack.github.io/)
- <font color="#c7254e">bundle [ˈbʌndl]</font> 捆绑，收集，归拢，把…塞入


        1、webpack 将带有依赖项的各个模块打包处理后，变成了独立的浏览器能够识别的文件
        2、webpack 合并以及解析带有依赖项的模块

## 概述

:::tip
webpack 是一个现代 JavaScript 应用程序的模块打包器(特点 module、 bundler)
webpack 是一个**模块化方案（预编译）**
webpack获取具有依赖关系的模块，并生成表示这些模块的静态资源
:::

- 四个核心概念：**入口(entry)、输出(output)、加载器loader、插件(plugins)**

```
对比
模块化方案: webpack 和 requirejs（通过编写代码的方式将前端的功能，划分成独立的模块）

browserify 是与 webpack 相似的模块化打包工具

webpack 预编译 (在开发阶段通过webpack进行模块化处理, 最终项目上线, 就不在依赖于 webpack)
requirejs 线上的编译( 代码运行是需要依赖与 requirejs 的 )
```

## webpack起源

- webpack解决了现存模块打包器的两个痛点：
  - **Code Spliting** - 代码分离 按需加载
  - **静态资源的模块化处理方案**

## webpack与模块

- [前端模块系统的演进](https://zhaoda.net/webpack-handbook/module-system.html)
- 在webpack看来：所有的**静态资源都是模块**
- webpack 模块能够识别以下等形式的模块之间的依赖：
- JS的模块化规范：
  - ES2015 <font color="#c7254e">import export</font>
  - CommonJS <font color="#c7254e">require() module.exports</font>
  - AMD <font color="#c7254e">define</font> 和 <font color="#c7254e">require</font>
- 非JS等静态资源：
  - css/sass/less 文件中的 <font color="#c7254e">@import</font>
  - 图片连接，比如：样式 <font color="#c7254e">url(...)</font> 或 HTML <font color="#c7254e">`<img src=...>`</font>
  - 字体 等

## webpack文档和资源

- [webpack 中文网](https://doc.webpack-china.org/)
- [webpack 1.0](http://webpack.github.io/docs/what-is-webpack.html)
- [webpack 2.x+](https://webpack.js.org/)
- [入门Webpack，看这篇就够了](https://www.jianshu.com/p/42e11515c10f#)












































