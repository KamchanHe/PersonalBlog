---
title: Vue EventBus
date: 2019-11-20
categories: article
author: Kamchan
tags:
- Vue
- Javascript
- EventBus
---

:::tip
main.js中加入EventBus
:::

```js
import Vue from 'vue';
import App from './App.vue';
//组件间相互通信
Vue.prototype.$bus = new Vue();
//往上报事件 告诉所有的父组件
Vue.prototype.$dispatch = function(eventName,value){
	let parent = this.$parent;
	while(parent){
		parent.$emit(eventName,value)
		parent=parent.$parent
	}
}
//向下报事件 告诉所有的子组件
Vue.prototype.$boardcast = function(eventName,value){
	const $boardcast = (children)=>{
		children.forEach(child=>{
			child.$emit(eventName,value)
			if (child.$children) {
				$boardcast(child.$children)
			}
		})
	}
	$boardcast(this.$children)
}
new Vue({
	el:'#app',
	render:h=>h(App)
})
```

:::tip
组件间互相通信 —— $bus
:::

```js
mounted() {
  this.$bus.$on("my", data => {
   console.log(data);
  });
 },
```

```js
mounted() {
  this.$nextTick(() => {
   this.$bus.$emit("my", "我是Grandson1");
  });
 },
```

:::warning
$dispatch 和 $broadcast 已经被弃用。请使用更多简明清晰的组件间通信和更好的状态管理方案，如：Vuex。

因为基于组件树结构的事件流方式实在是让人难以理解，并且在组件结构扩展的过程中会变得越来越脆弱。这种事件方式确实不太好，我们也不希望在以后让开发者们太痛苦。并且$dispatch 和 $broadcast 也没有解决兄弟组件间的通信问题。

对于$dispatch 和 $broadcast最简单的升级方式就是：通过使用事件中心，允许组件自由交流，无论组件处于组件树的哪一层。由于 Vue 实例实现了一个事件分发接口，你可以通过实例化一个空的 Vue 实例来实现这个目的。

这些方法的最常见用途之一是父子组件的相互通信。在这些情况下，你可以使用 v-on监听子组件上 $emit 的变化。这可以允许你很方便的添加事件显性。

然而，如果是跨多层父子组件通信的话，$emit 并没有什么用。相反，用集中式的事件中间件可以做到简单的升级。这会让组件之间的通信非常顺利，即使是兄弟组件。因为 Vue 通过事件发射器接口执行实例，实际上你可以使用一个空的 Vue 实例。
:::

:::tip
组件间互相通信 —— $dispatch
在子组件调用 dispatch 方法，向上级指定的组件实例（最近的）上触发自定义事件，并传递数据，且该上级组件已预先通过 $on 监听了这个事件；
:::

子组件 Son.vue
```html
<template>
  <div>
    <button @click="changeParent">通知父组件</button>
  </div>
</template>
<script>
export default {
  methods:{
    changeParent(){ 
      // $dispatch 只会通知自己的父亲 
      this.$dispatch('eventName','子组件来信了')
    }
  }
}
</script>
```

父组件
```html
<template>
  <div>
    <Son></Son>
  </div>
</template>
<script>
import Son from './Son';
export default {
  created() {
    this.$on('eventName',this.message)
  },
  methods:{
    message(value){
      console.log(value);//子组件来信了
    }
  },
  components:{
    Son
  }
}
</script>
```

:::tip
组件间互相通信 —— $boardcast
在父组件调用 broadcast 方法，向下级指定的组件实例（最近的）上触发自定义事件，并传递数据，且该下级组件已预先通过 $on 监听了这个事件。
:::

父组件
```html
<template>
  <div @click='sendMessage'>
    <Son></Son>
  </div>
</template>
<script>
import Son from './Son';
export default {
  methods:{
    sendMessage(value){
      this.$boardcast('send','父组件来消息啦')
    }
  },
  components:{
    Son
  }
}
</script>
```

子组件 Son.vue
```html
<template>
  <div>
    Son
  </div>
</template>
<script>
export default {
  created() {
    this.$on('send',this.message)
  },
  methods:{
    message(val) {
      console.log(val)//父组件来消息啦
    }
  }
}
</script>
```