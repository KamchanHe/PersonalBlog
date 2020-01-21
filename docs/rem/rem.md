---
title: 移动端Rem适配方案
date: 2019-11-19
categories: article
author: Kamchan
tags:
  - Javascript
  - Flexible
  - Rem
  - 自适应
---

## H5 REM 方案一

:::tip 简单
刷新会闪屏
:::
创建一个 flexible.js 文件 并在每个页面引入 根据自己设置的字体比例 换算 px 为 rem

`VScode推荐一款插件 px to rem` 设置好 1rem 对应的字体大小就可以通过 option+z 转换了

```js
window.onload = function() {
  getRem()
}
window.onresize = function() {
  getRem()
}

function getRem(pwidth, prem) {
  var html = document.getElementsByTagName('html')[0]
  var oWidth = document.body.clientWidth || document.documentElement.clientWidth
  html.style.fontSize = oWidth / 20 + 'px'
  // var html = document.getElementsByTagName("html")[0];
  // var oWidth = document.body.clientWidth || document.documentElement.clientWidth;
  // html.style.fontSize = oWidth / pwidth * prem + "px";
}
```

## H5 REM 方案二

:::tip 复杂
刷新不会闪屏

vue 中直接在 public/index.html 文件中用`<script>`标签写入即可
:::

```js
// TODO: 这里在微信开发者工具的时候会有问题，358+17=375，没加上下和右的滚动条宽度
// TODO: 解决方案为改为在window.onload的时候才适配，但是会出现闪一下的问题
// TODO: vue的 px2rem npm install px2rem-loader -s npm install lib-flexible —s
// TODO: import 'lib-flexible/flexible' 似乎能解决这个问题，但是无法配置
// TODO: https://www.jianshu.com/p/1a5c4afe3c4f
!(function(a, b) {
  function c() {
    var b = f.getBoundingClientRect().width
    b / i > 540 && (b = 540 * i)
    var c = b / 10
    ;(f.style.fontSize = c + 'px'), (k.rem = a.rem = c)
  }
  var d,
    e = a.document,
    f = e.documentElement,
    g = e.querySelector('meta[name="viewport"]'),
    h = e.querySelector('meta[name="flexible"]'),
    i = 0,
    j = 0,
    k = b.flexible || (b.flexible = {})
  if (g) {
    console.warn('将根据已有的meta标签来设置缩放比例')
    var l = g.getAttribute('content').match(/initial\-scale=([\d\.]+)/)
    l && ((j = parseFloat(l[1])), (i = parseInt(1 / j)))
  } else if (h) {
    var m = h.getAttribute('content')
    if (m) {
      var n = m.match(/initial\-dpr=([\d\.]+)/),
        o = m.match(/maximum\-dpr=([\d\.]+)/)
      n && ((i = parseFloat(n[1])), (j = parseFloat((1 / i).toFixed(2)))),
        o && ((i = parseFloat(o[1])), (j = parseFloat((1 / i).toFixed(2))))
    }
  }
  if (!i && !j) {
    var p = a.navigator.userAgent,
      q = (!!p.match(/android/gi), !!p.match(/iphone/gi)),
      r = q && !!p.match(/OS 9_3/),
      s = a.devicePixelRatio
    ;(i =
      q && !r
        ? s >= 3 && (!i || i >= 3)
          ? 3
          : s >= 2 && (!i || i >= 2)
          ? 2
          : 1
        : 1),
      (j = 1 / i)
  }
  if ((f.setAttribute('data-dpr', i), !g))
    if (
      ((g = e.createElement('meta')),
      g.setAttribute('name', 'viewport'),
      g.setAttribute(
        'content',
        'initial-scale=' +
          j +
          ', maximum-scale=' +
          j +
          ', minimum-scale=' +
          j +
          ', user-scalable=no'
      ),
      f.firstElementChild)
    )
      f.firstElementChild.appendChild(g)
    else {
      var t = e.createElement('div')
      t.appendChild(g), e.write(t.innerHTML)
    }
  a.addEventListener(
    'resize',
    function() {
      clearTimeout(d), (d = setTimeout(c, 300))
    },
    !1
  ),
    a.addEventListener(
      'pageshow',
      function(a) {
        a.persisted && (clearTimeout(d), (d = setTimeout(c, 300)))
      },
      !1
    ),
    'complete' === e.readyState
      ? (e.body.style.fontSize = 12 * i + 'px')
      : e.addEventListener(
          'DOMContentLoaded',
          function() {
            e.body.style.fontSize = 12 * i + 'px'
          },
          !1
        ),
    c(),
    (k.dpr = a.dpr = i),
    (k.refreshRem = c),
    (k.rem2px = function(a) {
      var b = parseFloat(a) * this.rem
      return 'string' == typeof a && a.match(/rem$/) && (b += 'px'), b
    }),
    (k.px2rem = function(a) {
      var b = parseFloat(a) / this.rem
      return 'string' == typeof a && a.match(/px$/) && (b += 'rem'), b
    })
})(window, window.lib || (window.lib = {}))
```

## H5+VUE VW 方案三

:::tip
目前出视觉设计稿，我们都是使用 750px 宽度的，那么 100vw = 750px，即 1vw = 7.5px。那么我们可以根据设计图上的 px 值直接转换成对应的 vw 值。在实际撸码过程，不需要进行任何的计算，直接在代码中写 px
:::

1、vue init webpack [项目名]

    通过Vue-cli构建的项目，在项目的根目录下有一个 .postcssrc.js ，默认情况下已经有了：

2、安装插件

    `npm i postcss-aspect-ratio-mini postcss-px-to-viewport postcss-write-svg postcss-cssnext postcss-viewport-units cssnano --S`

3、接下来在 .postcssrc.js 文件对新安装的 PostCSS 插件进行配置：

```js
module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-url': {},
    'postcss-aspect-ratio-mini': {},
    'postcss-write-svg': {
      utf8: false
    },
    'postcss-cssnext': {},
    'postcss-px-to-viewport': {
      viewportWidth: 750, // (Number) The width of the viewport.
      viewportHeight: 1334, // (Number) The height of the viewport.
      unitPrecision: 3, // (Number) The decimal numbers to allow the REM units to grow to.
      viewportUnit: 'vw', // (String) Expected units.
      selectorBlackList: ['.ignore', '.hairlines'], // (Array) The selectors to ignore and leave as px.
      minPixelValue: 1, // (Number) Set the minimum pixel value to replace.
      mediaQuery: false // (Boolean) Allow px to be converted in media queries.
    },
    'postcss-viewport-units': {},
    cssnano: {
      preset: 'advanced',
      autoprefixer: false,
      'postcss-zindex': false
    }
  }
}
```

:::tip 特别声明：
由于 cssnext 和 cssnano 都具有 autoprefixer,事实上只需要一个，所以把默认的 autoprefixer 删除掉，然后把 cssnano 中的 autoprefixer 设置为 false。
:::

4、安装 cssnano-preset-advanced

    npm i cssnano-preset-advanced --save-dev

5、引入外部 cdn

    <script src="//g.alicdn.com/fdilab/lib3rd/viewport-units-buggyfill/0.6.2/??viewport-units-buggyfill.hacks.min.js,viewport-units-buggyfill.min.js"></script>

6、调用 viewport-units-buggyfill

```html
<script>
  window.onload = function() {
    window.viewportUnitsBuggyfill.init({
      hacks: window.viewportUnitsBuggyfillHacks
    })
  }
</script>
```

7、　 App.vue 初始化

```css
<style>
html {
  margin: 0;
  padding: 0;
  height: 100vh;
  box-sizing: border-box;
}
body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  background-color: #f4f4f4;
}
* {
  box-sizing: inherit;

  &:before,
  &:after {
    box-sizing: inherit;
  }
}
img {
  width: 100%;
  height: auto;
  vertical-align: top;
  content: normal !important;
}
  [aspectratio] {
      position: relative;
  }
  [aspectratio]::before {
      content: '';
      display: block;
      width: 1px;
      margin-left: -1px;
      height: 0;
  }

  [aspectratio-content] {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
  }
  [flexContainer] {
    display: flex;
    width: 750px;
  }
  .block {
    margin-top: 15px;
  }
  ul,li {
    list-style: none outside none;
    margin: 0;
    padding: 0;
  }
  figure {
    display: block;
    margin: 0;
  }
</style>
```

:::tip
在不想要把 px 转换为 vw 的时候，首先在对应的元素（html）中添加配置中指定的类名.ignore 或.hairlines(.hairlines 一般用于设置 border-width:0.5px 的元素中)：
:::

处理元素容器宽高比

```html
<div aspectratio w-188-246>
  <div aspectratio-content></div>
</div>

//或者

<div class="aspectratio w-188-246">
  <div class="aspectratio-content"></div>
</div>
```

```css
[w-188-246] {
  aspect-ratio: '188:246';
}
```

## H5-VUE REM+VW(我最常用)

### reset.scss

创建初始化样式文件

```scss
// rem 单位换算：定为 75px 只是方便运算，750px-75px、640-64px、1080px-108px，如此类推
$vw_fontsize: 75; // iPhone 6尺寸的根元素大小基准值
@function rem($px) {
  @return ($px / $vw_fontsize) * 1rem;
}
// 根元素大小使用 vw 单位
$vw_design: 750;
html {
  font-size: ($vw_fontsize / ($vw_design / 2)) * 100vw;
  // 同时，通过Media Queries 限制根元素最大最小值
  @media screen and (max-width: 320px) {
    font-size: 64px;
  }
  @media screen and (min-width: 540px) {
    font-size: 108px;
  }
}
// body 也增加最大最小宽度限制，避免默认100%宽度的 block 元素跟随 body 而过大过小
html,
body {
  max-width: 540px;
  min-width: 320px;
  height: 100%;
}

.mod_banner {
  position: relative;
  // 使用padding-top 实现宽高比为 100:750 的图片区域
  padding-top: percentage(100/750);
  height: 0;
  overflow: hidden;
  img {
    width: 100%;
    height: auto;
    position: absolute;
    left: 0;
    top: 0;
  }
}

.mod_grid {
  position: relative;
  &::after {
    // 实现1物理像素的下边框线
    content: '';
    position: absolute;
    z-index: 1;
    pointer-events: none;
    background-color: #ddd;
    height: 1px;
    left: 0;
    right: 0;
    bottom: 0;
    @media only screen and (-webkit-min-device-pixel-ratio: 2) {
      -webkit-transform: scaleY(0.5);
      -webkit-transform-origin: 50% 0%;
    }
  }
}

/*初始化样式*/
body,
h1,
h2,
h3,
h4,
h5,
h6,
hr,
p,
blockquote,
dl,
dt,
dd,
ul,
ol,
li,
pre,
form,
fieldset,
legend,
button,
input,
textarea,
th,
td {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  -khtml-user-select: none;
  user-select: none;
  -webkit-touch-callout: none;
  -moz-touch-callout: none;
  -ms-touch-callout: none;
  touch-callout: none;
}

button,
input,
select,
textarea {
  box-sizing: border-box;
  -webkit-tap-highlight-color: rgba(255, 0, 0, 0);
}

button:focus,
button:active:focus,
button.active:focus,
button.focus,
button:active.focus,
button.active.focus {
  outline: none;
  border-color: transparent;
  box-shadow: none;
  border: none;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-size: 100%;
}

address,
cite,
dfn,
em,
var {
  font-style: normal;
}

code,
kbd,
pre,
samp {
  font-family: couriernew, courier, monospace;
}

div {
  box-sizing: border-box;
}

ul,
ol {
  list-style: none;
}

a {
  text-decoration: none;
  color: black;
}

a:hover {
  text-decoration: none;
}

input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 1000px white inset !important;
}

sup {
  vertical-align: text-top;
}

sub {
  vertical-align: text-bottom;
}

legend {
  color: #000;
}

fieldset,
img {
  border: none;
  border: 0;
}

img {
  width: 100%;
  content: normal !important;
}

table {
  border-collapse: collapse;
  border-spacing: 0;
}
/*flex 相关*/
.flex {
  display: flex;

  &.flex-column {
    flex-direction: column;
  }

  &.flex-wrap {
    flex-wrap: wrap;
  }

  &.flex-row {
    flex-direction: row;
  }

  &.flex-center {
    align-items: center;
    justify-content: center;
  }

  &.flex-align-center {
    align-items: center;
  }

  &.flex-align-end {
    align-items: flex-end;
  }

  &.flex-content-end {
    justify-content: flex-end;
  }

  &.flex-content-center {
    justify-content: center;
  }

  &.flex-content-between {
    justify-content: space-between;
  }

  .flex-1 {
    flex: 1;
  }

  .flex-2 {
    flex: 2;
  }

  .flex-3 {
    flex: 3;
  }

  .flex-4 {
    flex: 4;
  }
}

// 一行超出省略
.ellipsis-one {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
// 两行超出省略
.ellipsis-two {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
```

### main.js 全局引入 reset.scss

```js
import '@/assets/css/reset.scss'
```

:::tip
如果引入全局 scss 报错
需安装 node-sass sass-loader
创建 vue.config.js 在根目录下
:::

```js
module.exports = {
  devServer: {
    port: 8080,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    // 跨域配置
    proxy: {
      '/api': {
        target: `http://localhost:3000`, //线上
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  // 全局引入scss报错处理
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/assets/css/reset.scss";`
      }
    }
  }
}
```

### 使用

```css
.index{
    width: rem(20);
    height: rem(20);
    padding: rem(20) rem(10) rem(15) rem(5);
}
```
