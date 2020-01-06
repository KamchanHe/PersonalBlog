---
title: vue-api vue单文件组件
date: 2019-08-31
categories: article
author: Random
tags:
- Vue
- Webpack
---

- [vue-loader](https://vue-loader-v14.vuejs.org/zh-cn/)
- <font color="#c7254e">single-file components</font>(单文件组件)
- 后缀名：<font color="#c7254e">.vue</font>，该文件需要被预编译后才能在浏览器中使用
- 注意：单文件组件依赖于两个包 <font color="#c7254e">vue-loader</font> / <font color="#c7254e">vue-template-compiler</font>
- 安装：<font color="#c7254e">npm i -D vue-loader vue-template-compiler</font>

```html
<!-- App.vue 示例代码： -->
<template>
  <div>
    <h1>VUE 单文件组件示例 -- App.vue</h1>
    <p>这是 模板内容</p>
  </div>
</template>

<script>
  // 组件中的逻辑代码
  export default {}
</script>

<style>
/* 组件样式 */
h1 {
  color: red;
}
</style>
```

```js
// webpack.config.js 配置：
module: {
  rules: [
    {
      test: /\.vue$/,
      loader: 'vue-loader'
    }
  ]
}
```

## 使用单文件组件

```js
/* main.js */

import Vue from 'vue'
// 导入 App 组件
import App from './App.vue'

const vm = new Vue({
  el: '#app',
  // 通过 render 方法，渲染App组件
  render: c => c(App)
})
```

## 单文件组件使用步骤

- 1、安装：<font color="#c7254e">npm i -D vue-loader vue-template-compiler</font>
- 2、在 <font color="#c7254e">webpack.config.js</font> 中配置 <font color="#c7254e">.vue</font> 文件的<font color="#c7254e">loade</font>r

  - <font color="#c7254e">{ test: /\.vue$/, use: 'vue-loader' }</font>
- 3、创建 <font color="#c7254e">App.vue</font> 单文件组件，注意：<font color="#c7254e">App</font>可以是任意名称
- 4、在 <font color="#c7254e">main.js</font> 入口文件中，导入 <font color="#c7254e">vue</font> 和 <font color="#c7254e">App.vue</font>组件，通过 <font color="#c7254e">render</font> 将组件与实例挂到一起

## 单文件组件+路由

- [vue - Vue.use](https://cn.vuejs.org/v2/api/#Vue-use)
- [Vue.use 和 路由](https://cn.vuejs.org/v2/guide/plugins.html#%E4%BD%BF%E7%94%A8%E6%8F%92%E4%BB%B6)

```js
import Vue from 'vue'
import App from './App.vue'

// ------------- vue路由配置 开始 --------------
import Home from './components/home/Home.vue'
import Login from './components/login/Login.vue'

// 1 导入 路由模块
import VueRouter from 'vue-router'
// 2 ** 调用use方法使用插件 **
Vue.use(VueRouter)
// 3 创建路由对象
const router = new VueRouter({
  routes: [
    { path: '/home', component: Home },
    { path: '/login', component: Login }
  ]
})

// ------------- vue路由配置 结束 --------------

const vm = new Vue({
  el: '#app',
  render: c => c(App),
  // 4 挂载到 vue 实例中
  router
})
```

































































