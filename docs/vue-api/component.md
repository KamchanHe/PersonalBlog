---
title: vue-api 组件定义
date: 2019-08-26
categories: article
author: Random
tags:
- Vue
- Webpack
---

:::tip
组件系统是 Vue 的另一个重要概念，因为它是一种抽象，允许我们使用小型、独立和通常可复用的组件构建大型应用。仔细想想，几乎任意类型的应用界面都可以抽象为一个组件树
:::

- 创建组件的两种方式：1 全局组件 2 局部组件

## 全局组件

- 说明：全局组件在所有的vue实例中都可以使用
- 注意：**先注册组件，再初始化根实例**

```js
// 1 注册全局组件
Vue.component('my-component', {
  // template 只能有一个根元素
  template: '<p>A custom component!</p>',
  // 组件中的 `data` 必须是函数 并且函数的返回值必须是对象
  data() {
    return {
      msg: '注意：组件的data必须是一个函数！！！'
    }
  }
})

// 2 使用：以自定义元素的方式
<div id="example">
  <my-component></my-component>
</div>

// =====> 渲染结果
<div id="example">
  <p>A custom component!</p>
</div>


// 3 template属性的值可以是：
  - 1 模板字符串
  - 2 模板id  template: '#tpl'
<script type="text/x-template" id="tpl">
  <p>A custom component!</p>
</script>
```
- <font color="#c7254e">extend</font>：使用基础 Vue 构造器，创建一个“子类”。参数是一个包含组件选项的对象。

```js
// 注册组件，传入一个扩展过的构造器
Vue.component('my-component', Vue.extend({ /* ... */ }))

// 注册组件，传入一个选项对象 (自动调用 Vue.extend)
Vue.component('my-component', { /* ... */ })

var Home = Vue.extend({
  template: '',
  data() {}
})
Vue.component('home', Home)
```

## 局部组件

- 说明：局部组件，是在某一个具体的vue实例中定义的，只能在这个vue实例中使用

```js
var Child = {
  template: '<div>A custom component!</div>'
}

new Vue({
  // 注意：此处为 components
  components: {
    // <my-component> 将只在当前vue实例中使用
    // my-component 为组件名 值为配置对象
    'my-component': {
      template: ``,
      data () { return { } },
      props : []
    }
  }
})
```

## is特性

:::tip
在某些特定的标签中只能存在指定表恰 如ul > li 如果要浏览器正常解析则需要使用is
:::

```html
<!-- 案例 -->
<ul id="app">
  <!-- 不能识别 -->
  <my-li></my-li>
  正常识别
  <li is="my-li"></li>
</ul>

<script>
  var vm = new Vue({
    el: "#app",
    components : {
      myLi : {
        template : `<li>内容</li>`
      }
    }
  })
</script>
```



























































