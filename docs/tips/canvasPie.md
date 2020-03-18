---
title: canvas饼状图
date: 2020-03-17
categories: article
author: Kamchan
tags:
  - Css
  - Javascript
  - Canvas
  - Echart
---

## 完整js代码

### `getPixelRatio`
获取设备DIP

因为我发现retain屏看起来是模糊的

所以要通过设备的DIP来对echart进行按比例缩放

```js
var getPixelRatio = function(context) {
  var backingStore =
    context.backingStorePixelRatio ||
    context.webkitBackingStorePixelRatio ||
    context.mozBackingStorePixelRatio ||
    context.msBackingStorePixelRatio ||
    context.oBackingStorePixelRatio ||
    context.backingStorePixelRatio ||
    1
  return (window.devicePixelRatio || 1) / backingStore
}

function toCanvas(arr) {
  let canvas = document.getElementById('myCanvas') //获取canvas
  let ctx = canvas.getContext('2d') //通过getContext获取画图的环境
  var ratio = getPixelRatio(ctx)
  canvas.style.width = canvas.width + 'px'
  canvas.style.height = canvas.height + 'px'
  canvas.width = canvas.width * ratio
  canvas.height = canvas.height * ratio
  ctx.scale(ratio, ratio);
  let cont = 0 //总数
  let start = 0 //起始弧度
  let x = 250,
    y = 250 //圆点坐标
  let startCoordinate = {
    start: 200,
    end: 100
  } //绘制起点坐标
  arr.forEach(item => {
    cont += item.number
  }) //获取number之和
  arr.forEach(item => {
    ctx.beginPath() //初始化路径
    let prop = item.number / cont //计算比例
    let radian = prop * (Math.PI * 2) //计算弧度
    ctx.arc(x, y, 100, start, start + radian, false) //根据比例和弧度画圆
    ctx.lineTo(x, y) //连接圆心画线
    ctx.fillStyle = item.color //设置圆弧颜色
    ctx.fill() //填充样式
    let x1 = x + Math.cos(radian / 2 + start) * 100 //获取圆弧中间点X坐标
    let y1 = y + Math.sin(radian / 2 + start) * 100 //获取圆弧中间点y坐标
    ctx.moveTo(x1, y1) //画笔移动到圆弧中点
    ctx.lineTo(
      x1 + 30 * Math.cos(radian / 2 + start),
      y1 + 30 * Math.sin(radian / 2 + start)
    ) //在圆弧中点和圆心的连线上画30单位长度的线
    let proNumber = null
    if (Math.cos(radian / 2 + start) > 0) {
      proNumber = 1
    } else {
      proNumber = -1
    } //判断起点半径与当前圆弧线所成角的余弦值是为负数/正数
    ctx.lineTo(
      x1 + 30 * Math.cos(radian / 2 + start) + proNumber * 30,
      y1 + 30 * Math.sin(radian / 2 + start)
    ) //在之前线的基础上画一条30单位长度的水平线
    ctx.fillText(
      item.name,
      x1 + 30 * Math.cos(radian / 2 + start) + proNumber * 20,
      y1 + 30 * Math.sin(radian / 2 + start) - 5,
      30
    ) //在线上填充字体，设置字体的坐标，最大长度
    ctx.strokeStyle = item.color //设置线条和字体的颜色
    ctx.font = 'bold 10px consolas' //设置字体的样式
    ctx.textAlign = 'center'
    start += radian //每次圆弧渲染完成将弧度累加作为下个圆弧的初始弧度
    ctx.stroke() //渲染线条
  })
  let small = new Path2D(ctx);//创建新的一个路径
  small.arc(x, y, 60, 0, Math.PI * 2, false);//画圆
  ctx.fillStyle = "#fff";//设置圆的颜色
  ctx.fill(small);//填充small
}
let arrs = [
  {
    name: '电子产品',
    color: '#CD853F',
    number: 500
  },
  {
    name: '网购',
    color: '#FFA500',
    number: 500
  },
  {
    name: '出行',
    color: '#FF4500',
    number: 200
  },
  {
    name: '饮食',
    color: '#8B0000',
    number: 300
  },
  {
    name: '水电',
    color: '#DAA520',
    number: 50
  }
]
this.toCanvas(arrs)
```
