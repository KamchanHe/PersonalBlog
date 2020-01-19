---
title: Vue组件间通信方式
date: 2019-08-22
categories: article
author: 珠峰培训
tags:
  - Vue
  - Webpack
---

# Vue 组件间通信方式

## Vue 快速原型开发

可以快速识别.vue 文件封装组件插件等功能

```sh
sudo npm install @vue/cli -g
sudo npm install -g @vue/cli-service-global
vue serve App.vue
```

## 一.Props 传递数据

```
components
   ├── Grandson1.vue // 孙子1
   ├── Grandson2.vue // 孙子2
   ├── Parent.vue   // 父亲
   ├── Son1.vue     // 儿子1
   └── Son2.vue     // 儿子2
```

在父组件中使用儿子组件

```html
<template>
  <div>
    父组件:{{mny}}
    <Son1 :mny="mny"></Son1>
  </div>
</template>
<script>
  import Son1 from './Son1'
  export default {
    components: {
      Son1
    },
    data() {
      return { mny: 100 }
    }
  }
</script>
```

子组件接受父组件的属性

子组件 1:

## 二.\$emit 使用

子组件触发父组件方法,通过回调的方式将修改的内容传递给父组件

```html
<template>
  <div>
    父组件:{{mny}}
    <Son1 :mny="mny" @input="change"></Son1>
  </div>
</template>
<script>
  import Son1 from './Son1'
  export default {
    methods: {
      change(mny) {
        this.mny = mny
      }
    },
    components: {
      Son1
    },
    data() {
      return { mny: 100 }
    }
  }
</script>
```

子组件触发绑定自己身上的方法

```html
<template>
  <div>
    子组件1: {{mny}}
    <button @click="$emit('input',200)">更改</button>
  </div>
</template>
<script>
  export default {
    props: {
      mny: {
        type: Number
      }
    }
  }
</script>
```

> **这里的主要目的就是同步父子组件的数据,->语法糖的写法**

### .sync

```html
<Son1 :mny.sync="mny"></Son1>
<!-- 触发的事件名 update:(绑定.sync属性的名字) -->
<button @click="$emit('update:mny',200)">更改</button>
```

### v-model

```html
<Son1 v-model="mny"></Son1>
<template>
  <div>
    子组件1: {{value}} // 触发的事件只能是input
    <button @click="$emit('input',200)">更改</button>
  </div>
</template>
<script>
  export default {
    props: {
      value: {
        // 接收到的属性名只能叫value
        type: Number
      }
    }
  }
</script>
```

## 三.$parent、$children

继续将属性传递

```html
<Grandson1 :value="value"></Grandson1>
<template>
  <div>
    孙子:{{value}}
    <!-- 调用父组件的input事件 -->
    <button @click="$parent.$emit('input',200)">更改</button>
  </div>
</template>
<script>
  export default {
    props: {
      value: {
        type: Number
      }
    }
  }
</script>
```

> **如果层级很深那么就会出现$parent.$parent.....我们可以封装一个\$dispatch 方法向上进行派发**

### \$dispatch

```js
Vue.prototype.$dispatch = function $dispatch(eventName, data) {
  let parent = this.$parent
  while (parent) {
    parent.$emit(eventName, data)
    parent = parent.$parent
  }
}
```

既然能向上派发那同样可以向下进行派发

### \$broadcast

```js
Vue.prototype.$broadcast = function $broadcast(eventName, data) {
  const broadcast = function() {
    this.$children.forEach(child => {
      child.$emit(eventName, data)
      if (child.$children) {
        $broadcast.call(child, eventName, data)
      }
    })
  }
  broadcast.call(this, eventName, data)
}
```

## 四.$attrs、$listeners

### \$attrs

批量向下传入属性

```html
<Son2 name="小珠峰" age="10"></Son2>

<!-- 可以在son2组件中使用$attrs属性,可以将属性继续向下传递 -->
<div>
  儿子2: {{$attrs.name}}
  <Grandson2 v-bind="$attrs"></Grandson2>
</div>

<template>
  <div>孙子:{{$attrs}}</div>
</template>
```

### \$listeners

批量向下传入属性

```html
<Son2 name="小珠峰" age="10" @click="()=>{this.mny = 500}"></Son2>
<!-- 可以在son2组件中使用listeners属性,可以将方法继续向下传递 -->
<Grandson2 v-bind="$attrs" v-on="$listeners"></Grandson2>

<button @click="$listeners.click()">更改</button>
```

## 五.Provide & Inject

### Provide

在父级中注入数据

```js()
provide() {
  return { parentMsg: "父亲" };
},
```

### Inject

在任意子组件中可以注入父级数据

```js()
inject: ['parentMsg'] // 会将数据挂载在当前实例上
```

## 六.Ref 使用

获取组件实例

```html
<Grandson2 v-bind="$attrs" v-on="$listeners" ref="grand2"></Grandson2> mounted()
{ // 获取组件定义的属性 console.log(this.$refs.grand2.name); }
```

## 七.EventBus

用于跨组件通知(不复杂的项目可以使用这种方式)

```js
Vue.prototype.$bus = new Vue()
```

Son2 组件和 Grandson1 相互通信

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

## 八.Vuex 通信

状态管理

![vuex](https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/vuex.png)

## 九.findComponents

### 它适用于以下场景：

- 由一个组件，向上找到最近的指定组件；
- 由一个组件，向上找到所有的指定组件；
- 由一个组件，向下找到最近的指定组件；
- 由一个组件，向下找到所有指定的组件；
- 由一个组件，找到指定组件的兄弟组件。

5 个不同的场景，对应 5 个不同的函数，实现原理也大同小异。

### 向上找到最近的指定组件——findComponentUpward

```js
// 由一个组件，向上找到最近的指定组件
function findComponentUpward(context, componentName) {
  let parent = context.$parent
  let name = parent.$options.name

  while (parent && (!name || [componentName].indexOf(name) < 0)) {
    parent = parent.$parent
    if (parent) name = parent.$options.name
  }
  return parent
}
export { findComponentUpward }
```

#### 比如下面的示例，有组件 A 和组件 B，A 是 B 的父组件，在 B 中获取和调用 A 中的数据和方法：

```html
<!-- component-a.vue -->
<template>
  <div>
    组件 A
    <component-b></component-b>
  </div>
</template>
<script>
  import componentB from './component-b.vue'

  export default {
    name: 'componentA',
    components: { componentB },
    data() {
      return {
        name: 'Aresn'
      }
    },
    methods: {
      sayHello() {
        console.log('Hello, Vue.js')
      }
    }
  }
</script>
```

```html
<!-- component-b.vue -->
<template>
  <div>
    组件 B
  </div>
</template>
<script>
  import { findComponentUpward } from '../utils/assist.js'

  export default {
    name: 'componentB',
    mounted() {
      const comA = findComponentUpward(this, 'componentA')

      if (comA) {
        console.log(comA.name) // Aresn
        comA.sayHello() // Hello, Vue.js
      }
    }
  }
</script>
```

### 向上找到所有的指定组件——findComponentsUpward

```js
// 由一个组件，向上找到所有的指定组件
function findComponentsUpward(context, componentName) {
  let parents = []
  const parent = context.$parent

  if (parent) {
    if (parent.$options.name === componentName) parents.push(parent)
    return parents.concat(findComponentsUpward(parent, componentName))
  } else {
    return []
  }
}
export { findComponentsUpward }
```

### 向下找到最近的指定组件——findComponentDownward

```js
// 由一个组件，向下找到最近的指定组件
function findComponentDownward(context, componentName) {
  const childrens = context.$children
  let children = null

  if (childrens.length) {
    for (const child of childrens) {
      const name = child.$options.name

      if (name === componentName) {
        children = child
        break
      } else {
        children = findComponentDownward(child, componentName)
        if (children) break
      }
    }
  }
  return children
}
export { findComponentDownward }
```

### 向下找到所有指定的组件——findComponentsDownward

```js
// 由一个组件，向下找到所有指定的组件
function findComponentsDownward(context, componentName) {
  return context.$children.reduce((components, child) => {
    if (child.$options.name === componentName) components.push(child)
    const foundChilds = findComponentsDownward(child, componentName)
    return components.concat(foundChilds)
  }, [])
}
export { findComponentsDownward }
```

### 找到指定组件的兄弟组件——findBrothersComponents

```js
// 由一个组件，找到指定组件的兄弟组件
function findBrothersComponents(context, componentName, exceptMe = true) {
  let res = context.$parent.$children.filter(item => {
    return item.$options.name === componentName
  })
  let index = res.findIndex(item => item._uid === context._uid)
  if (exceptMe) res.splice(index, 1)
  return res
}
export { findBrothersComponents }
```

:::tip
相比其它 4 个函数，findBrothersComponents 多了一个参数 exceptMe，是否把本身除外，默认是 true。寻找兄弟组件的方法，是先获取 context.$parent.$children，也就是父组件的全部子组件，这里面当前包含了本身，所有也会有第三个参数 exceptMe。Vue.js 在渲染组件时，都会给每个组件加一个内置的属性 \_uid，这个 \_uid 是不会重复的，借此我们可以从一系列兄弟组件中把自己排除掉。
:::
