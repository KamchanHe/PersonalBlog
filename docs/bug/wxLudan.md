---
title: 微信小程序 鲁蛋小程序开发遇到的BUG
date: 2019-10-10
categories: article
author: Kamchan
tags:
- Mac
- MacOS Catalina
- Javascript
---

## 背景
由于小程序原生的导航栏很难满足现有的需求，
<br>
所以很多开发者会考虑通过<font color="#c7254e">"navigationStyle": "custom"</font>自定义一个符合要求的导航栏，
<br>
而这个自定义导航栏的操作往往是发生在全局配置的<font color="#c7254e">app.json</font>中。
<br>
也就是说每个页面都需要使用自定义的导航栏以便统一风格。
<br>
同时，项目中总有页面需要下拉刷新或上拉加载更多的需求，
<br>
小程序在自定义导航栏之后，如需使用原有的<font color="#c7254e">enablePullDownRefresh</font>就会遇到如下两个问题：
<br>

### 问题1:自定义导航栏后原有的下拉刷新动画位置显示不正确

自定义了导航栏，自己模拟出来一个头部，使用的fixed定在上面
<br>
会占据一定的高度，如果我使用了下拉刷新，加载动画会被头部遮挡住

那么我最先的想法是在自定义的导航栏底层自定义一个可以滑动的下拉刷新动画，
<br>
同时利用微信提供的<font color="#c7254e">backgroundTextStyle</font>隐藏系统自带的下拉刷新样式。
<br>
这样即可以触发微信原有的下拉刷新方法，又能自定义动画。
<br>
但是，出现了第二个问题。

### 问题2：自定义导航栏后，开启系统下拉刷新会导致安卓端<font color="#c7254e">fixed</font>的元素一起向下滑动。
也就是整个导航栏会跟着一起滑动下去（iOS端没有问题）。所以目前看来，如果你自定义导航栏，那么系统原生的下拉刷新是没办法使用的。

## 正文

因为这两个硬性bug，导致目前的小程序开发者要么使用<font color="#c7254e">微信原生的导航栏+刷新</font>
，
<br>
要么是把列表<font color="#c7254e">通过微信组件scroll-view包装一层，然后使用bindscrolltoupper和bindscrolltolower处理刷新方法</font>。

文档中有明确指出：

<b>Bug & Tip</b>
1. `tip`: 基础库 [2.4.0](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html)以下不支持嵌套`textarea`、`map`、`canvas`、`video` 组件
2. `tip`: `scroll-into-view` 的优先级高于 `scroll-top`
3. `tip`: 在滚动 `scroll-view` 时会阻止页面回弹，所以在 `scroll-view` 中滚动，是无法触发 `onPullDownRefresh`
4. `tip`: 若要使用下拉刷新，请使用页面的滚动，而不是 `scroll-view` ，这样也能通过点击顶部状态栏回到页面顶部

所以这种方式固然也不是什么好办法，只是当下的没有办法的办法。

此外，<font color="#c7254e">scroll-view</font>本身，对于iOS和安卓两端的处理又有一些区别，比如iOS端在scrollTop下拉会有一个弹簧效果，即scrollTop可能出现负值。但是在安卓端就没有这样一个弹簧效果。所以才会有官方文档中的第4条<font color="#c7254e">若要使用下拉刷新，清使用页面的滚动</font>。

### 我遇到的问题

### 使用组件

![效果图](https://kamchan.oss-cn-shenzhen.aliyuncs.com/1260967-a40e96dc7347c696.gif)

上面这个GIF是我尝试性的做了一个假的下拉刷新动画，置于scroll-view的顶部。触发和推出时都用<font color="#c7254e">createAnimation()</font>处理，尽可能让其变得流畅一点。

## 使用
### 1 将组件导入您的项目，并引用
![引用](https://kamchan.oss-cn-shenzhen.aliyuncs.com/1260967-0287c1c23be53cc9.png)

```
"usingComponents": {
  "top-refresh": "/components/top-refresh/top-refresh"
}
```

### 2 wxml，绑定一个唯一id
```html
<top-refresh id='tfresh'></top-refresh>
```

### 3 js，相应位置触发
```js
const com = that.selectComponent('#tfresh')
// 控制是否正在刷新
if (com.data.toprefresh) {
  return
}
// 启动刷新动画
com.refreshstart()
// 停止刷新动画
com.refreshend()
```

当然，你可以把它用在<font color="#c7254e">scrollview</font>底部。
如果你有安装微信开发者工具，可以直接查看这个[代码块](wechatide://minicode/nuzXJHmv778m)。

::: tip
注意：
<br>
这个组件并没有对scrollview触发下拉的方式起作用，只是做了一个动画告诉用户现在页面正在刷新。你也可以使用其他的方式（比如b站在下拉的时候会调用设备震动的API，告诉用户下拉的时候触发了刷新操作）。
:::

## 结尾
我觉得小程序是一个高度封装的开发工具。所以应该用最简单的方式实现想要的效果。这才符合小程序设计的初衷。

希望小程序官方早点修复，让我们摆脱scroll-view。



























