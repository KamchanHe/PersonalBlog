---
title: CSS实现进度圆环
date: 2020-05-06
categories: article
author: Kamchan
tags:
  - Javascript
  - HTML
  - CSS
  - CSS3
  - Ring
---

## 看图看效果

![cssRing](https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/ring/2020-05-06%2009.45.08.gif)

## 代码

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Document</title>
    <style>
      div {
        box-sizing: border-box;
      }
      .annulusBasics {
        width: 94px;
        height: 94px;
        position: relative;
        overflow: hidden;
        border-radius: 50%;
        text-align: center;
        z-index: 1;
      }
      .centerCircle {
        position: absolute;
        z-index: 10;
        border-radius: 50%;
        width: 71px;
        height: 71px;
        background: #fff;
        transform: translate(12px, 12px);
        line-height: 71px;
      }
      .annulusOuter {
        position: absolute;
        top: 0;
        left: 0;
        width: 94px;
        height: 94px;
        border: 12px solid #ff7f69;
        border-radius: 50%;
        transform: rotate(180deg);
      }
      .leftRectangle {
        position: absolute;
        background: #ebeef5;
        width: 47px;
        height: 94px;
        transform-origin: right;
        transform: rotate(0deg);
      }
      .rightRectangle {
        position: absolute;
        background: #ebeef5;
        transform-origin: left;
        left: 47px;
        width: 47px;
        height: 94px;
        transform: rotate(0deg);
      }
      .active {
        z-index: 2;
        background: #ff7f69;
      }
      .repairAnnulus {
        position: absolute;
        width: 94px;
        height: 94px;
        z-index: 20;
        border-radius: 50%;
        box-sizing: content-box;
        border: 20px solid #ffffff;
        top: -20px;
        left: -20px;
      }
    </style>
  </head>
  <body>
    <!-- 最外层的idv -->
    <div class="annulusBasics">
      <!-- 圆环中间内容部分 -->
      <div class="centerCircle">40%</div>
      <!-- 圆环百分比进度的展示 -->
      <div class="annulusOuter"></div>
      <!-- 左边遮住的div -->
      <div class="leftRectangle"></div>
      <!-- 右边遮住的div -->
      <div class="rightRectangle"></div>
      <!-- 弥补移动端下hidden失效的问题 -->
      <div class="repairAnnulus"></div>
    </div>
    <script>
      let right = document.getElementsByClassName('rightRectangle')[0]
      // 初始进度
      let circle = 0
      // 是否超过180度
      let isFinish = false
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        circle++
        // 从0度到超过180度
        if (circle >= 180 && !isFinish) {
          // isFinish变为true 表示超过180度了
          isFinish = true
          // 超过180度 重置右边的进度并设置层级和背景色
          circle = 0
          right.style.zIndex = 2
          right.style.background = '#ff7f69'
          right.style.transform = `rotate(${0}deg)`
          // 这样 原本右边的遮挡就会和圆环进度颜色一样 让右边一直保持这个颜色 然后右边的遮挡复位 旋转的过程中就会在左边继续展示进度
        } else if (circle >= 180 && isFinish) {
          right.style.transform = `rotate(${180}deg)`
          clearInterval(this.timer)
          return
        } else {
          right.style.transform = `rotate(${circle}deg)`
        }
      }, 20)
    </script>
  </body>
</html>
```
