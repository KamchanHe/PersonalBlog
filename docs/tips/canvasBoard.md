---
title: canvas画板
date: 2020-03-17
categories: article
author: Kamchan
tags:
  - Css
  - Javascript
  - Canvas
---

## 完整代码

:::tip
移动端设备会上下移动画面

需要使用overflow:hidden
:::

```js
let isDown = false
let points = []
let beginPoint = null
const canvas = document.querySelector('#myCanvas')
const ctx = canvas.getContext('2d')

// 设置线条颜色
ctx.strokeStyle = 'red'
ctx.lineWidth = 1
ctx.lineJoin = 'round'
ctx.lineCap = 'round'

canvas.addEventListener('touchstart', down, false)
canvas.addEventListener('touchmove', move, false)
canvas.addEventListener('touchend', up, false)

function down(evt) {
  isDown = true
  const { x, y } = getPos(evt)
  points.push({ x, y })
  beginPoint = { x, y }
}

function move(evt) {
  if (!isDown) return

  const { x, y } = getPos(evt)
  points.push({ x, y })

  if (points.length > 3) {
    const lastTwoPoints = points.slice(-2)
    const controlPoint = lastTwoPoints[0]
    const endPoint = {
      x: (lastTwoPoints[0].x + lastTwoPoints[1].x) / 2,
      y: (lastTwoPoints[0].y + lastTwoPoints[1].y) / 2
    }
    drawLine(beginPoint, controlPoint, endPoint)
    beginPoint = endPoint
  }
}

function up(evt) {
  if (!isDown) return
  const { x, y } = getPos(evt)
  points.push({ x, y })

  if (points.length > 3) {
    const lastTwoPoints = points.slice(-2)
    const controlPoint = lastTwoPoints[0]
    const endPoint = lastTwoPoints[1]
    drawLine(beginPoint, controlPoint, endPoint)
  }
  beginPoint = null
  isDown = false
  points = []
}

function getPos(evt) {
  return {
    x: evt.changedTouches[0].clientX,
    y: evt.changedTouches[0].clientY
  }
}

function drawLine(beginPoint, controlPoint, endPoint) {
  ctx.beginPath()
  ctx.moveTo(beginPoint.x, beginPoint.y)
  ctx.quadraticCurveTo(controlPoint.x, controlPoint.y, endPoint.x, endPoint.y)
  ctx.stroke()
  ctx.closePath()
}
```
