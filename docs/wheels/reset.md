---
title: 移动端自适应初始化
date: 2020-03-31
categories: article
author: Kamchan
tags:
  - Javascript
  - Scss
  - Css
  - REM
  - VW
---

## reset.scss

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

## vue.config.js

```js
module.exports = {
  devServer: {
    port: 8080,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
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
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/assets/css/reset.scss";`
      }
    }
  }
}
```

## main.js

```js
import '@/assets/css/reset.scss'
```

## 使用

```scss
div{
  width:rem(10); //相当于10px
  height:calc(100% - rem(70));
}
```
