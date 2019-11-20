---
title: 实例生命周期
date: 2019-08-26
categories: article
author: Random
tags:
- Vue
- Webpack
---

- 所有的 Vue 组件都是 Vue 实例，并且接受相同的选项对象即可 (一些根实例特有的选项除外)。
- 实例生命周期也叫做：组件生命周期

## 组件生命周期介绍

- [vue生命周期钩子函数](https://cn.vuejs.org/v2/api/#%E9%80%89%E9%A1%B9-%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E9%92%A9%E5%AD%90)
- 简单说：一个组件从开始到最后消亡所经历的各种状态，就是一个组件的生命周期

生命周期钩子函数的定义：从组件被创建，到组件挂载到页面上运行，再到页面关闭组件被卸载，这三个阶段总是伴随着组件各种各样的事件，这些事件，统称为组件的生命周期函数！

- 注意：Vue在执行过程中会<font color="#c7254e">自动调用生命周期钩子函数</font>，我们只需要提供这些钩子函数即可
- 注意：钩子函数的名称都是Vue中规定好的！

### 钩子函数 - beforeCreate()

- 说明：在实例初始化之后，数据观测 (data observer) 和 event/watcher 事件配置之前被调用
- 注意：此时，无法获取 data中的数据、methods中的方法
:::tip
此时组件的选项还未挂载，因此无法访问methods,data,computed上的方法或数据
:::

### 钩子函数 - created()

- 注意：这是一个常用的生命周期，可以调用methods中的方法、改变data中的数据
- [vue实例生命周期 参考1](https://segmentfault.com/a/1190000008879966)
- [vue实例生命周期 参考2](https://segmentfault.com/a/1190000008010666)
- 使用场景：发送请求获取数据

:::tip
实例已经创建完成之后被调用。在这一步，实例已完成以下的配置：数据观测(data observer)，属性和方法的运算， watch/event 事件回调。然而，挂载阶段还没开始，$el 属性目前不可见。
:::

:::tip
通常我们可以在这里对实例进行预处理。
也有一些童鞋喜欢在这里发ajax请求，值得注意的是，这个周期中是没有什么方法来对实例化过程进行拦截的。
因此假如有某些数据必须获取才允许进入页面的话，并不适合在这个页面发请求。
建议在组件路由勾子beforeRouteEnter中来完成。
:::

### 钩子函数 - beforeMounted()

- 说明：在挂载开始之前被调用,相关的 render 函数首次被调用。

### 钩子函数 - mounted()

- 说明：此时，vue实例已经挂载到页面中，可以获取到el中的DOM元素，进行DOM操作

:::tip
1.在这个周期内，对data的改变可以生效。但是要进下一轮的dom更新，dom上的数据才会更新。
2.这个周期可以获取 dom。 之前的论断有误，感谢@冯银超 和 @AnHour的提醒
3.beforeRouteEnter的next的勾子比mounted触发还要靠后
4.指令的生效在mounted周期之前
:::

### 钩子函数 - beforeUpdated()

- 说明：数据更新时调用，发生在虚拟 DOM 重新渲染和打补丁之前。你可以在这个钩子中进一步地更改状态，这不会触发附加的重渲染过程。
- 注意：此处获取的数据是更新后的数据，但是获取页面中的DOM元素是更新之前的

### 钩子函数 - updated()

- 说明：组件 DOM 已经更新，所以你现在可以执行依赖于 DOM 的操作。
:::tip
在大多数情况下，你应该避免在此期间更改状态，因为这可能会导致更新无限循环。
:::

### 钩子函数 - beforeDestroy()

- 说明：实例销毁之前调用。在这一步，实例仍然完全可用。
- 使用场景：实例销毁之前，执行清理任务，比如：清除定时器等

### 钩子函数 - destroyed()

- 说明：Vue 实例销毁后调用。调用后，Vue 实例指示的所有东西都会解绑定，所有的事件监听器会被移除，所有的子实例也会被销毁。

### 组件生命周期总结

:::tip
<font color="#c7254e">beforecreated</font>：el 和 data 并未初始化
<br>
<font color="#c7254e">created</font>：完成了 data 数据的初始化，el没有
<br>
<font color="#c7254e">beforeMount</font>：完成了 el 和 data 初始化
<br>
<font color="#c7254e">mounted</font> ：完成挂载

另外在 <font color="#c7254e">beforeMount</font> 阶段，我们能发现el还是 { { xxx } }，
<br>
这里就是应用的 Virtual DOM（虚拟Dom）技术，先把坑占住了。
<br>
到后面<font color="#c7254e">mounted</font>挂载的时候再把值渲染进去。
:::

## 全局路由钩子

作用于所有路由切换，一般在main.js里面定义

### **router.beforeEach**

```js
示例
router.beforeEach((to, from, next) => {
  console.log('路由全局勾子：beforeEach -- 有next方法')
  next()
})
```

:::tip
一般在这个勾子的回调中，对路由进行拦截。
比如，未登录的用户，直接进入了需要登录才可见的页面，那么可以用next(false)来拦截，使其跳回原页面。
值得注意的是，如果没有调用next方法，那么页面将卡在那。
:::

:::tip
<font color="#0086b3">next</font>的四种用法
1. <font color="#0086b3">next</font>() 跳入下一个页面
2. <font color="#0086b3">next</font>(<font color='#c7254e'>'/path'</font>) 改变路由的跳转方向，使其跳到另一个路由
3. <font color="#0086b3">next</font>(false)  返回原来的页面
4. <font color="#0086b3">next</font>((vm)=>{})  仅在beforeRouteEnter中可用，vm是组件实例。
:::

### **router.afterEach**

```js
//示例
router.afterEach((to, from) => {
  console.log('路由全局勾子：afterEach --- 没有next方法')
})
```
:::tip
在所有路由跳转结束的时候调用，和beforeEach是类似的，但是它没有next方法
:::

## 组件路由勾子

和全局勾子不同的是，它仅仅作用于某个组件，一般在.vue文件中去定义。

### **beforeRouteEnter**

```js
//示例
  beforeRouteEnter (to, from, next) {
    console.log(this)  //undefined，不能用this来获取vue实例
    console.log('组件路由勾子：beforeRouteEnter')
    next(vm => {
      console.log(vm)  //vm为vue的实例
      console.log('组件路由勾子beforeRouteEnter的next')
    })
  }
```

:::tip
这个是一个很不同的勾子。因为beforeRouterEnter在组件创建之前调用，所以它无法直接用this来访问组件实例。

为了弥补这一点，vue-router开发人员，给他的next方法加了特技，可以传一个回调，回调的第一个参数即是组件实例。

一般我们可以利用这点，对实例上的数据进行修改，调用实例上的方法。

我们可以在这个方法去请求数据，在数据获取到之后，再调用next就能保证你进页面的时候，数据已经获取到了。

没错，这里next有阻塞的效果。你没调用的话，就会一直卡在那
:::

:::warning
next(vm=>{console.log('next')  })
这个里面的代码是很晚执行的，在组件mounted周期之后。没错，这是一个坑。你要注意。

beforeRouteEnter的代码时很早执行的，在组件beforeCreate之前；

但是next里面回调的执行，很晚，在mounted之后，可以说是目前我找到的，离dom渲染最近的一个周期。
:::

### beforeRouteLeave

```js
beforeRouteLeave (to, from, next) {
    console.log(this)    //可以访问vue实例
    console.log('组件路由勾子：beforeRouteLeave')
    next()
  },
```
在离开路由时调用。可以用this来访问组件实例。但是next中不能传回调。

### beforeRouteUpdate

:::tip
这个方法是vue-router2.2版本加上的。因为原来的版本中，如果一个在两个子路由之间跳转，是不触发beforeRouteLeave的。这会导致某些重置操作，没地方触发。在之前，我们都是用watch $route来hack的。但是通过这个勾子，我们有了更好的方式。
:::

老实讲，我没用过这个勾子，所以各位可以查看一下文章之前的文档，去尝试一下，再和我交流交流。

## 指令周期

- 绑定自定义指令的时候也会有对应的周期。
- 这几个周期，我比较常用的，一般是只有bind。

### bind

只调用一次，指令第一次绑定到元素时调用，用这个钩子函数可以定义一个在绑定时执行一次的初始化动作。

### inserted

- 被绑定元素插入父节点时调用（父节点存在即可调用，不必存在于 document 中）。
- 实际上是插入vnode的时候调用。

### update

- 被绑定元素所在的模板更新时调用，而不论绑定值是否变化。
- 通过比较更新前后的绑定值，可以忽略不必要的模板更新。

:::danger
慎用，如果在指令里绑定事件，并且用这个周期的，记得把事件注销
:::

### componentUpdated

被绑定元素所在模板完成一次更新周期时调用。

### unbind

只调用一次， 指令与元素解绑时调用。

## Vue.nextTick、vm.$nextTick

```js
//示例：
  created () {
    this.$nextTick(() => {
      console.log('nextTick')  //回调里的函数一直到真实的dom渲染结束后，才执行
    })
    console.log('组件：created')
  },
```

>**nextTick方法的回调会在dom更新后再执行，因此可以和一些dom操作搭配一起用，如 ref。
非常好用，可以解决很多疑难杂症。**

:::tip
场景：
你用ref获得一个输入框，用v-model绑定。
在某个方法里改变绑定的值，在这个方法里用ref去获取dom并取值，你会发现dom的值并没有改变。
因为此时vue的方法，还没去触发dom的改变。
因此你可以把获取dom值的操作放在vm.$nextTick的回调里，就可以了。
:::


































