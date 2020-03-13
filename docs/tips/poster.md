---
title: vue实现页面生成海报
date: 2020-03-12
categories: article
author: Kamchan
tags:
  - CSS
  - HTML
  - JS
  - Vue
  - Canvas
---

## 生成带 logo 的二维码

用 vue_qrcodes 生成带 logo 的二维码

```
npm install vue_qrcodes -- save
```

```
<!--部分html代码-->
<qrcode :url="qrcodeUrl"
        :iconurl="iconurl"
        :wid="298"
        :hei="278"
        :imgwid="100"
        :imghei="100">
</qrcode>

// 部分js代码
import qrcode from 'vue_qrcodes'
//...省略其他代码
components: {
    qrcode
 }
```

问题来了：二维码出现了，但是二维码和 logo 大小并不是你想要，无法自适应。那就需要我们重置二维码和 logo 的样式。

```css
.logoimg {
  height: 100px !important;
  width: 100px !important;
  margin-top: -50px !important;
  margin-left: -50px !important;
}
#qrcode {
  margin-top: 20px;
  img {
    height: 278px !important;
    width: 298px !important;
  }
}
```

## html 转化为 base64 图片

html 转化为 canvas 中我选用组件 html2canvas

```
yarn add html2canvas
```

```js
import html2canvas from 'html2canvas'
```

为了防止页面有闪屏我用了两个 div，一个存放原来的 dom，一个存放 canvas 的生成的图片，再 v-if 控制展示的元素。

![htmlToImage](https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/tips/htmlToImage.png)

js 调用函数：

```js
htmlToCanvas() {
  html2canvas(this.$refs.bill, {})
  .then((canvas) => {
    let imageUrl = canvas.toDataURL('image/png'); // 将canvas转成base64图片格式
    this.canvasImageUrl = imageUrl;
    this.isDom = false;
  });
}
// 调用html转化canvas函数
this.htmlToCanvas();
```

:::warning 页面转化成了图片，但是二维码没有展示出来，控制台报错：
除二维码其他部分已经转化为图片，二维码不显示，原因有两种可能：

转化时二维码还没有加载完成

转化二维码的过程中报错了
:::

### 首先尝试了 nextTick

使用 nextTick 将回调延迟到下次 DOM 更新循环之后执行

```js
this.$nextTick(() => {
  // 跳用html转化canvas函数
  this.htmlToCanvas()
})
```

:::warning 发现二维码出来了，但是二维码的大小不对，并且控制台还是存在报错。
虽然问题没有完全解决，但是二维码出现了。可以证明二维码不展示的原因是，转化时二维码没有加载完成。
:::

### 再尝试使用 setTimeout

使用 setTimeout 将回调延迟到指定时间之后执行

```js
setTimeout(() => {
  // 调用html转化canvas函数
  this.htmlToCanvas()
}, 200)
```

:::warning 页面正常，控制台没有报错，可是 logo 没有展示出来。
项目在本地启动，可能存在跨域问题。
:::

```js
htmlToCanvas() {
      html2canvas(this.$refs.bill, {
        useCORS: true // 解决图片跨域问题
      }).then((canvas) => {
        // 将canvas转成base64图片格式
        let imageUrl = canvas.toDataURL('image/png');
        this.canvasImageUrl = imageUrl;
        this.isDom = false;
      }).catch((e) => console.log(e));
    }
```

至此html成功转化为图片。

## 微信保存问题

首先尝试了JS-SDK中的下载图片downloadImage

经过各种尝试并不能实现。

最后采用的是微信长按保存图片

海报部分已经转化为图片，无需再开发，只要提示用户长按图片可以保存即可。

## 完整代码

```html
<template>
  <div id="qr-page">
    <div ref="poster" class="poster" v-if="isDOM">
      <img src="./assets/bg.jpg" alt="" />
      <div class="qrcode-box">
        <qrcode
          :url="qrcodeUrl"
          :iconurl="iconurl"
          :wid="300"
          :hei="300"
          :imgwid="100"
          :imghei="100"
        >
        </qrcode>
      </div>
    </div>
    <div v-else class="canvas-box">
      <img :src="canvasImageUrl" alt="" />
    </div>
    <div v-if="isDOM" @click="htmlToCanvas" class="btn">保存二维码</div>
  </div>
</template>

<script>
  import qrcode from 'vue_qrcodes'
  import html2canvas from 'html2canvas'
  export default {
    name: 'index',
    components: {
      qrcode
    },
    data() {
      return {
        qrcodeUrl: './assets/qrcode.png',
        iconurl: require('./assets/logo.png'),
        canvasImageUrl: '',
        isDOM: true
      }
    },
    methods: {
      htmlToCanvas() {
        html2canvas(this.$refs.poster, {
          useCORS: true // 解决图片跨域问题
        }).then(canvas => {
          let imageUrl = canvas.toDataURL('image/png') // 将canvas转成base64图片格式
          this.canvasImageUrl = imageUrl
          this.isDOM = false
          this.savePicture(imageUrl)
        })
      },
      savePicture(Url) {
        var blob = new Blob([''], { type: 'application/octet-stream' })
        var url = URL.createObjectURL(blob)
        var a = document.createElement('a')
        a.href = Url
        a.download = Url.replace(/(.*\/)*([^.]+.*)/gi, '$2').split('?')[0]
        var e = document.createEvent('MouseEvents')
        e.initMouseEvent(
          'click',
          true,
          false,
          window,
          0,
          0,
          0,
          0,
          0,
          false,
          false,
          false,
          false,
          0,
          null
        )
        a.dispatchEvent(e)
        URL.revokeObjectURL(url)
      }
    }
  }
</script>

<style lang="scss">
  * {
    margin: 0;
    padding: 0;
  }
  body,
  html {
    width: 100%;
    height: 100%;
  }
  #qr-page {
    width: 100%;
    height: 100%;
  }
  .logoimg {
    height: 30px !important;
    width: 30px !important;
    margin-top: -15px !important;
    margin-left: -15px !important;
  }
  .poster {
    position: relative;
    width: 100%;
    > img {
      display: block;
      width: 100%;
    }
    .qrcode-box {
      overflow: hidden;
      display: flex;
      justify-content: center;
      position: absolute;
      bottom: 15%;
      left: 50%;
      transform: translateX(-45%);
    }
    #qrcode {
      img {
        height: 90px !important;
        width: 80px !important;
      }
    }
  }
  .btn {
    width: 90%;
    height: 45px;
    border-radius: 20px;
    margin: 20px auto;
    background: orange;
    line-height: 45px;
    color: white;
    text-align: center;
  }
  .canvas-box {
    width: 100%;
    img {
      display: block;
      width: 100%;
    }
  }
</style>
```
