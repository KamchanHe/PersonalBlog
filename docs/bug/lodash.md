---
title: Vue3.0上遇到的Lodash使用问题
date: 2020-01-08
categories: article
author: Kamchan
tags:
- Javascript
- Npm
- Lodash
- Utils
- Bug
---

## 记一次在Vue中使用debounce遇到的坑

### 我使用的是lodash自带的debounce函数，官方文档这样描述的

```js
_.debounce(func, [wait=0], [options={}])
```
两个必选参数中，第一个是防抖动的函数，第二个是防抖动的时间毫秒数。很像“setTimeout”函数的写法。

### 开始使用(错误示例)
```js
// 错误示例
methods: {
  search () {
    this._.debounce(() => {
      console.log('此处向后台发起请求:' + this.searchText)
    }, 1000)
  }
}
```
控制台既没有报错，也没有打印出任何东西，后来经同事提醒，发现debounce函数的返回值是一个function，跟setTimeout使用是不一样的

```js
Returns
(Function): Returns the new debounced function.
```

### 改进使用(错误示例)

于是，我将代码改为，在debounce后面加了个（），让这个返回的函数立即执行

```js
// 错误示例
methods: {
  search () {
    this._.debounce(() => {
      console.log('此处向后台发起请求:' + this.searchText)
    }, 1000)()
  }
},
```

这次，控制台终于打出了我想要的结果，但是。。。但是，并没有起到防抖动的作用，我在一秒钟按几次键盘，就打印出多少条数据，只是会有1秒的延迟，更想象中的效果不一样。

### 成功使用(正确示例)

后台看了Vue的官方实例，修改代码为，得到了我想要的效果，即以一秒钟为单位，控制台输入input里的值，多余的被判定为“抖动”的输入，不会在控制台打印。

```js
// 正确示例

//  加载到vue原型链上的lodash在method函数后的定义的地方取不到，重新引了一遍
import _ from 'lodash'
export default {
    methods: {  
      // 加载到原型链上的lodash，在getRemote后取不到
       // 注意，这里debounce中的第一个参数，不能写成箭头函数，否则，取不到this
      getRemote: _.debounce(function () {
        console.log('此处向后台发起请求:', this.searchText)
      }, 1000),
      search () {
        this.getRemote()
      }
    }
}
```

得到想要的结果，但是还是留了三个疑问：
1.为什么在main.js中引入Vue原型链上的lodash在getRemote后不能用？
2.为什么getRemote的debounce第一个参数写成箭头函数就取不到this？
3.最后一个正确示例和倒数第一个错误示例的写法，原理上的区别是什么？

1.应该是可以的，可能是写法问题？
2.这个和vue特性有关，vue会帮你自动绑定this, 而使用了箭头函数，this无法更改，所以返回undefined
3.这个需要理解闭包 作用域链等等。。粗略可以理解为，使用函数调用的方式，每次调用结束函数会出栈，而debounce中用于判断的变量也因为失去引用而被释放。在此调用时候，debounce无法判断，所以相当于第一次调用的效果
