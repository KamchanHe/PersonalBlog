---
title: svg实现贝塞尔曲线动画
date: 2020-05-06
categories: article
author: Kamchan
tags:
  - Javascript
  - HTML
  - SVG
---

##  效果

![svg](https://kamchan.oss-cn-shenzhen.aliyuncs.com/2020-05-19%2018.27.46.gif)

## 安装SVG.js
```
npm install @svgdotjs/svg.js
```

## 代码

```vue
<template>
  <div id="app">
    <div id="svgbox"></div>
  </div>
</template>

<script>
import { SVG } from '@svgdotjs/svg.js'
export default {
  name: 'App',
  mounted() {
    this.init()
  },
  methods: {
    init() {
      let width = document.getElementById('app').clientWidth // 设置长度
      let cubeWidth = 100 // 弧总长度
      let cubeHeight = 50 // 弧高
      let circleSize = 30 // 小圆球大小
      let activeSize = 50 // 小圆球大小
      let circleNum = 8 // 数量+1
      let circleArr = [] // 保存小圆球
      let length = 0 // 路径长度
      let pathMoveTo = [0, 200] // 起点位置
      let activeCircle = 4 // 激活哪个小圆球
      let lineColor = 'orange' // 路径颜色
      let lineWidth = 5 // 路径粗
      let animationTime = 1000 // 动画时长
      let nowIndex = 0 // 当前激活的下标
      let activeColorArr = ['white', 'blue'] // 激活圆的颜色 可渐变
      let activeColorSize = 0.6 // 渐变位置
      let defaultColorArr = ['orange', 'skyblue'] // 默认圆的颜色 可渐变
      let defaultColorSize = 0.6 // 渐变位置

      let draw = SVG().addTo('#svgbox') // 创建svg对象
      draw.size('100%', '100%') // 设置svg大小
      // 画path线
      let path = draw
        .path(
          `M${pathMoveTo},h ${width / (circleNum / activeCircle) -
            cubeWidth},c ${cubeWidth / 2},0 ${cubeWidth /
            2},-${cubeHeight} ${cubeWidth},-${cubeHeight},c ${cubeWidth /
            2},0 ${cubeWidth /
            2},${cubeHeight} ${cubeWidth},${cubeHeight},H ${width}`
        )
        .stroke({
          color: lineColor,
          width: lineWidth,
        })
        .fill('none')
      let activeColor = draw.gradient('radial', function(add) {
        add.stop({ offset: 0, color: activeColorArr[0], opacity: 1 }) // -> first
        add.stop({
          offset: activeColorSize,
          color: activeColorArr[1],
          opacity: 1,
        }) // -> second
        add.stop({ offset: 1, color: activeColorArr[1], opacity: 1 }) // -> third
      })

      length = path.length()
      var gradient = draw.gradient('radial', function(add) {
        add.stop({ offset: 0, color: defaultColorArr[0], opacity: 1 }) // -> first
        add.stop({
          offset: defaultColorSize,
          color: defaultColorArr[1],
          opacity: 1,
        }) // -> second
        add.stop({ offset: 1, color: defaultColorArr[1], opacity: 1 }) // -> third
      })
      for (let index = 0; index < circleNum - 1; index++) {
        let name = 'circle_' + (index + 1)
        name = draw
          .circle(circleSize)
          .fill(gradient)
          .center(
            path.pointAt((1 / circleNum) * (index + 1) * length).x,
            path.pointAt((1 / circleNum) * (index + 1) * length).y
          )
        if (index + 1 == activeCircle) {
          name.size(activeSize).fill(activeColor)
        }
        circleArr.push(name)
      }

      function setCircle() {
        length = path.length()
        circleArr.forEach((item, index) => {
          if (index == nowIndex) {
            item
              .center(
                path.pointAt((1 / circleNum) * (index + 1) * length).x,
                path.pointAt((1 / circleNum) * (index + 1) * length).y
              )
              .fill(activeColor)
          } else {
            item
              .center(
                path.pointAt((1 / circleNum) * (index + 1) * length).x,
                path.pointAt((1 / circleNum) * (index + 1) * length).y
              )
              .fill(gradient)
          }
        })
      }
      let circles = document.querySelectorAll('circle')
      let prevX = width / 2 - cubeWidth
      circles.forEach((item, index) => {
        item.addEventListener('click', (e) => {
          circleArr.forEach((el, num) => {
            if (num != index) {
              el.animate(300).size(circleSize)
            }
          })
          nowIndex = index
          length = path.length()
          let x = path.pointAt((1 / circleNum) * (index + 1) * length).x
          let p = `M${pathMoveTo},h ${
            x -
              (x > prevX
                ? cubeWidth - circleSize / 2
                : cubeWidth + circleSize / 2) <=
            0
              ? 0
              : x -
                (x > prevX
                  ? cubeWidth - circleSize / 2
                  : cubeWidth + circleSize / 2)
          },c ${cubeWidth / 2},0 ${cubeWidth /
            2},-${cubeHeight} ${cubeWidth},-${cubeHeight},c ${cubeWidth /
            2},0 ${cubeWidth /
            2},${cubeHeight} ${cubeWidth},${cubeHeight},H ${width}`
          prevX = x

          path
            .animate(animationTime)
            .ease('<>')
            .during(function(pos) {
              circleArr[index]
                .size(
                  activeSize * pos <= circleSize ? circleSize : activeSize * pos
                )
                .attr({ fill: activeColor })
              setCircle()
            })
            .plot(p)
        })
      })
    },
  },
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
#app {
  width: 1200px;
  height: 100%;
  margin: 0 auto;
}
#svgbox {
  width: 100%;
  height: 100%;
}
</style>
```
