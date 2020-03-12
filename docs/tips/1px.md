---
title: 移动端1px解决方案
date: 2020-03-12
categories: article
author: Kamchan
tags:
  - CSS
  - 1PX
---

## 前言

移动端 web 项目越来越多，设计师对于 UI 的要求也越来越高，比如 1px 的边框。在高清屏下，移动端的 1px 会很粗。 比如，这个是假的 1 像素

![1px](https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/tips/1px.png)

这个是真的 1 像素

![0.5px](https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/tips/0.5px.png)

### 产生原因

主要是跟一个东西有关，DPR(devicePixelRatio) 设备像素比，它是默认缩放为 100%的情况下，设备像素和 CSS 像素的比值。

```js
window.devicePixelRatio = 物理像素 / CSS像素
```

目前主流的屏幕 DPR=2 （iPhone 8）,或者 3 （iPhone 8 Plus）。拿 2 倍屏来说，设备的物理像素要实现 1 像素，而 DPR=2，所以 css 像素只能是 0.5。一般设计稿是按照 750 来设计的，它上面的 1px 是以 750 来参照的，而我们写 css 样式是以设备 375 为参照的，所以我们应该写的 0.5px 就好了啊！ 试过了就知道，iOS 8+系统支持，安卓系统不支持。

## 解决方案

### 1、iOS 的方案

<font color="#ff502c">推荐指数:\*\*</font>

在 WWDC 大会上，给出来了 1px 方案，当写 0.5px 的时候，就会显示一个物理像素宽度的 border，而不是一个 css 像素的 border。 所以在 iOS 下，你可以这样写。

```css
border: 0.5px solid #e5e5e5;
```

可能你会问为什么在 3 倍屏下，不是 0.3333px 这样的？经过我测试，在 Chrome 上模拟 iPhone 8Plus，发现小于 0.46px 的时候是显示不出来。

#### 总结：

- 优点：简单，没有副作用

- 缺点：支持 iOS 8+，不支持安卓。后期安卓 follow 就好了。

### 2、使用边框图片

<font color="#ff502c">推荐指数:\*\*</font>

```css
border: 1px solid transparent;
border-image: url('xxx.png') 2 repeat;
```

图片的颜色就是此后 border 的颜色

这个方法在 W3CPlus 上的例子讲的非常细致[CSS3 Border-image](https://www.w3cplus.com/content/css3-border-image)

#### 总结：

- 优点：没有副作用

- 缺点：border 颜色变了就得重新制作图片；圆角会比较模糊

### 3、使用 box-shadow 实现

<font color="#ff502c">推荐指数:\*\*\*</font>

先复习一下 box-shadow，看一下 MDN 上的这篇就够了[box-shadow](https://developer.mozilla.org/zh-CN/docs/Web/CSS/box-shadow)

```css
box-shadow: 0 -1px 1px -1px #e5e5e5, //上边线
    1px 0 1px -1px #e5e5e5,
  //右边线
    0 1px 1px -1px #e5e5e5, //下边线
    -1px 0 1px -1px #e5e5e5; //左边线
```

前面两个值 x，y 主要控制显示哪条边，后面两值控制的是阴影半径、扩展半径。 其实方法可以到这个地址线上[尝试一下](https://www.runoob.com/try/try.php?filename=trycss3_box-shadow)

#### 总结

- 优点：使用简单，圆角也可以实现

- 缺点：模拟的实现方法，仔细看谁看不出来这是阴影不是边框。

### 4、使用伪元素

<font color="#ff502c">推荐指数:\*\*\*\*</font>

这个方法是我使用最多的，做出来的效果也是非常棒的，直接上代码。

#### 一条边框

```css
.setOnePx {
  position: relative;
  &::after {
    position: absolute;
    content: '';
    background-color: #e5e5e5;
    display: block;
    width: 100%;
    height: 1px; /*no*/
    transform: scale(1, 0.5);
    top: 0;
    left: 0;
  }
}
```

可以看到，将伪元素设置绝对定位，并且和父元素的左上角对齐，将 width 设置 100%，height 设置为 1px，然后进行在 Y 方向缩小 0.5 倍。

#### 四条边框

```css
.setBorderAll {
  position: relative;
  &:after {
    content: ' ';
    position: absolute;
    top: 0;
    left: 0;
    width: 200%;
    height: 200%;
    transform: scale(0.5);
    transform-origin: left top;
    box-sizing: border-box;
    border: 1px solid #e5e5e5;
    border-radius: 4px;
  }
}
```

同样为伪元素设置绝对定位，并且和父元素左上角对其。将伪元素的长和宽先放大 2 倍，然后再设置一个边框，以左上角为中心，缩放到原来的 0.5 倍

#### 总结：

- 优点：全机型兼容，实现了真正的 1px，而且可以圆角。

- 缺点：暂用了 after 伪元素，可能影响清除浮动。

- 到了手机真机的时候，安卓有的会偏移，有的会消失（初步怀疑消失是偏移了）

### 5、viewport 的 scale 值

<font color="#ff502c">推荐指数:\*\*\*\*\*</font>

这个解决方案是利用 viewport+rem+js 实现的。 参考了网上的一个例子 [移动端 1 像素边框问题的解决方案](https://blog.csdn.net/bbnbf/article/details/51580569)，自己手动实现了一下。

```html
<html>
  <head>
    <title>1px question</title>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
    <meta
      name="viewport"
      id="WebViewport"
      content="initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no"
    />
    <style>
      html {
        font-size: 1px;
      }
      * {
        padding: 0;
        margin: 0;
      }
      .top_b {
        border-bottom: 1px solid #e5e5e5;
      }

      .a,
      .b {
        box-sizing: border-box;
        margin-top: 1rem;
        padding: 1rem;
        font-size: 1.4rem;
      }

      .a {
        width: 100%;
      }

      .b {
        background: #f5f5f5;
        width: 100%;
      }
    </style>
    <script>
      var viewport = document.querySelector('meta[name=viewport]')
      //下面是根据设备像素设置viewport
      if (window.devicePixelRatio == 1) {
        viewport.setAttribute(
          'content',
          'width=device-width,initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no'
        )
      }
      if (window.devicePixelRatio == 2) {
        viewport.setAttribute(
          'content',
          'width=device-width,initial-scale=0.5, maximum-scale=0.5, minimum-scale=0.5, user-scalable=no'
        )
      }
      if (window.devicePixelRatio == 3) {
        viewport.setAttribute(
          'content',
          'width=device-width,initial-scale=0.3333333333333333, maximum-scale=0.3333333333333333, minimum-scale=0.3333333333333333, user-scalable=no'
        )
      }
      var docEl = document.documentElement
      var fontsize = 32 * (docEl.clientWidth / 750) + 'px'
      docEl.style.fontSize = fontsize
    </script>
  </head>
  <body>
    <div class="top_b a">下面的底边宽度是虚拟1像素的</div>
    <div class="b">上面的边框宽度是虚拟1像素的</div>
  </body>
</html>
```

#### 总结

- 优点：全机型兼容，直接写 1px 不能再方便

- 缺点：适用于新的项目，老项目可能改动大

- 缺点：后遗症比较多，涉及到 echarts, video 这些改变样式就哭了

- 拿到微信浏览器跑跑试试，渲染一大串列表试试，你会发现上面的方法全挂了

### 总结

总结一下，新项目最好使用的是设置<font color="#ff502c">viewport 的 scale</font>值，这个方法兼容性好，后期写起来方便。老项目的话，改起来可能比较多，用的比较多的方法就是<font color="#ff502c">伪元素+transform</font>的方法。 其他的背景图片，阴影的方法毕竟还是不太灵活，而且兼容性不好。

:::tip
空元素(不能包含内容的元素)不支持 ::`before` `::after`

IE 不支持的元素有：img,input,select,textarea

FireFox 不支持的元素有：input,select,textarea

IE 不支持的元素有：input[type=text],textarea
:::

## border.less

```less
.min-device-pixel-ratio(@scale2, @scale3) {
  @media screen and (min-device-pixel-ratio: 2),
    (-webkit-min-device-pixel-ratio: 2) {
    transform: @scale2;
  }
  @media screen and (min-device-pixel-ratio: 3),
    (-webkit-min-device-pixel-ratio: 3) {
    transform: @scale3;
  }
}

.border-1px(@color: #DDD, @radius: 2px, @style: solid) {
  &::before {
    content: '';
    pointer-events: none;
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    transform-origin: 0 0;
    border: 1px @style @color;
    border-radius: @radius;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    @media screen and (min-device-pixel-ratio: 2),
      (-webkit-min-device-pixel-ratio: 2) {
      width: 200%;
      height: 200%;
      border-radius: @radius * 2;
      transform: scale(0.5);
    }
    @media screen and (min-device-pixel-ratio: 3),
      (-webkit-min-device-pixel-ratio: 3) {
      width: 300%;
      height: 300%;
      border-radius: @radius * 3;
      transform: scale(0.33);
    }
  }
}

.border-top-1px(@color: #DDD, @style: solid) {
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    border-top: 1px @style @color;
    transform-origin: 0 0;
    .min-device-pixel-ratio(scaleY(0.5), scaleY(0.33));
  }
}
.border-bottom-1px(@color: #DDD, @style: solid) {
  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    border-bottom: 1px @style @color;
    transform-origin: 0 0;
    .min-device-pixel-ratio(scaleY(0.5), scaleY(0.33));
  }
}
.border-left-1px(@color: #DDD, @style: solid) {
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    border-left: 1px @style @color;
    transform-origin: 0 0;
    .min-device-pixel-ratio(scaleX(0.5), scaleX(0.33));
  }
}
```
