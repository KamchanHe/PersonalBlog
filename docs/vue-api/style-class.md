---
title: vue-api 样式处理 -class和style
date: 2019-08-26
categories: article
author: Random
tags:
- Vue
- Webpack
---

- 使用方式：<font color="#e7254b">v-bind:class="expression"</font> or <font color="#e7254b">:class="expression"</font>
- 表达式的类型：字符串、数组、对象（重点）
- 语法：

```html
<!-- 1 -->
<div v-bind:class="{ active: true }"></div> ===> 解析后
<div class="active"></div>

<!-- 2 -->
<div :class="['active', 'text-danger']"></div> ===>解析后
<div class="active text-danger"></div>

<!-- 3 -->
<div v-bind:class="[{ active: true }, errorClass]"></div> ===>解析后
<div class="active text-danger"></div>


--- style ---
<!-- 1 -->
<div v-bind:style="{ color: activeColor, 'font-size': fontSize + 'px' }"></div>
<!-- 2 将多个 样式对象 应用到一个元素上-->
<!-- baseStyles 和 overridingStyles 都是data中定义的对象 -->
<div v-bind:style="[baseStyles, overridingStyles]"></div>
```

## v-if 和 v-show

- [条件渲染](https://cn.vuejs.org/v2/guide/conditional.html)
- <font color="#e7254e">v-if</font>：根据表达式的值的真假条件，销毁或重建元素
- <font color="#e7254e">v-show</font>：根据表达式之真假值，切换元素的 display CSS 属性

```html
<p v-show="isShow">这个元素展示出来了吗？？？</p>
<p v-if="isShow">这个元素，在HTML结构中吗？？？</p>
```

## 提升性能：v-pre

- 说明：vue会跳过这个元素和它的子元素的编译过程。可以用来显示原始 Mustache 标签。跳过大量没有指令的节点会加快编译。

```html
<span v-pre>{{ this will not be compiled }}</span>
```

## 提升性能：v-once

- 说明：vue只渲染元素和组件一次。随后的重新渲染，元素/组件及其所有的子节点将被视为静态内容并跳过。这可以用于优化更新性能。

```html
<span v-once>This will never change: {{msg}}</span>
```

















































































































































































