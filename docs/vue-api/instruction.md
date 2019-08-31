---
title: 指令
date: 2019-08-26
categories: article
author: Random
tags:
- vue
- webpack
---

- 解释：指令 (Directives) 是带有 v- 前缀的特殊属性
- 作用：当表达式的值改变时，将其产生的连带影响，响应式地作用于 DOM

## v-text

- 解释：更新DOM对象的 textContent

```html
<h1 v-text="msg"></h1>
```

## v-html

- 解释：更新DOM对象的 innerHTML

```html
<h1 v-html="msg"></h1>
```

## v-bind

- 作用：当表达式的值改变时，将其产生的连带影响，响应式地作用于 DOM
- 语法：<font color="#c7254e">v-bind:title="msg"</font>
- 简写：<font color="#c7254e">:title="msg"</font>

```html
<!-- 完整语法 -->
<a v-bind:href="url"></a>
<!-- 缩写 -->
<a :href="url"></a>
```

## v-on

- 作用：绑定事件
- 语法：<font color="#c7254e">v-on:click="say"</font> or <font color="#c7254e">v-on:click="say('参数', $event)"</font>
- 简写：<font color="#c7254e">@click="say"</font>
- 说明：绑定的事件定义在<font color="#c7254e">methods</font>

```html
<!-- 完整语法 -->
<a v-on:click="doSomething"></a>
<!-- 缩写 -->
<a @click="doSomething"></a>
```

## 事件修饰符

- <font color="#c7254e">.stop</font> 阻止冒泡，调用 event.stopPropagation()
- <font color="#c7254e">.prevent</font> 阻止默认行为，调用 event.preventDefault()
- <font color="#c7254e">.capture</font> 添加事件侦听器时使用事件<font color="#c7254e">捕获</font>模式
- <font color="#c7254e">.self</font> 只当事件在该元素本身（比如不是子元素）触发时，才会触发事件
- <font color="#c7254e">.once</font> 事件只触发一次

## v-model

- 作用：在表单元素上创建双向数据绑定
- 说明：监听用户的输入事件以更新数据
- 案例：计算器

```html
<input type="text" v-model="message" placeholder="edit me">
<p>Message is: {{ message }}</p>
```

## v-for

- 作用：基于源数据多次渲染元素或模板块

```html
<!-- 1 基础用法 -->
<div v-for="item in items">
  {{ item.text }}
</div>

<!-- item 为当前项，index 为索引 -->
<p v-for="(item, index) in list">{{item}} -- {{index}}</p>
<!-- item 为值，key 为键，index 为索引 -->
<p v-for="(item, key, index) in obj">{{item}} -- {{key}}</p>
<p v-for="item in 10">{{item}}</p>
```

## key属性
- 推荐：使用 <font color="#e7425e">v-for</font> 的时候提供 <font color="#e7425e">key</font> 属性，以获得性能提升。
- 说明：使用 key，VUE会基于 key 的变化重新排列元素顺序，并且会移除 key 不存在的元素。
- [vue-key](https://cn.vuejs.org/v2/guide/list.html#%E7%BB%B4%E6%8A%A4%E7%8A%B6%E6%80%81)
- [vue key属性的说明](https://www.zhihu.com/question/61064119/answer/183717717)

```html
<div v-for="item in items" :key="item.id">
  <!-- 内容 -->
</div>
```
