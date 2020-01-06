---
title: vue-api 计算属性
date: 2019-08-26
categories: article
author: Random
tags:
- Vue
- Webpack
---

- 说明：计算属性是基于它们的依赖进行缓存的，只有在它的依赖发生改变时才会重新求值
- 注意：Mustache语法（{{}}）中不要放入太多的逻辑，否则会让模板过重、难以理解和维护
- 注意：computed中的属性不能与data中的属性同名，否则会报错
- [Vue computed属性原理](https://www.cnblogs.com/kidney/p/7384835.html)

```js
var vm = new Vue({
  el: '#app',
  data: {
    firstname: 'jack',
    lastname: 'rose'
  },
  computed: {
    fullname() {
      return this.firstname + '.' + this.lastname
    }
  }
})
```