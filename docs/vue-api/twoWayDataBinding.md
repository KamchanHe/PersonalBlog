---
title: 双向数据绑定 Vue two way data binding
date: 2019-08-27
categories: article
author: Random
tags:
- Vue
- Webpack
---

- 双向数据绑定：将DOM与Vue实例的data数据绑定到一起，彼此之间相互影响
  - 数据的改变会引起DOM的改变
  - DOM的改变也会引起数据的变化

- 原理：<font color="#c7254e">Object.defineProperty</font>中的<font color="#c7254e">get</font>和<font color="#c7254e">set</font>方法
  - <font color="#c7254e">getter</font>和<font color="#c7254e">setter</font>：访问器
  - 作用：指定<font color="#c7254e">读取或设置</font>对象属性值的时候，执行的操作

- [Vue - 深入响应式原理](https://cn.vuejs.org/v2/guide/reactivity.html)

- [MDN - Object.defineProperty()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)

```js
/*  defineProperty语法 介绍 */
var obj = {}
Object.defineProperty(obj, 'msg', {
  // 设置 obj.msg = "1" 时set方法会被系统调用 参数分别是设置后和设置前的值
  set: function (newVal, oldVal) {  },
  // 读取 obj.msg 时get方法会被系统调用
  get: function ( newVal, oldVal ) {}
})
```

## Vue双向绑定的极简实现

```js
<!-- 示例 -->
<input type="text" id="txt" />
<span id="sp"></span>

<script>
var txt = document.getElementById('txt'),
    sp = document.getElementById('sp'),
    obj = {}

// 给对象obj添加msg属性，并设置setter访问器
Object.defineProperty(obj, 'msg', {
  // 设置 obj.msg  当obj.msg反生改变时set方法将会被调用
  set: function (newVal) {
    // 当obj.msg被赋值时 同时设置给 input/span
    txt.value = newVal
    sp.innerText = newVal
  }
})

// 监听文本框的改变 当文本框输入内容时 改变obj.msg
txt.addEventListener('keyup', function (event) {
  obj.msg = event.target.value
})
</script>
```

## 动态添加数据的注意点

- 注意：只有data中的数据才是响应式的，动态添加进来的数据默认为非响应式
- 可以通过以下方式实现动态添加数据的响应式
  - 1 Vue.set(object, key, value) - 适用于添加单个属性
  - 2 Object.assign() - 适用于添加多个属性

```js
var vm = new Vue({
  data: {
    stu: {
      name: 'jack',
      age: 19
    }
  }
})

/* Vue.set */
Vue.set(vm.stu, 'gender', 'male')

/* Object.assign 将参数中的所有对象属性和值 合并到第一个参数 并返回合并后的对象*/
vm.stu = Object.assign({}, vm.stu, { gender: 'female', height: 180 })
```

## 异步DOM更新

- 说明：Vue 异步执行 DOM 更新，监视所有数据改变，一次性更新DOM
- 优势：可以去除重复数据，对于避免不必要的计算和 避免重复 DOM 操作上，非常重要
- 如果需要那到更新后dom中的数据 则需要通过 <font color="#c7254e">Vue.nextTick(callback)</font>：在DOM更新后，执行某个操作（属于DOM操作）
  - 实例调用<font color="#c7254e">vm.$nextTick(function () {})</font>

```js
methods: {
  fn() {
    this.msg = 'change'
    this.$nextTick(function () {
      console.log('$nextTick中打印：', this.$el.children[0].innerText);
    })
    console.log('直接打印：', this.$el.children[0].innerText);
  }
}
```

