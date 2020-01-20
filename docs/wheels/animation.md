---
title: 动画库
date: 2019-11-20
categories: article
author: Kamchan
tags:
- Javascript
- Css
- Css3
- Animation
---

## [Animista](https://animista.net/)

### Animista是一个在线动画生成器，同时也是一个动画库，它为我们提供了以下功能

#### 1. 选择不同的动画
- 我们可以选择想要的动画类型（例如entrance/exist），除了可以选择某个动画（例如，scale-in）外，甚至还可以为该动画选择不同的展示效果（例如： scale-in-right）。

#### 2. 定制
- Animista还提供了一个功能，允许我们定制动画的某些部分，比如
  - duration
  - delay
  - direction

#### 3. 生成CSS代码
- 选择适合自己需要的动画后，我们可以直接从网站上获取代码，甚者可以进行压缩

#### 4. 下载代码
- 另一个好用的功能是，可以把自己收藏自己喜欢的动画，然后一起下载下来， 或者，我们也可以选择将这些动画的代码复制到一起。

## [Animate CSS](https://daneden.github.io/animate.css/)

### 齐全的CSS3动画库,想必这个不用介绍，大部分人都知道了。Animate CSS 可能是最著名的动画库之一。

#### 1. 用法

首先，必须在总需要动画元素上添加类animated ，然后是动画的名字。
```html
<div class="animated slideInLeft"></div>
```

如果我们想让动画一直持续，可以添加infinite类。

通过 JS 来添加动画：

```js
document.querySelector('.my-element').classList.add('animated', 'slideInLeft')
```

通过 JQ 来添加动画：
```js
$(".my-element").addClass("animated slideInLeft")
```

#### 2. 其它功能

Animate CSS提供了一些基本的类来控制动画的延迟和速度。

可以添加 delay 类来延迟动画的播放。

```html
<div class="animated slideInLeft delay-{1-5}"><div>
```

我们还可以 通过speed 通过添加如下列出的类之一来控制动画速度。

```html
<div class="animated slideInLeft slow|slower|fast|faster"><div>
```

## [Vivify](http://vivify.mkcreative.cz/)

### 一个更加丰富css动画库,Vivify 是一个动画库，可以看作是Animate CSS的增强版。它们的工作方式完全相同，有Animate CSS的大多数类且还扩展了一些。

#### 使用
```html
<div class="vivify slideInLeft"></div>
```

#### 使用 JS 方式：

```js
document.querySelector('.my-element').classList.add('vivify', 'slideInLeft')
```

#### 使用 JQ 方式：

```js
$(".my-element").addClass("vivify slideInLeft")
```

与Animate CSS一样，Vivify 还提供了一些类来控制动画的持续时间和延迟。

延迟和持续时间类在以下间隔中可用：

```html
<div class="delay|duration-{100|150|200|250...1000|1250|1500|1750...10750}"></div>
```

## [Magic Animations CSS3](https://www.minimamente.com/project/magic/)

### Magic CSS3 Animations 是 CSS3 动画的包，伴有特殊的效果，用户可以自由的在 web 项目中使用。这个动画库有一些非常漂亮和流畅的动画，特别是3D的。没什么好说的，自己去尝试。

#### 使用

```html
<div class="magictime fadeIn"></div>
```

使用 JS 方式：
```js
document.querySelector('.my-element').classList.add('magictime', 'fadeIn')
```

使用 JQ 方式：
```js
$(".my-element").addClass("magictime fadeIn")
```

## [cssanimation.io](http://cssanimation.io/index.html)

### cssanimation.io是一大堆不同动画的集合，总共大概有200个，这很强大。如果你连在这里都没有找到你所需的动画，那么在其它也将很难找到。它的工作原理与 Animista 类似。例如，可以选择一个动画并直接从站点获取代码，或者也可以下载整个库。

#### 使用
```html
<div class="cssanimation fadeIn"></div>
```

#### 使用JS
```js
document.querySelector('.my-element').classList.add('cssanimation','fadeIn')
```

#### 使用JQ
```js
$(".my-element").addClass("cssanimation fadeIn")
```

#### 还可以添加 infinite 类，这样动画就可以循环播放。
```html
<div class="cssanimation fadeIn infinite"></div>
```

#### 此外，cssanimation.io还为我们提供了动漫字母的功能。使用这个需要引入letteranimation.js文件，然后将le {animation_name}添加到我们的文本元素中。
```html
<div class="cssanimation leSnake"></div>
```

#### 要使字母按顺序产生动画，添加sequence类，要使它们随机产生动画，添加random类。
```html
<div class="cssanimation leSnake {sequence|random}"></div>
```

## [Angrytools](https://angrytools.com/css/animation/)

### 如果使用不同的生成器，Angrytools实际上是一个集合，其中还包括CSS动画生成器。它可能不像Animista那么复杂，但我觉得这个也很不错。这个站点还提供了一些自定义动画的特性，比如动画的持续时间或延迟。但是我喜欢的是，我们可以在其展示时间轴上添加自定义的keyframes，然后可以直接在其中编写代码。 另外，也可以编辑现有的。

## [Hover](http://ianlunn.github.io/Hover/)

### Hover.css是许多CSS动画的集合，与上面的动画不同，每次将元素悬停时都会触发。

####  用法
```html
<button class="hvr-fade">Hover me!</button>
```

## [WickedCSS](http://kristofferandreasen.github.io/wickedCSS/#)

### WickedCSS是一个小的CSS动画库，它没有太多的动画变体，但至少有很大的变化。 其中大多数是我们已经熟悉的基础知识，但它们确实很干净。

#### 使用

```html
<div class="bounceIn"></div>
```

#### 使用 JS
```js
document.querySelector('.my-element').classList.add('bounceIn')
```

#### 使用 JQ
```js
$(".my-element").addClass("bounceIn")
```

## [Three Dots](https://github.com/nzbin/three-dots#readme)

### Three Dots是一组CSS加载动画，它由三个点组成，而这些点仅由单个元素组成。

#### 使用
```html
<div class="dot-elastic"></div>
```

## [CSShake](http://elrumordelaluz.github.io/csshake/)

### 顾名思义，CSShake是一个CSS动画库，其中包含不同类型的震动动画。

#### 使用
```html
<div class="shake shake-hard"></div>
```

#### 使用JS
```js
document.querySelector('.my-element').classList.add('shake','shake-hard')
```

#### 使用JQ
```js
$(".my-element").addClass("shake shake-hard")
```
