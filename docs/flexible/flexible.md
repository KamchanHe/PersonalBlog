---
title: 使用Flexible实现手淘H5页面的终端适配
date: 2019-11-17
categories: article
author: Kamchan
tags:
- Javascript
- flexible
- rem
- 自适应
- webpack
---

::: tip
由于<font color="#c7254e">viewport</font>单位得到众多浏览器的兼容，<font color="#c7254e">lib-flexible</font>这个过渡方案已经可以放弃使用，不管是现在的版本还是以前的版本，都存有一定的问题。建议大家开始使用<font color="#c7254e">viewport</font>来替代此方案。vw的兼容方案可以参阅[《如何在Vue项目中使用vw实现移动端适配》](../vw/vw)一文。
:::

<div class="guide">曾几何时为了兼容IE低版本浏览器而头痛，以为到Mobile时代可以跟这些麻烦说拜拜。可没想到到了移动时代，为了处理各终端的适配而乱了手脚。对于混迹各社区的偶，时常发现大家拿手机淘宝的H5页面做讨论——<span>手淘的H5页面是如何实现多终端的适配</span>？</div>
<br>
<div class="guide">那么趁此<span>Amfe阿里无线前端团队双11技术连载</span>之际，用一个实战案例来告诉大家，手淘的H5页面是如何实现多终端适配的，希望这篇文章对大家在Mobile的世界中能过得更轻松。</div>

## 目标
拿一个双11的Mobile页面来做案例，比如你实现一个类似下图的一个H5页面：
![淘宝H5页面案例图](https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/flexible/flexible_001.jpg)

目标很清晰，就是做一个这样的H5页面。

[DEMO](http://huodong.m.taobao.com/act/yibo.html)

或者扫下面的二维码

![淘宝H5页面案二维码](https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/flexible/flexible_002.png)

## 痛点
虽然H5的页面与PC的Web页面相比简单了不少，但让我们头痛的事情是要想尽办法让页面能适配众多不同的终端设备。看看下图你就会知道，这是多么痛苦的一件事情：
![终端设备参数](https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/flexible/flexible_003.png)

点击[这里(依赖Google,你懂的~)](https://material.io/resources/devices/)查看更多终端设备的参数。

再来看看手淘H5要适配的终端设备数据：
![淘宝H5要适配的终端设备数据](https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/flexible/flexible_004.png)

看到这些数据，是否死的心都有了，或者说为此捏了一把汗出来。

## 手淘团队适配协作模式
早期移动端开发，对于终端设备适配问题只属于Android系列，只不过很多设计师常常忽略Android适配问题，只出一套iOS平台设计稿。但随着iPhone6，iPhone6+的出现，从此终端适配问题不再是Android系列了，也从这个时候让移动端适配全面进入到“杂屏”时代。

![需要应对的终端设备](https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/flexible/flexible_005.png)
上图来自于[paintcodeapp.com](https://www.paintcodeapp.com/news/ultimate-guide-to-iphone-resolutions)

为了应对这多么的终端设备，设计师和前端开发之间又应该采用什么协作模式？或许大家对此也非常感兴趣。

而整个手淘设计师和前端开发的适配协作基本思路是：
- 选择一种尺寸作为设计和开发基准
- 定义一套适配规则，自动适配剩下的两种尺寸(其实不仅这两种，你懂的)
- 特殊适配效果给出设计效果

还是上一张图吧，因为一图胜过千言万语：

![手机淘宝团队适配协作模式](https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/flexible/flexible_006.jpg)

在此也不做更多的阐述。在手淘的设计师和前端开发协作过程中：<span style="font-weight: 700">手淘设计师常选择iPhone6作为基准设计尺寸，交付给前端的设计尺寸是按750px * 1334px为准(高度会随着内容多少而改变)。前端开发人员通过一套适配规则自动适配到其他的尺寸。</span>

根据上面所说的，设计师给我们的设计图是一个<font color="#c7254e">750px * 1600px</font>的页面：
![750px * 1600px的设计图](https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/flexible/flexible_007.jpg)

## 前端开发完成终端适配方案
拿到设计师给的设计图之后，剩下的事情是前端开发人员的事了。而手淘经过多年的摸索和实战，总结了一套移动端适配的方案——[flexible方案](https://github.com/amfe/lib-flexible)。

这种方案具体在实际开发中如何使用，暂时先卖个关子，在继续详细的开发实施之前，我们要先了解一些基本概念。

### 一些基本概念

在进行具体实战之前，首先得了解下面这些基本概念(术语)：

#### 视窗 viewport

简单的理解，<font color="#c7254e">viewport</font>是严格等于浏览器的窗口。在桌面浏览器中，<font color="#c7254e">viewport</font>就是浏览器窗口的宽度高度。但在移动端设备上就有点复杂。

移动端的<font color="#c7254e">viewport</font>太窄，为了能更好为<font color="#c7254e">CSS布局</font>服务，所以提供了两个<font color="#c7254e">viewport:</font><font color="#c7254e">虚拟的viewportvisualviewport和布局的viewportlayoutviewport</font>。

George Cummins在Stack Overflow上[对这两个基本概念做了详细的解释](https://stackoverflow.com/questions/6333927/difference-between-visual-viewport-and-layout-viewport)。

而事实上viewport是一个很复杂的知识点，上面的简单描述可能无法帮助你更好的理解viewport，而你又想对此做更深的了解，可以阅读[PPK写的相关教程](https://www.w3cplus.com/css/viewports.html)。

#### 物理像素(physical pixel)

物理像素又被称为设备像素，他是显示设备中一个最微小的物理部件。每个像素可以根据操作系统设置自己的颜色和亮度。正是这些设备像素的微小距离欺骗了我们肉眼看到的图像效果。

![物理像素(physical pixel)](https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/flexible/flexible_008.jpg)

#### 设备独立像素(density-independent pixel)

设备独立像素也称为密度无关像素，可以认为是计算机坐标系统中的一个点，这个点代表一个可以由程序使用的虚拟像素(比如说CSS像素)，然后由相关系统转换为物理像素。

#### CSS像素

CSS像素是一个抽像的单位，主要使用在浏览器上，用来精确度量Web页面上的内容。一般情况之下，CSS像素称为与设备无关的像素(device-independent pixel)，简称DIPs。

#### 屏幕密度

屏幕密度是指一个设备表面上存在的像素数量，它通常以每英寸有多少像素来计算(PPI)。

#### 设备像素比(device pixel ratio)

设备像素比简称为dpr，其定义了物理像素和设备独立像素的对应关系。它的值可以按下面的公式计算得到：

`设备像素比 ＝ 物理像素 / 设备独立像素`

在JavaScript中，可以通过`window.devicePixelRatio`获取到当前设备的dpr。而在CSS中，可以通过`-webkit-device-pixel-ratio`，`-webkit-min-device-pixel-ratio`和 `-webkit-max-device-pixel-ratio`进行媒体查询，对不同dpr的设备，做一些样式适配(这里只针对webkit内核的浏览器和webview)。

dip或dp,（device independent pixels，设备独立像素）与屏幕密度有关。dip可以用来辅助区分视网膜设备还是非视网膜设备。

缩合上述的几个概念，用一张图来解释：

![缩合上述的几个概念](https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/flexible/flexible_009.jpg)

众所周知，iPhone6的设备宽度和高度为`375pt * 667pt`,可以理解为设备的独立像素；而其dpr为`2`，根据上面公式，我们可以很轻松得知其物理像素为`750pt * 1334pt`。

如下图所示，某元素的CSS样式：

```css
width: 2px;
height: 2px；
```

在不同的屏幕上，CSS像素所呈现的物理尺寸是一致的，而不同的是CSS像素所对应的物理像素具数是不一致的。在普通屏幕下`1个CSS像素`对应`1个物理像素`，而在Retina屏幕下，`1个CSS像素`对应的却是`4个物理像素`。

有关于更多的介绍可以[点击这里](https://www.w3cplus.com/css/towards-retina-web.html)详细了解。

看到这里，你能感觉到，在移动端时代屏幕适配除了Layout之外，还要考虑到图片的适配，因为其直接影响到页面显示质量，对于如何实现图片适配，再此不做过多详细阐述。这里用@南宮瑞揚了根据[mir.aculo.us](http://mir.aculo.us/2012/06/26/flowchart-how-to-retinafy-your-website/)翻译的一张信息图：

![实现图片适配](https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/flexible/flexible_010.jpg)

#### meta标签

`<meta>`标签有很多种，而这里要着重说的是`viewport`的`meta`标签，其主要用来告诉浏览器如何规范的渲染Web页面，而你则需要告诉它视窗有多大。在开发移动端页面，我们需要设置`meta`标签如下：

```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
```

代码以显示网页的屏幕宽度定义了视窗宽度。网页的比例和最大比例被设置为100%。

留个悬念，因为后面的解决方案中需要重度依赖`meta`标签。

#### CSS单位rem

在[W3C](https://www.w3.org/TR/css3-values/#rem-unit)规范中是这样描述`rem`的:

`font size of the root element.`

简单的理解，`rem`就是相对于根元素`<html>`的`font-size`来做计算。而我们的方案中使用`rem`单位，是能轻易的根据`<html>`的`font-size`计算出元素的盒模型大小。而这个特色对我们来说是特别的有益处。

### 前端实现方案

了解了前面一些相关概念之后，接下来我们来看实际解决方案。在整个手淘团队，我们有一个名叫[lib-flexible](https://github.com/amfe/lib-flexible)的库，而这个库就是用来解决H5页面终端适配的。

#### lib-flexible是什么？

[lib-flexible](https://github.com/amfe/lib-flexible)是一个制作H5适配的开源库，可以[点击这里](https://codeload.github.com/amfe/lib-flexible/zip/master)下载相关文件，获取需要的JavaScript和CSS文件。

当然你可以直接使用阿里CDN：

```html
<script src="http://g.tbcdn.cn/mtb/lib-flexible/{version}/??flexible_css.js,flexible.js"></script>
```

将代码中的`{version}`换成对应的版本号`0.3.4`。

#### 使用方法

[lib-flexible](https://github.com/amfe/lib-flexible)库的使用方法非常的简单，只需要在Web页面的`<head></head>`中添加对应的`flexible_css.js,flexible.js`文件：

第一种方法是将文件下载到你的项目中，然后通过相对路径添加:

```html
<script src="build/flexible_css.debug.js"></script>
<script src="build/flexible.debug.js"></script>
```

或者直接加载阿里CDN的文件：
```html
<script src="http://g.tbcdn.cn/mtb/lib-flexible/0.3.4/??flexible_css.js,flexible.js"></script>
```


另外强烈建议对JS做<span style="font-weight: 700">内联处理</span>，在所有资源加载之前执行这个JS。执行这个JS后，会在`<html>`元素上增加一个`data-dpr`属性，以及一个`font-size`样式。JS会根据不同的设备添加不同的`data-dpr`值，比如说`2`或者`3`，同时会给html加上对应的`font-size`的值，比如说`75px`。

如此一来，页面中的元素，都可以通过`rem`单位来设置。他们会根据`html`元素的`font-size`值做相应的计算，从而实现屏幕的适配效果。

除此之外，在引入[lib-flexible](https://github.com/amfe/lib-flexible)需要执行的JS之前，可以手动设置`meta`来控制`dpr`值，如：

```html
<meta name="flexible" content="initial-dpr=2" />
```

其中`initial-dpr`会把`dpr`强制设置为给定的值。如果手动设置了`dpr`之后，不管设备是多少的`dpr`，都会强制认为其`dpr`是你设置的值。在此不建议手动强制设置`dpr`，因为在Flexible中，只对iOS设备进行`dpr`的判断，对于Android系列，始终认为其`dpr`为`1`。

```js
if (!dpr && !scale) {
    var isAndroid = win.navigator.appVersion.match(/android/gi);
    var isIPhone = win.navigator.appVersion.match(/iphone/gi);
    var devicePixelRatio = win.devicePixelRatio;
    if (isIPhone) {
        // iOS下，对于2和3的屏，用2倍的方案，其余的用1倍方案
        if (devicePixelRatio >= 3 && (!dpr || dpr >= 3)) {                
            dpr = 3;
        } else if (devicePixelRatio >= 2 && (!dpr || dpr >= 2)){
            dpr = 2;
        } else {
            dpr = 1;
        }
    } else {
        // 其他设备下，仍旧使用1倍的方案
        dpr = 1;
    }
    scale = 1 / dpr;
}
```

#### flexible的实质

`flexible`实际上就是能过JS来动态改写`meta`标签，代码类似这样：

```js
var metaEl = doc.createElement('meta');
var scale = isRetina ? 0.5:1;
metaEl.setAttribute('name', 'viewport');
metaEl.setAttribute('content', 'initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no');
if (docEl.firstElementChild) {
    document.documentElement.firstElementChild.appendChild(metaEl);
} else {
    var wrap = doc.createElement('div');
    wrap.appendChild(metaEl);
    documen.write(wrap.innerHTML);
}
```

事实上他做了这几样事情：

- 动态改写`<meta>`标签
- 给`<html>`元素添加`data-dpr`属性，并且动态改写`data-dpr`的值
- 给`<html>`元素添加`font-size`属性，并且动态改写`font-size`的值

## 案例实战

了解Flexible相关的知识之后，咱们回到文章开头。我们的目标是制作一个适配各终端的H5页面。别的不多说，动手才能丰衣足食。

### 创建HTML模板

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta content="yes" name="apple-mobile-web-app-capable">
        <meta content="yes" name="apple-touch-fullscreen">
        <meta content="telephone=no,email=no" name="format-detection">
        <script src="http://g.tbcdn.cn/mtb/lib-flexible/0.3.4/??flexible_css.js,flexible.js"></script>
        <link rel="apple-touch-icon" href="favicon.png">
        <link rel="Shortcut Icon" href="favicon.png" type="image/x-icon">
        <title>再来一波</title>
    </head>
    <body>
        <!-- 页面结构写在这里 -->
    </body>
</html>
```

正如前面所介绍的一样，首先加载了Flexible所需的配置：

```html
<script src="http://g.tbcdn.cn/mtb/lib-flexible/0.3.4/??flexible_css.js,flexible.js"></script>
```

这个时候可以根据设计的图需求，在HTML文档的`<body></body>`中添加对应的HTML结构，比如：

```html
<div class="item-section" data-repeat="sections">
    <div class="item-section_header">
        <h2><img src="{brannerImag}" alt=""></h2>
    </div>
    <ul>
        <li data-repeat="items" class="flag" role="link" href="{itemLink}">
            <a class="figure flag-item" href="{itemLink}">
                <img src="{imgSrc}" alt="">
            </a>
            <div class="figcaption flag-item">
                <div class="flag-title"><a href="{itemLink}" title="">{poductName}</a></div>
                <div class="flag-price"><span>双11价</span><strong>¥{price}</strong><small>({preferential})</small></div>
                <div class="flag-type">{activityType}</div>
                <a class="flag-btn" href="{shopLink}">{activeName}</a>
            </div>
        </li>
    </ul>
</div>
```

这仅是一个示例文档，大家可以根据自己风格写模板。

为了能更好的测试页面，给其配置一点假数据：

```js
//define data
var pageData = {
    sections:[{
        "brannerImag":"http://xxx.cdn.com/B1PNLZKXXXXXaTXXXXXXXXXXXX-750-481.jpg",
        items:[{
            "itemLink": "##",
            "imgSrc": "https://placeimg.com/350/350/people/grayscale",
            "poductName":"Carter's1年式灰色长袖连体衣包脚爬服全棉鲸鱼男婴儿童装115G093",
            "price": "299.06",
            "preferential": "满400减100",
            "activityType": "1小时内热卖5885件",
            "shopLink":"##",
            "activeName": "马上抢！"
        }
            ....
        }]
    }]
}
```

接下来的工作就是美化工作了。在写具体样式之前，有几个点需要先了解一下。

### 把视觉稿中的px转换成rem

读到这里，大家应该都知道，我们接下来要做的事情，就是如何把视觉稿中的`px`转换成`rem`。在此花点时间解释一下。

首先，目前日常工作当中，视觉设计师给到前端开发人员手中的视觉稿尺寸一般是基于`640px`、`750px`以及`1125px`宽度为准。甚至为什么？大家应该懂的（考虑Retina屏）。

正如文章开头显示的示例设计稿，他就是一张以`750px`为基础设计的。那么问题来了，我们如何将设计稿中的各元素的`px`转换成`rem`。

![将设计稿中的各元素的`px`转换成`rem`](https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/flexible/flexible_011.png)

有的视觉设计师想得还是很周到的，会帮你把相关的信息在视觉稿上标注出来。

目前Flexible会将视觉稿分成**`100份`**（主要为了以后能更好的兼容`vh`和`vw`），而每一份被称为一个单位`a`。同时`1rem`单位被认定为`10a`。针对我们这份视觉稿可以计算出：

```js
1a   = 7.5px
1rem = 75px 
```

那么我们这个示例的稿子就分成了`10a`，也就是整个宽度为`10rem`，`<html>`对应的`font-size`为`75px`：

![示例的稿子就分成10份](https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/flexible/flexible_012.jpg)

这样一来，对于视觉稿上的元素尺寸换算，只需要原始的`px`值除以`rem`基准值即可。例如此例视觉稿中的图片，其尺寸是`176px * 176px`,转换成为`2.346667rem * 2.346667rem`。

### 如何快速计算

在实际生产当中，如果每一次计算`px`转换`rem`，或许会觉得非常麻烦，或许直接影响大家平时的开发效率。为了能让大家更快进行转换，我们团队内的同学各施所长，为`px`转换`rem`写了各式各样的小工具。

#### CSSREM

[CSSREM](https://github.com/flashlizi/cssrem)是一个CSS的`px`值转`rem`值的<font color="#c7254e">Sublime Text3</font>自动完成插件。这个插件是由[@正霖](https://github.com/flashlizi)编写。先来看看插件的效果：

![px转rem的插件](https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/flexible/flexible_013.gif)

有关于CSSREM如何安装、配置教程可以[点击这里查阅](https://github.com/flashlizi/cssrem)。

#### CSS处理器

除了使用编辑器的插件之外，还可以使用CSS的处理器来帮助大家处理。比如说Sass、LESS以及PostCSS这样的处理器。我们简单来看两个示例。

##### Sass

使用[Sass](https://www.sass.hk/)的同学，可以使用[Sass](https://www.sass.hk/)的函数、混合宏这些功能来实现：

```sass
@function px2em($px, $base-font-size: 16px) {
    @if (unitless($px)) {
        @warn "Assuming #{$px} to be in pixels, attempting to convert it into pixels for you";
        @return px2em($px + 0px); // That may fail.
    } @else if (unit($px) == em) {
        @return $px;
    }
    @return ($px / $base-font-size) * 1em;
}
```

除了使用Sass函数外，还可以使用Sass的混合宏：

```sass
@mixin px2rem($property,$px-values,$baseline-px:16px,$support-for-ie:false){
    //Conver the baseline into rems
    $baseline-rem: $baseline-px / 1rem * 1;
    //Print the first line in pixel values
    @if $support-for-ie {
        #{$property}: $px-values;
    }
    //if there is only one (numeric) value, return the property/value line for it.
    @if type-of($px-values) == "number"{
        #{$property}: $px-values / $baseline-rem;
    }
    @else {
        //Create an empty list that we can dump values into
        $rem-values:();
        @each $value in $px-values{
            // If the value is zero or not a number, return it
            @if $value == 0 or type-of($value) != "number"{
                $rem-values: append($rem-values, $value / $baseline-rem);
            }
        }
        // Return the property and its list of converted values
        #{$property}: $rem-values;
    }
}
```

有关于更多的介绍，可以[点击这里](https://www.w3cplus.com/blog/tags/143.html)进行了解。

##### PostCSS(px2rem)

除了Sass这样的CSS处理器这外，[@颂奇](https://weibo.com/u/2168835224?is_all=1)同学还开发了一款npm的工具[px2rem](https://www.npmjs.com/package/px2rem)。安装好[px2rem](https://www.npmjs.com/package/px2rem)之后，可以在项目中直接使用。也可以使用[PostCSS](https://www.postcss.com.cn/)。使用[PostCSS](https://www.postcss.com.cn/)插件[postcss-px2rem](https://www.npmjs.com/package/postcss-px2rem)：

Webpack

```
npm install postcss-loader
```
```js
var px2rem = require('postcss-px2rem');

module.exports = {
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: "style-loader!css-loader!postcss-loader"
      }
    ]
  },
  postcss: function() {
    return [px2rem({remUnit: 75})];
  }
}
```

Gulp

```js
var gulp = require('gulp');
var postcss = require('gulp-postcss');
var px2rem = require('postcss-px2rem');

gulp.task('default', function() {
    var processors = [px2rem({remUnit: 75})];
    return gulp.src('./src/*.css')
        .pipe(postcss(processors))
        .pipe(gulp.dest('./dest'));
});
```

除了在Gulp中配置外，还可以使用其他的配置方式，详细的介绍可以[点击这里](https://www.npmjs.com/package/postcss-px2rem)进行了解。

配置完成之后，在实际使用时，你只要像下面这样使用：

```css
.selector {
    width: 150px;
    height: 64px; /*px*/
    font-size: 28px; /*px*/
    border: 1px solid #ddd; /*no*/
}
```

`px2rem`处理之后将会变成：

```css
.selector {
    width: 2rem;
    border: 1px solid #ddd;
}
[data-dpr="1"] .selector {
    height: 32px;
    font-size: 14px;
}
[data-dpr="2"] .selector {
    height: 64px;
    font-size: 28px;
}
[data-dpr="3"] .selector {
    height: 96px;
    font-size: 42px;
}
```

在整个开发中有了这些工具之后，完全不用担心`px`值转`rem`值影响开发效率。

### 文本字号不建议使用`rem`

前面大家都见证了如何使用`rem`来完成H5适配。那么文本又将如何处理适配。是不是也通过`rem`来做自动适配。

显然，我们在iPhone3G和iPhone4的Retina屏下面，希望看到的文本字号是相同的。也就是说，我们<span style="font-weight: 700">不希望文本在Retina屏幕下变小</span>，另外，我们<span style="font-weight: 700">希望在大屏手机上看到更多文本</span>，以及，现在绝大多数的字体文件都自带一些点阵尺寸，通常是`16px`和`24px`，所以我们<span style="font-weight: 700">不希望出现`13px`和`15px`这样的奇葩尺寸</span>。

如此一来，就决定了在制作H5的页面中，`rem`并不适合用到段落文本上。所以在Flexible整个适配方案中，考虑文本还是使用`px`作为单位。只不过使用[`data-dpr]`属性来区分不同`dpr`下的文本字号大小。

```css
div {
    width: 1rem;
    height: 0.4rem;
    font-size: 12px; // 默认写上dpr为1的fontSize
}
[data-dpr="2"] div {
    font-size: 24px;
}
[data-dpr="3"] div {
    font-size: 36px;
}
```

为了能更好的利于开发，在实际开发中，我们可以定制一个[font-dpr()](https://github.com/W3cplus/SassMagic/blob/master/mixins/_font-dpr.scss)这样的Sass混合宏：

```css
@mixin font-dpr($font-size){
    font-size: $font-size;

    [data-dpr="2"] & {
        font-size: $font-size * 2;
    }

    [data-dpr="3"] & {
        font-size: $font-size * 3;
    }
}
```

有了这样的混合宏之后，在开发中可以直接这样使用：

```css
@include font-dpr(16px);
```

当然这只是针对于描述性的文本，比如说段落文本。但有的时候文本的字号也需要分场景的，比如在项目中有一个slogan,业务方希望这个slogan能根据不同的终端适配。针对这样的场景，完全可以使用`rem`给slogan做计量单位。

## 总结

其实H5适配的方案有很多种，网上有关于这方面的教程也非常的多。不管哪种方法，都有其自己的优势和劣势。而本文主要介绍的是如何使用Flexible这样的一库来完成H5页面的终端适配。为什么推荐使用Flexible库来做H5页面的终端设备适配呢？主要因为这个库在手淘已经使用了近一年，而且已达到了较为稳定的状态。除此之外，你不需要考虑如何对元素进行折算，可以根据对应的视觉稿，直接切入。

当然，如果您有更好的H5页面终端适配方案，欢迎在下面的评论中与我们一起分享。如果您在使用这个库时，碰到任何问题，都可以在Github给我们提[Issue](https://github.com/amfe/lib-flexible/issues)。我们团队会努力解决相关需Issues。


## Update

手淘这边的flexible方案临时升级如下：

- 针对OS 9_3的UA，做临时处理，强制`dpr`为`1`，即`scale`也为`1`，虽然牺牲了这些版本上的高清方案，但是也只能这么处理了
- 这个版本不打算发布到CDN（也不发不到tnpm），所以大家更新的方式，最好手动复制代码内联到`html`中，具体代码可以[点击这里下载](https://www.w3cplus.com/sites/default/files/blogs/2016/1601/flexible.js)

```js
!
function(a, b) {
    function c() {
        var b = f.getBoundingClientRect().width;
        b / i > 540 && (b = 540 * i);
        var c = b / 10;
        f.style.fontSize = c + "px",
        k.rem = a.rem = c
    }
    var d, e = a.document,
    f = e.documentElement,
    g = e.querySelector('meta[name="viewport"]'),
    h = e.querySelector('meta[name="flexible"]'),
    i = 0,
    j = 0,
    k = b.flexible || (b.flexible = {});
    if (g) {
        console.warn("meta标签当前为viewport");
        var l = g.getAttribute("content").match(/initial\-scale=([\d\.]+)/);
        l && (j = parseFloat(l[1]), i = parseInt(1 / j))
    } else if (h) {
        var m = h.getAttribute("content");
        if (m) {
            var n = m.match(/initial\-dpr=([\d\.]+)/),
            o = m.match(/maximum\-dpr=([\d\.]+)/);
            n && (i = parseFloat(n[1]), j = parseFloat((1 / i).toFixed(2))),
            o && (i = parseFloat(o[1]), j = parseFloat((1 / i).toFixed(2)))
        }
    }
    if (!i && !j) {
        var p = a.navigator.userAgent,
        q = ( !! p.match(/android/gi), !!p.match(/iphone/gi)),
        r = q && !!p.match(/OS 9_3/),
        s = a.devicePixelRatio;
        i = q && !r ? s >= 3 && (!i || i >= 3) ? 3 : s >= 2 && (!i || i >= 2) ? 2 : 1 : 1,
        j = 1 / i
    }
    if (f.setAttribute("data-dpr", i), !g) if (g = e.createElement("meta"), g.setAttribute("name", "viewport"), g.setAttribute("content", "initial-scale=" + j + ", maximum-scale=" + j + ", minimum-scale=" + j + ", user-scalable=no"), f.firstElementChild) f.firstElementChild.appendChild(g);
    else {
        var t = e.createElement("div");
        t.appendChild(g),
        e.write(t.innerHTML)
    }
    a.addEventListener("resize",
    function() {
        clearTimeout(d),
        d = setTimeout(c, 300)
    },
    !1),
    a.addEventListener("pageshow",
    function(a) {
        a.persisted && (clearTimeout(d), d = setTimeout(c, 300))
    },
    !1),
    "complete" === e.readyState ? e.body.style.fontSize = 12 * i + "px": e.addEventListener("DOMContentLoaded",
    function() {
        e.body.style.fontSize = 12 * i + "px"
    },
    !1),
    c(),
    k.dpr = a.dpr = i,
    k.refreshRem = c,
    k.rem2px = function(a) {
        var b = parseFloat(a) * this.rem;
        return "string" == typeof a && a.match(/rem$/) && (b += "px"),
        b
    },
    k.px2rem = function(a) {
        var b = parseFloat(a) / this.rem;
        return "string" == typeof a && a.match(/px$/) && (b += "rem"),
        b
    }
} (window, window.lib || (window.lib = {}));
```
























<style type="text/css">
 .guide{
  color: #666666;
 }
 .guide span{
  font-weight: 500;
  color: #333333;
 }
</style>