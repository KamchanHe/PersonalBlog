---
title: webpack的基本使用
date: 2019-09-01
categories: article
author: Kamchan
tags:
- picGo
- Github
---

- 全局安装：<font color="#c7254e">npm i -g webpack</font>
  - 目的：在任何目录中通过<font color="#c7254e">CLI</font>使用 <font color="#c7254e">webpack</font> 这个命令
- 项目安装：<font color="#c7254e">npm i -D webpack</font>
  - 目的：执行当前项目的构建
- webpack的两种使用方式：1 命令行 2 配置文件（<font color="#c7254e">webpack.config.js</font>）

## 命令行方式演示 - 案例：隔行变色

- 使用 <font color="#c7254e">npm init -y</font> 初始 <font color="#c7254e">package.json</font>，使用npm来管理项目中的包
- 新建 <font color="#c7254e">index.html</font> 和 <font color="#c7254e">index.js</font>，实现隔行变色功能
- 运行 <font color="#c7254e">webpack src/js/index.js dist/bundle.js</font> 进行打包构建，语法是：<font color="#c7254e">webpack 入口文件 输出文件</font>
- 注意：需要在页面中引入 输出文件 的路径（此步骤可通过配置webpack去掉）

```js
/*
  src/js/index.js
*/

// 1 导入 jQuery
import $ from 'jquery'
// 2 获取页面中的li元素
const $lis = $('#ulList').find('li')
// 3 隔行变色
// jQuery中的 filter() 方法用来过滤jquery对象
$lis.filter(':odd').css('background-color', '#def')
$lis.filter(':even').css('background-color', 'skyblue')

//命令行运行 `webpack src/js/index.js   dist/bundle.js   目录生成在命令行运行目录
/*
  运行流程：
  1、webpack 根据入口找到入口文件
  2、分析js中的模块化语法
  3、将所有关联文件 打包合并输出到出口
*/
```

## webpack-dev-server 配置

### 一、package.json配置方式

- 安装：<font color="#c7254e">npm i -D webpack-dev-server</font>
- 作用：配合webpack，创建开发环境（启动服务器、监视文件变化、自动编译、刷新浏览器等），提高开发效率
- 注意：无法直接在终端中执行 <font color="#c7254e">webpack-dev-server</font>，需要通过 <font color="#c7254e">package.json</font> 的 <font color="#c7254e">scripts</font> 实现
- 使用方式：<font color="#c7254e">npm run dev</font>

```js
// 参数解释  注意参数是无序的 有值的参数空格隔开
// --open 自动打开浏览器
// --contentBase ./  指定浏览器 默认打开的页面路径中的 index.html 文件
// --open 自动打开浏览器
// --port 8080 端口号
// --hot 热更新，只加载修改的文件(按需加载修改的内容)，而非全部加载
"scripts": {
  "dev": "webpack-dev-server --open --contentBase ./ --port 8080 --hot"
}
```

### 二、webpack.config.js 配置方式(推荐)

```js
var path = require('path')
module.exports = {
  // 入口文件
  entry: path.join(__dirname, 'src/js/index.js'),

  // 输出文件
  output: {
    path: path.join(__dirname, 'dist'),   // 输出文件的路径
    filename: 'bundle.js'                 // 输出文件的名称
  }
}

const webpack = require('webpack')

devServer: {
  // 服务器的根目录 Tell the server where to serve content from
  // https://webpack.js.org/configuration/dev-server/#devserver-contentbase
  contentBase: path.join(__dirname, './'),
  // 自动打开浏览器
  open: true,
  // 端口号
  port: 8888,

  // --------------- 1 热更新 -----------------
  hot: true
},

plugins: [
  // ---------------- 2 启用热更新插件 ----------------
  new webpack.HotModuleReplacementPlugin()
]
```

- html-webpack-plugin 插件
  - 安装：<font color="#c7254e">npm i -D html-webpack-plugin</font>
  - 作用：根据模板，自动生成html页面
  - 优势：页面存储在内存中，自动引入bundle.js、css等文件

```js
/* webpack.config.js */
const htmlWebpackPlugin = require('html-webpack-plugin')
plugins: [
  new htmlWebpackPlugin({
    // 模板页面路径
    template: path.join(__dirname, './index.html'),
    // 在内存中生成页面路径，默认值为：index.html
    filename: 'index.html'
  })
]
```

## Loaders（加载器）

- [webpack - Loaders](https://webpack.js.org/loaders/)
- [webpack - 管理资源示例](https://webpack.docschina.org/guides/asset-management)

:::tip
webpack enables use of loaders to preprocess files. This allows you to bundle any static resource way beyond JavaScript.

Webpack允许使用加载程序预处理文件。这允许您将任何静态资源捆绑到Javascript之外。
:::

- webpack只能处理JavaScript资源
- webpack通过loaders处理非JavaScript静态资源

### CSS打包

- 安装：<font color="#c7254e">npm i -D style-loader css-loader</font>
- 注意：use中模块的<font color="#c7254e">顺序不能颠倒</font>，加载顺序：<font color="#c7254e">从右向左加载</font>

```js
/* 在index.js  导入 css 文件*/
import './css/app.css'

/* webpack.config.js 配置各种资源文件的loader加载器*/
module: {
  // 配置匹配规则
  rules: [
    // test 用来配置匹配文件规则（正则）
    // use  是一个数组，按照从后往前的顺序执行加载
    {test: /\.css$/, use: ['style-loader', 'css-loader']},
  ]
}
```

### 使用webpack打包sass文件

- 安装：<font color="#c7254e">npm i -D sass-loader node-sass</font>
- 注意：<font color="#c7254e">sass-loader</font> 依赖于 <font color="#c7254e">node-sass</font> 模块

```js
/* webpack.config.js */
// 参考：https://webpack.js.org/loaders/sass-loader/#examples
// "style-loader"  ：creates style nodes from JS strings 创建style标签
// "css-loader"    ：translates CSS into CommonJS 将css转化为CommonJS代码
// "sass-loader"   ：compiles Sass to CSS 将Sass编译为css
module:{
  rules:[
    {test: /\.(scss|sass)$/, use: ['style-loader', 'css-loader', 'sass-loader']},
  ]
}
```

### 图片和字体打包

- 安装：<font color="#c7254e">npm i -D url-loader file-loader</font>
- <font color="#c7254e">file-loader</font>：加载并重命名文件（图片、字体 等）
- <font color="#c7254e">url-loader</font>：将图片或字体转化为base64编码格式的字符串，嵌入到样式文件中

### 图片打包细节

- <font color="#c7254e">limit</font>参数的作用：（单位为：字节(byte)）
  - 当图片文件大小（字节）<font color="#c7254e">小于</font>指定的limit时，图片被转化为base64编码格式
  - 当图片文件大小（字节）<font color="#c7254e">大于</font>等于指定的limit时，图片被重命名以url路径形式加载（此时，需要<font color="#c7254e">file-loader</font>来加载图片）
- 图片文件重命名，保证相同文件不会被加载多次。例如：一张图片（a.jpg）拷贝一个副本（b.jpg），同时引入这两张图片，重命名后只会加载一次，因为这两张图片就是同一张
- 文件重命名以后，会通过MD5加密的方式，来计算这个文件的名称

```js
/* webpack.config.js */

module: {
  rules: [
    // {test: /\.(jpg|png|gif|jpeg)$/, use: 'url-loader?limit=100'},
    {
      test: /\.(jpg|png|gif|jpeg)$/,
      use: [
        {
          loader: 'url-loader',
          options: {
            limit: 8192
          }
        }
      ]
    }
  ]
}
```

### 字体文件打包说明

- 处理方式与图片相同，可以使用：<font color="#c7254e">file-loader</font>或<font color="#c7254e">url-loader</font>




























































