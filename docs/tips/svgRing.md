---
title: SVG实现进度圆环
date: 2020-05-06
categories: article
author: Kamchan
tags:
  - Javascript
  - HTML
  - SVG
  - Ring
---

## 上图 看效果

![svgRing](https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/ring/2020-05-06%2010.20.53.gif)

## 代码

```vue
<template>
  <div class="quota-ring" ref="ring">
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
      <defs>
        <linearGradient id="orange" x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="#F56612" />
          <stop offset="100%" stop-color="#FCAD01" />
        </linearGradient>
      </defs>
      <circle
        fill="none"
        stroke="#ccc"
        stroke-width="10"
        :stroke-dasharray="darkDasharray"
        :stroke-dashoffset="darkDashoffset"
      />
      <circle
        fill="none"
        stroke="url(#orange)"
        stroke-width="10"
        :stroke-dasharray="dasharray"
        :stroke-dashoffset="dashoffset"
        stroke-linecap="round"
      />
    </svg>
    //
    <div>
      // 设定好比圆环小的宽高 再用absolute定位到中间 就可以在圆环中间显示内容了
      //
    </div>
  </div>
</template>

<script>
export default {
  name: 'Quota',
  data() {
    return {
      dashoffset: 0, // 周长 控制圆圈进度的线条 x-0 相当于从0画到x
      dasharray: 0, // 圆圈的实现和虚线的长度
      darkDashoffset: 0, // 周长 灰色圆圈的线条 x-0 相当于从0画到x
      darkDasharray: 0, // 圆圈的实现和虚线的长度
      totalOffset: 0, // 保存原始周长 计算当前进度用
    }
  },
  mounted() {
    // 用的rem 所以移动端下 每次都要获取当前的宽度来计算圆环的周长
    let width = this.$refs.ring.offsetWidth
    let r = (width - 20) / 2
    let circle = (2 * Math.PI * r).toFixed(0)
    this.dasharray = circle
    this.darkDasharray = circle
    this.dashoffset = circle
    this.totalOffset = circle
    this.getTotalQuota()
  },
  methods: {
    getTotalQuota() {
      // 请求接口获取要渲染的数据
      this.total = res.data.data.total || 0 // 总数量
      this.available = res.data.data.balance || 0 // 剩余数量
      this.circleAnime()
    },
    circleAnime() {
      // 比例为 剩余数量/总数量
      let scale = (this.available / this.total).toFixed(2)
      // 求出比例 用总周长*(1-比例) 则就是要宣传到的位置
      let animeOffset = this.totalOffset * (1 - scale)
      this.dashoffset = animeOffset
      // 缓慢加载动画
      let total = this.totalOffset
      let speed = animeOffset / 25
      clearInterval(this.circleAnimeTimer)
      this.circleAnimeTimer = null
      this.circleAnimeTimer = setInterval(() => {
        total = total - speed
        this.dashoffset = total
        if (this.dashoffset <= animeOffset) {
          clearInterval(this.circleAnimeTimer)
        }
      }, 20)
    },
  },
}
</script>

<style lang="scss" scoped>
.quota {
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  padding-bottom: rem(50);
  &-ring {
    width: rem(180);
    height: rem(180);
    position: relative;
    margin: rem(30) auto;
    svg {
      position: absolute;
      z-index: 2;
      width: rem(180);
      height: rem(180);
      top: 0;
      left: 50%;
      transform: translateX(-50%) rotate(-90deg);
      circle {
        cx: rem(90);
        cy: rem(90);
        r: rem(80);
        // transition: all 1s;
      }
    }
    &-info {
      width: rem(160);
      height: rem(160);
      border-radius: 50%;
      position: absolute;
      left: rem(10);
      top: rem(10);
      p {
        font-size: rem(14);
        font-weight: 500;
        color: rgba(43, 43, 43, 1);
      }
      span {
        font-size: rem(30);
        font-weight: 500;
        color: rgba(43, 43, 43, 1);
      }
    }
  }
}
</style>
```
