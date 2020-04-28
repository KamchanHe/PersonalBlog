---
title: 数字递增动画
date: 2020-04-27
categories: article
author: Kamchan
tags:
  - Javascript
  - Vue
  - Counter
---

## 效果

![counter](https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/counter.gif)

:::tip
改自 jQuery.counter.js

jQuery.counter.js有配套的滚动到对应位置再动画的插件jQuery.waypoint.js
:::

## 代码

### Counter.vue

```html
<template>
  <div class="counter">
    <span>{{ num }}</span>
  </div>
</template>

<script>
  export default {
    name: 'Counter',
    props: {
      // 动画时长
      time: {
        type: String | Number,
        default: 2000,
      },
      // 每次增加等待的时间
      delay: {
        type: String | Number,
        default: 10,
      },
      // 要动画的数字
      content: {
        type: String | Number,
        default: 0,
      },
    },
    data() {
      return {
        // 默认时间
        defaultTime: 2000,
        // 默认间隔
        defaultDelay: 10,
        // 保存 从0=>目标数字 要经历的所有数字
        nums: [],
        // 显示的数字
        num: 0,
      }
    },
    mounted() {
      // TODO: 这里可以自己传入dom来控制一进来就动画还是滚动到某个dom元素再动画
      this.counterUpper()
    },
    methods: {
      counterUpper() {
        // 如果传入时间则用传入的 否则用默认的
        this.defaultTime =
          parseInt(this.time) > 0 ? parseInt(this.time) : this.defaultTime
        // 如果传入间隔则用传入的 否则用默认的
        this.defaultDelay =
          parseInt(this.delay) > 0 ? parseInt(this.delay) : this.defaultDelay
        // 时长/间隔 = 要变化的次数    2秒/10秒间隔 = 变化200次
        let divisions = this.defaultTime / this.defaultDelay
        let num = this.content || 0
        // 保存传入的数字在最后一位
        this.nums = [num]
        // 是否有逗号
        let isComma = /[0-9]+,[0-9]+/.test(num)
        num = num.toString()
        num = num.replace(/,/g, '')
        // 是否是蒸熟
        let isInt = /^[0-9]+$/.test(num)
        // 是否是小数
        let isFloat = /^[0-9]+\.[0-9]+$/.test(num)
        // 小数点位数
        let decimalPlaces = isFloat ? (num.split('.')[1] || []).length : 0
        // 要变化多少次就循环多少次 把每一次变化对应的数字放入数组nums
        for (let i = divisions; i >= 1; i--) {
          // 让数子按比例变化
          let newNum = parseInt(Math.round((num / divisions) * i))
          // 同步显示传入数字的小数点后的位数
          if (isFloat) {
            newNum = parseFloat((num / divisions) * i).toFixed(decimalPlaces)
          }
          // 按逗号格式转回对应的格式
          if (isComma) {
            while (/(\d+)(\d{3})/.test(newNum.toString())) {
              newNum = newNum
                .toString()
                .replace(/(\d+)(\d{3})/, '$1' + ',' + '$2')
            }
          }
          // 往前插 因为遍历这个数组从第一个显示到最后一个 最后一个是目标数字
          this.nums.unshift(newNum)
        }
        // 执行第一次
        setTimeout(this.f, this.defaultDelay)
      },
      f() {
        // 执行一次就把数组抽出来
        this.num = this.nums.shift()
        if (this.nums.length) {
          // 每一个数组创建一个定时器延时执行
          setTimeout(this.f, this.defaultDelay)
        } else {
          // 遍历完了 就清空数组
          delete this.nums
          this.nums = []
        }
      },
    },
  }
</script>

<style lang="scss" scoped></style>
```

### 使用

```html
<template>
  <div id="app">
    <Counter :content="'1,2356,32.96'" :time="2000" :delay="10"></Counter>
    <Counter :content="'96'" :time="2000" :delay="10"></Counter>
    <Counter :content="'1846.88'" :time="2000" :delay="10"></Counter>
  </div>
</template>

<script>
  import Counter from './components/Counter'
  export default {
    name: 'App',
    components: {
      Counter,
    },
  }
</script>

<style lang="scss"></style>
```
