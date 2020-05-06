---
title: Canvas实现进度圆环
date: 2020-05-06
categories: article
author: Kamchan
tags:
  - Javascript
  - HTML
  - Canvas
  - Ring
---

## 看效果

![canvasRing](https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/ring/2020-05-06%2010.24.26.gif)

## 组件

```vue
<template>
  <canvas ref="canvasDemo" :width="canvasSize" :height="canvasSize" />
</template>

<script>
import BezierEasing from 'bezier-easing'
export default {
  name: 'VueAwesomeProgress',
  props: {
    startDeg: {
      type: Number,
      default: 270,
      validator: function(value) {
        return value >= 0 && value < 360
      },
    },
    percentage: {
      type: Number,
      default: 0,
      validator: function(value) {
        return value >= 0 && value <= 100
      },
    },
    circleRadius: {
      type: Number,
      default: 40,
    },
    circleWidth: {
      type: Number,
      default: 2,
    },
    circleColor: {
      type: String,
      default: '#e5e5e5',
    },
    lineWidth: {
      type: Number,
      default: 8,
    },
    useGradient: {
      type: Boolean,
      default: true,
    },
    lineColor: {
      type: String,
      default: '#3B77E3',
    },
    lineColorStops: {
      type: Array,
      default: function() {
        return [
          { percent: 0, color: '#F56612' },
          { percent: 1, color: '#FCAD01' },
        ]
      },
    },
    showText: {
      type: Boolean,
      default: true,
    },
    fontSize: {
      type: Number,
      default: 14,
    },
    fontColor: {
      type: String,
      default: '#444',
    },
    pointRadius: {
      type: Number,
      default: 6,
    },
    pointColor: {
      type: String,
      default: '#3B77E3',
    },
    animated: {
      type: Boolean,
      default: true,
    },
    easing: {
      type: String,
      // ease-in
      default: '0.42,0,1,1',
      validator: function(value) {
        return /^(\d+(\.\d+)?,){3}\d+(\.\d+)?$/.test(value)
      },
    },
    duration: {
      type: Number,
      // 浏览器大约是60FPS，因此1s大约执行60次requestAnimationFrame
      default: 0.6,
    },
    format: {
      type: Function,
    },
  },
  data() {
    return {
      gradient: null,
      easingFunc: null,
      animationId: null,
      canvasInstance: null,
      ctx: null,
    }
  },
  computed: {
    // 外围半径
    outerRadius() {
      return this.pointRadius > 0
        ? this.circleRadius + this.pointRadius
        : this.circleRadius + this.lineWidth / 2
    },
    // 画布大小
    canvasSize() {
      return 2 * this.outerRadius + 'px'
    },
    // 执行的总步数
    steps() {
      return this.duration * 60
    },
  },
  watch: {
    percentage(val, oldVal) {
      if (val >= 0 && val <= 100) {
        window.cancelAnimationFrame(this.animationId)
        // 更新进度条的时候，直接给定0.3s时间，即18帧
        this.animateDrawArc(oldVal, val, 1, 18)
      } else {
        throw new Error('进度百分比的范围必须在1~100内')
      }
    },
  },
  mounted() {
    const easingParams = this.easing.split(',').map((item) => Number(item))
    this.easingFunc = BezierEasing(...easingParams)
    this.$nextTick(() => {
      this.initCanvas()
    })
  },
  beforeDestroy() {
    window.cancelAnimationFrame(this.animationId)
  },
  methods: {
    // 获取设备DIP
    getPixelRatio(context) {
      var backingStore =
        context.backingStorePixelRatio ||
        context.webkitBackingStorePixelRatio ||
        context.mozBackingStorePixelRatio ||
        context.msBackingStorePixelRatio ||
        context.oBackingStorePixelRatio ||
        context.backingStorePixelRatio ||
        1
      return (window.devicePixelRatio || 1) / backingStore
    },
    // 初始化canvas
    initCanvas() {
      this.canvasInstance = this.$refs.canvasDemo
      this.ctx = this.canvasInstance.getContext('2d')
      let ratio = this.getPixelRatio(this.ctx)
      this.canvasInstance.style.width = this.canvasInstance.width + 'px'
      this.canvasInstance.style.height = this.canvasInstance.height + 'px'
      this.canvasInstance.width = this.canvasInstance.width * ratio
      this.canvasInstance.height = (this.canvasInstance.height + 5) * ratio
      this.ctx.scale(ratio, ratio)
      // 设置渐变色
      if (this.useGradient) {
        this.gradient = this.ctx.createLinearGradient(
          this.circleRadius,
          0,
          this.circleRadius,
          this.circleRadius * 2
        )
        this.lineColorStops.forEach((item) => {
          this.gradient.addColorStop(item.percent, item.color)
        })
      }
      if (this.percentage === 0) {
        this.animateDrawArc(0, 0, 0, 0)
      } else {
        if (this.animated) {
          // 用动画来画动态内容
          this.animateDrawArc(0, this.percentage, 1, this.steps)
        } else {
          this.animateDrawArc(0, this.percentage, this.steps, this.steps)
        }
      }
    },
    // 利用raf控制动画绘制
    animateDrawArc(beginPercent, endPercent, stepNo, stepTotal) {
      this.ctx.clearRect(
        0,
        0,
        this.canvasInstance.clientWidth,
        this.canvasInstance.clientHeight
      )
      const nextPercent =
        beginPercent + ((endPercent - beginPercent) * stepNo) / stepTotal
      const nextDeg = this.getTargetDegByPercentage(nextPercent)
      const startArc = this.deg2Arc(this.startDeg)
      const nextArc = this.deg2Arc(nextDeg)
      // 画圆环
      this.ctx.strokeStyle = this.circleColor
      this.ctx.lineWidth = this.circleWidth
      this.ctx.lineCap = 'round'
      this.ctx.beginPath()
      this.ctx.arc(
        this.outerRadius,
        this.outerRadius,
        this.circleRadius,
        0,
        this.deg2Arc(360)
      )
      this.ctx.stroke()
      // 画文字
      if (this.showText) {
        this.ctx.font = `${this.fontSize}px Arial,"Microsoft YaHei"`
        this.ctx.fillStyle = this.fontColor
        this.ctx.textAlign = 'center'
        this.ctx.textBaseline = 'middle'
        let label
        if (typeof this.format === 'function') {
          label = this.format(nextPercent)
        } else {
          label = Math.round(nextPercent) + '%'
        }
        this.ctx.fillText(
          label,
          this.canvasInstance.clientWidth / 2,
          this.canvasInstance.clientWidth / 2
        )
      }
      // 画进度弧线
      if (stepTotal > 0) {
        this.ctx.strokeStyle = this.useGradient ? this.gradient : this.lineColor
        this.ctx.lineWidth = this.lineWidth
        this.ctx.beginPath()
        this.ctx.arc(
          this.outerRadius,
          this.outerRadius,
          this.circleRadius,
          startArc,
          nextArc
        )
        this.ctx.stroke()
      }
      // 画点
      if (this.pointRadius > 0) {
        this.ctx.fillStyle = this.pointColor
        const pointPosition = this.getPositionsByDeg(nextDeg)
        this.ctx.beginPath()
        this.ctx.arc(
          pointPosition.x + this.pointRadius,
          pointPosition.y + this.pointRadius,
          this.pointRadius,
          0,
          this.deg2Arc(360)
        )
        this.ctx.fill()
      }
      if (stepNo !== stepTotal) {
        stepNo++
        this.animationId = window.requestAnimationFrame(
          this.animateDrawArc.bind(
            null,
            beginPercent,
            endPercent,
            stepNo,
            stepTotal
          )
        )
      } else {
        window.cancelAnimationFrame(this.animationId)
      }
    },
    // 根据开始角度和进度百分比求取目标角度
    getTargetDegByPercentage(percentage) {
      if (percentage === 100) {
        return this.startDeg + 360
      } else {
        const targetDeg = (this.startDeg + (360 * percentage) / 100) % 360
        return targetDeg
      }
    },
    // 根据角度获取点的位置
    getPositionsByDeg(deg) {
      let x = 0
      let y = 0
      if (deg >= 0 && deg <= 90) {
        // 0~90度
        x = this.circleRadius * (1 + Math.cos(this.deg2Arc(deg)))
        y = this.circleRadius * (1 + Math.sin(this.deg2Arc(deg)))
      } else if (deg > 90 && deg <= 180) {
        // 90~180度
        x = this.circleRadius * (1 - Math.cos(this.deg2Arc(180 - deg)))
        y = this.circleRadius * (1 + Math.sin(this.deg2Arc(180 - deg)))
      } else if (deg > 180 && deg <= 270) {
        // 180~270度
        x = this.circleRadius * (1 - Math.sin(this.deg2Arc(270 - deg)))
        y = this.circleRadius * (1 - Math.cos(this.deg2Arc(270 - deg)))
      } else {
        // 270~360度
        x = this.circleRadius * (1 + Math.cos(this.deg2Arc(360 - deg)))
        y = this.circleRadius * (1 - Math.sin(this.deg2Arc(360 - deg)))
      }
      return { x, y }
    },
    // deg转弧度
    deg2Arc(deg) {
      return (deg / 180) * Math.PI
    },
  },
}
</script>
```

## 使用

```vue
<template>
  <div class="agreement">
    <vue-awesome-progress
      circle-color="#e5e9f2"
      :circle-width="10"
      :circle-radius="circleRadius"
      :line-width="10"
      :duration="1"
      :start-deg="270"
      :percentage="80"
      :show-text="false"
      :point-radius="0"
      easing="0,0,1,1"
    />
  </div>
</template>

<script>
import VueAwesomeProgress from '@/components/VueAwesomeProgress/VueAwesomeProgress'
export default {
  name: 'Agreement',
  data() {
    return {
      circleRadius: 0,
    }
  },
  components: {
    VueAwesomeProgress,
  },
  mounted() {
    this.circleRadius = (document.body.clientWidth / 375) * 85
  },
}
</script>

<style lang="scss" scoped></style>
```

## 简单版

```html
<div class="pie">
  <canvas
    id="canvas"
    width="960"
    height="960"
    style="width: 960px; height: 960px;"
  ></canvas>
</div>
```

```css
.pie {
  width: 960px;
  height: 960px;
  margin: 0 auto;
}
```

```js
const ctx = document.getElementById('canvas').getContext('2d')
//外圆环
ctx.beginPath()
ctx.arc(480, 480, 480, 0, 2 * Math.PI)
ctx.strokeStyle = '#fff'
ctx.fillStyle = '#EDEDED'
ctx.fill()
ctx.stroke()
//内圆环
ctx.beginPath()
ctx.arc(480, 480, 420, 0, 2 * Math.PI)
ctx.strokeStyle = '#fff'
ctx.fillStyle = '#fff'
ctx.fill()
ctx.stroke()
//环形图的进度条
let precent = 0
this.timer = setInterval(() => {
  precent += 0.01
  ctx.beginPath()
  ctx.arc(
    480,
    480,
    450,
    -Math.PI / 2,
    -Math.PI / 2 + precent * (Math.PI * 2),
    false
  )
  ctx.lineWidth = 60
  ctx.lineCap = 'round'
  ctx.strokeStyle = 'rgb(255, 127, 105)'
  ctx.stroke()
  if (precent >= 0.7) {
    clearInterval(this.timer)
  }
}, 20)
```

## 进阶版

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Document</title>
  </head>
  <style>
    html,
    body {
      background: #273341;
    }
    #mycanvas {
    }
    .pie {
      width: 960px;
      height: 960px;
      margin: 0 auto;
    }
    img {
      width: 100%;
      display: none;
    }
    .economy {
      text-align: center;
      transform: rotate(45deg);
      color: #fff;
      font-family: '微软雅黑';
      font-size: 14px;
    }
  </style>
  <body>
    <div class="pie">
      <canvas
        id="canvas"
        width="960"
        height="960"
        style="width: 960px; height: 960px;"
      ></canvas>
    </div>
    <!-- canvas的画布宽高（分辨率）是width和height，而style中的宽高是canvas在页面中显示的宽高，画布分辨率越高，绘制出来的图任意缩放也不会出现很大的锯齿 -->
  </body>
  <script>
    var canvas = document.getElementById('canvas')
    var r2 = 380,
      r1 = 480
    var ctx = canvas.getContext('2d')
    if (canvas.getContext) {
      var circle = { x: 480, y: 480, radius: 442 }
      var smccircle = { x: 480, y: 480, radius: 342 }
      //背景色
      ctx.fillStyle = '#273341'
      ctx.fillRect(0, 0, 960, 960)
      ctx.fill()
      //外彩色扇形背景圆1
      ites(0, 360, 480, '#323d4b')
      //彩色外扇叶
      ites(0, 30, r1, '#4c17e2') //>0
      ites(45, 55, r1, '#1777e2') //>45
      ites(90, 110, r1, '#17cde2') //>90
      ites(135, 146, r1, '#3fc371') //>135
      ites(180, 198, r1, '#ffbc3a') //>180
      ites(225, 231, r1, '#e27217') //>225
      ites(270, 290, r1, '#e217a1') //>270
      ites(315, 335, r1, '#b017e2') //>315&<360
      //内覆盖扇形背景圆1
      ites(0, 360, 400, '#273341')

      //彩色内扇叶
      ites(0, 45, r2, '#4c17e2')
      ites(45, 90, r2, '#1777e2')
      ites(90, 135, r2, '#17cde2')
      ites(135, 180, r2, '#3fc371')
      ites(180, 225, r2, '#ffbc3a')
      ites(225, 270, r2, '#e27217')
      ites(270, 315, r2, '#e217a1')
      ites(315, 360, r2, '#b017e2')

      //内覆盖扇形背景圆2
      ites(0, 360, 300, '#273341')
      //交叉背景线
      line(0, 480, 960, 480)
      line(480, 0, 480, 960)
      line(0, 0, 960, 960)
      line(960, 0, 0, 960)

      ctx.arc(480, 480, r2, 0, rads(45), false)
      ctx.save()
      //头像边框
      drawCircularText(smccircle, '水分', rads(18), rads(28), 'center')
      drawCircularText(smccircle, '蛋白质', rads(58), rads(78), 'center')
      drawCircularText(smccircle, '内脏脂肪', rads(98), rads(127), 'center')
      drawCircularText(smccircle, '骨骼', rads(153), rads(163), 'center')
      drawCircularText(smccircle, '基础代谢', rads(188), rads(216), 'center')
      drawCircularText(smccircle, 'BMI', rads(241), rads(253), 'center')
      drawCircularText(smccircle, '脂肪', rads(287), rads(298), 'center')
      drawCircularText(smccircle, '肌肉', rads(333), rads(343), 'center')

      ctx.restore()
      var v = 'left'
      drawCircularText(circle, '60.5%', rads(24), rads(38), v)
      drawCircularText(circle, '17.8%', rads(69), rads(83), v)
      drawCircularText(circle, '    6', rads(114), rads(130), v)
      drawCircularText(circle, '  4.3', rads(159), rads(175), v)
      drawCircularText(circle, ' 1570', rads(204), rads(220), v)
      drawCircularText(circle, ' 21.6', rads(249), rads(265), v)
      drawCircularText(circle, '17.1%', rads(294), rads(308), v)
      drawCircularText(circle, '55.5%', rads(339), rads(353), v)
      // Create a circular clipping path
      ctx.translate(480, 480)
      ctx.beginPath()
      ctx.arc(0, 0, 160, 0, Math.PI * 2, true)
      ctx.closePath()
      ctx.strokeStyle = '#ffbc3a'
      ctx.lineWidth = 16
      ctx.stroke()
      ctx.clip()
      var img = new Image()
      img.src = 'css/img/head.png'
      img.onload = function() {
        ctx.drawImage(img, -160, -160, 320, 320)
      }
    }
    //转换弧度
    function rads(x) {
      return (Math.PI * x) / 180
    }
    //圆
    function ites(a, b, r, color) {
      ctx.beginPath()
      ctx.moveTo(480, 480)
      ctx.arc(480, 480, r, rads(a), rads(b), false)
      ctx.closePath()
      ctx.fillStyle = color
      ctx.fill()
    }
    //线
    function line(a, b, c, d) {
      ctx.beginPath()
      ctx.moveTo(a, b)
      ctx.lineTo(c, d)
      ctx.strokeStyle = '#273341'
      ctx.closePath()
      ctx.lineWidth = 10
      ctx.stroke()
    }
    function siner(a, b, deg, font) {
      ctx.save()
      ctx.fillStyle = '#fff'
      ctx.textAlign = 'center'
      ctx.font = '48px 微软雅黑'
      ctx.translate(a, b)
      ctx.rotate(rads(deg))
      ctx.fillText(font, 0, 0)
      ctx.restore()
    }

    function drawCircularText(s, string, startAngle, endAngle, lv) {
      var radius = s.radius,
        angleDecrement = (startAngle - endAngle) / (string.length - 1),
        angle = parseFloat(startAngle),
        index = 0,
        character

      ctx.save()

      ctx.fillStyle = 'white'
      ctx.font = '40px 微软雅黑'
      ctx.textAlign = lv
      ctx.textBaseline = 'middle'

      while (index < string.length) {
        character = string.charAt(index)

        ctx.save()
        ctx.beginPath()
        ctx.translate(
          s.x + Math.cos(angle) * radius,
          s.y + Math.sin(angle) * radius
        )
        ctx.rotate(Math.PI / 2 + angle)

        ctx.fillText(character, 0, 0)
        //            ctx.strokeText(character, 0, 0);

        angle -= angleDecrement
        index++
        ctx.restore()
      }
      ctx.restore()
    }

    // //H绘制圆形头像
    // var ctx = document.getElementById('canvas').getContext('2d')
    // ctx.fillRect(0, 0, 240, 240)
    // ctx.translate(120, 120)

    // // Create a circular clipping path
    // ctx.beginPath()
    // ctx.arc(0, 0, 40, 0, Math.PI * 2, true)
    // ctx.clip()

    // // draw background
    // var lingrad = ctx.createLinearGradient(0, -240, 0, 240)
    // lingrad.addColorStop(0, '#232256')
    // lingrad.addColorStop(1, '#143778')

    // ctx.fillStyle = lingrad
    // ctx.fillRect(-75, -75, 150, 150)
    // var img = new Image()
    // img.src = 'css/img/head.jpg'
    // img.onload = function () {
    //   ctx.drawImage(img, -40, -40, 80, 80)
    // }
  </script>
</html>
```
