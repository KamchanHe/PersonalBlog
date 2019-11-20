---
title: 自定义指令
date: 2019-08-26
categories: article
author: Random
tags:
- Vue
- Webpack
---

:::tip
自定义指令是用来操作DOM的。尽管Vue推崇数据驱动视图的理念，但并非所有情况都适合数据驱动。自定义指令就是一种有效的补充和扩展，不仅可用于定义任何的DOM操作，并且是可复用的。
:::

- 作用：进行DOM操作
- 使用场景：对纯 DOM 元素进行底层操作，比如：文本框获得焦点
- [vue 自定义指令用法实例](https://juejin.im/entry/58b7c5d8ac502e006cfee34a)
- 两种指令：1 全局指令 2 局部指令

## 全局自定义指令

```js
// 第一个参数：指令名称
// 第二个参数：配置对象，指定指令的钩子函数
Vue.directive('directiveName', {
  // bind中只能对元素自身进行DOM操作，而无法对父级元素操作
  // 只调用一次 指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。
  bind( el，binding, vnode ) {
    // 参数详解
    // el：指令所绑定的元素，可以用来直接操作 DOM 。
    // binding：一个对象，包含以下属性：
      // name：指令名，不包括 v- 前缀。
      // value：指令的绑定值，等号后面的值 。
      // oldValue：指令绑定的前一个值，仅在 update 和 componentUpdated 钩子中可用。无论值是否改变都可用。
      // expression：字符串形式的指令表达式 等号后面的字符串 形式
      // arg：传给指令的参数，可选。例如 v-my-directive:foo 中，参数为 "foo"。
      // modifiers：指令修饰符。例如：v-directive.foo.bar中，修饰符对象为 { foo: true, bar: true }。
    // vnode：Vue 编译生成的虚拟节点。。
    // oldVnode：上一个虚拟节点，仅在 update 和 componentUpdated 钩子中可用。
  },
  // inserted这个钩子函数调用的时候，当前元素已经插入页面中了，也就是说可以获取到父级节点了
  inserted (  el，binding, vnode ) {},
  //  DOM重新渲染前
  update(el，binding, vnode,oldVnode) {},
  // DOM重新渲染后
  componentUpdated ( el，binding, vnode,oldVnode ) {},
  // 只调用一次，指令与元素解绑时调用
  unbind ( el ) {
    // 指令所在的元素在页面中消失，触发
  }
})
// 简写 如果你想在 bind 和 update 时触发相同行为，而不关心其它的钩子:
Vue.directive('自定义指令名', function( el, binding ) {})
// 例：
Vue.directive('color', function(el, binding) {
  el.style.color = binging.value
})
// 使用 注意直接些会被i成data中的数据“red” 需要字符串则嵌套引号"'red'"
<p v-color="'red'"></p>
```

## 局部自定义指令

```js
var vm = new Vue({
  el : "#app",
  directives: {
    directiveName: { }
  }
})
```

## 自定义指令的用法与实例

### 谷歌图片的加载

谷歌图片的加载做得非常优雅，在图片未完成加载前，用随机的背景色占位，图片加载完成后才直接渲染出来。用自定义指令可以非常方便的实现这个功能。

```js
Vue.directive('img', {
  inserted: function (el, binding) {
    var color = Math.floor(Math.random()*1000000);
    el.style.backgroundColor = '#' + color;//设置随机的背景色

    var img = new Image();
    img.src = binding.value();//获得传给指令的值
    img.onload = function () {
      el.style.backgroundImage = 'url(' + binding.value + ')';
    }
  }
})
```

```html
<div v-img='val.url' v-for='val in list'></div>

list: [
  {
    url: 'http://img2.niutuku.com/desk/1207/1011/ntk123346.jpg'
  },
  {
    url: 'http://img.bizhi.sogou.com/images/2013/10/06/392564.jpg'
  },
  {
    url: 'http://pic.pp3.cm/uploads//201505/2015060502.jpg'
  }
]
```

效果：

![googleLazyload](https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/googleLazyload.gif)

:::tip
自定义指令的第二用处是用于集成第三方插件。
<br>
我们知道任何软件开发领域都可以分为四层：底层是原生的API，上层是通用框架，再上层是通用组件，最上层才是具体的业务代码。
<br>
一个通用框架，必须搭配一套完整的通用组件，才能真正奠定其江湖地位。
:::

:::tip
在前端开发领域，以前的通用框架是jQuery，jQuery以及基于jQuery构建的通用组件形成了一个庞大的生产系统。
<br>
现在的通用框架是Angular、React和Vue，每个框架都需要基于自身构建新的组件库。
<br>
自定义指令好就好在：原先的那些通用组件，无论是纯js的也好，基于jQuery的也好，都可以拿来主义直接吸收，而不需要改造或重构。
:::

### 封装highlight.js

比如写文档通常会用到highlight.js，我们可以直接将其封装为一个自定义指令，这样highlight.js就变成了Vue的一个新功能。

```js
var hljs = require('highlight.js');
Vue.directive('highlight', function(el) {
  hljs.highlightBlock(el)
})
```

```html
<pre>
  <code>
    &lt;alert-menu
    :menudata="menu"
    :e="eventObj"
    ref="menu"
    v-on:menuEvent="handle"&gt;
    &lt;/alert-menu&gt;
  </code>
</pre>
```

效果：
![highlight](https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/highlight.png)

:::tip
但凡遇到第三方插件如何与Vue.js集成的问题，都可以尝试用自定义指令实现。
:::








































