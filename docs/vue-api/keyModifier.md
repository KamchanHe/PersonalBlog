---
title: 按键修饰符
date: 2019-08-26
categories: article
author: Random
tags:
- Vue
- Webpack
---

在监听键盘事件时，我们经常需要检查详细的按键。Vue 允许为 <font color="#c7254e">v-on</font> 在监听键盘事件时添加按键修饰符：

```html
<!-- 只有在 `key` 是 `Enter` 时调用 `vm.submit()` -->
<input v-on:keyup.enter="submit">
```

你可以直接将 <font color="#c7254e">KeyboardEvent.key</font> 暴露的任意有效按键名转换为 kebab-case 来作为修饰符。

```html
<input v-on:keyup.page-down="onPageDown">
```

在上述示例中，处理函数只会在 <font color="#c7254e">$event.key</font> 等于 <font color="#c7254e">PageDown</font> 时被调用。

## 按键码

::: danger
<font color="red">keyCode</font> 的事件用法已经被废弃了并可能不会被最新的浏览器支持。
:::

使用 <font color="red">keyCode</font>  特性也是允许的：

```html
<input v-on:keyup.13="submit">
```

:::tip
为了在必要的情况下支持旧浏览器，Vue 提供了绝大多数常用的按键码的别名：
:::
- <font color="#c7254e">.enter</font>
- <font color="#c7254e">.tab</font>
- <font color="#c7254e">.delete</font> (捕获“删除”和“退格”键)
- <font color="#c7254e">.esc</font>
- <font color="#c7254e">.space</font>
- <font color="#c7254e">.up</font>
- <font color="#c7254e">.down</font>
- <font color="#c7254e">.left</font>
- <font color="#c7254e">.right</font>

::: danger
有一些按键 (<font color="#e6254e">.esc</font> 以及所有的方向键) 在 IE9 中有不同的 <font color="#e6254e">key</font> 值, 如果你想支持 IE9，这些内置的别名应该是首选。
:::

你还可以通过全局 <font color="#c7254e">config.keyCodes</font> 对象自定义按键修饰符别名：

```js
// 可以使用 `v-on:keyup.f1`
Vue.config.keyCodes.f1 = 112
```

## 系统修饰键

可以用如下修饰符来实现仅在按下相应按键时才触发鼠标或键盘事件的监听器。

- <font color="#c7254e">.ctrl</font>
- <font color="#c7254e">.alt</font>
- <font color="#c7254e">.shift</font>
- <font color="#c7254e">.meta</font>

:::tip
注意：在 Mac 系统键盘上，meta 对应 command 键 (⌘)。在 Windows 系统键盘 meta 对应 Windows 徽标键 (⊞)。
:::

例如：

```html
<!-- Alt + C -->
<input @keyup.alt.67="clear">

<!-- Ctrl + Click -->
<div @click.ctrl="doSomething">Do something</div>
```

:::danger
请注意修饰键与常规按键不同，在和 <font color="#c7254e">keyup</font> 事件一起用时，事件触发时修饰键必须处于按下状态。换句话说，只有在按住 <font color="#c7254e">ctrl</font> 的情况下释放其它按键，才能触发 <font color="#c7254e">keyup.ctrl</font>。而单单释放 <font color="#c7254e">ctrl</font> 也不会触发事件。如果你想要这样的行为，请为 <font color="#c7254e">ctrl</font> 换用 <font color="#c7254e">keyCode：keyup.17</font>。
:::

### .exact 修饰符

<font color="#c7254e">.exact</font>  修饰符允许你控制由精确的系统修饰符组合触发的事件。

```html
<!-- 即使 Alt 或 Shift 被一同按下时也会触发 -->
<button @click.ctrl="onClick">A</button>

<!-- 有且只有 Ctrl 被按下的时候才触发 -->
<button @click.ctrl.exact="onCtrlClick">A</button>

<!-- 没有任何系统修饰符被按下的时候才触发 -->
<button @click.exact="onClick">A</button>
```

### 鼠标按钮修饰符

- <font color="#c7254e">.left</font>
- <font color="#c7254e">.right</font>
- <font color="#c7254e">.middle</font>

:::tip
这些修饰符会限制处理函数仅响应特定的鼠标按钮。
:::




































