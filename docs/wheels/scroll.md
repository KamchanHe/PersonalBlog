---
title: Vue-Scroll组件
date: 2019-11-20
categories: article
author: Kamchan
tags:
  - Javascript
  - Vue
  - BetterScroll
  - Scroll
---

## scroll.vue

```html
<template>
  <div class="wrapper" ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'

  export default {
    props: {
      /**************************** 基础功能 ******************************/
      /**
       * 横轴方向初始化位置。
       */
      startX: {
        type: Number,
        default: 0
      },
      /**
       * 纵轴方向初始化位置。
       */
      startY: {
        type: Number,
        default: 0
      },
      /**
       * 是否开启横向滚动
       * 当设置 eventPassthrough 为 'horizontal' 的时候，该配置无效。
       */
      scrollX: {
        type: Boolean,
        default: false
      },
      /**
       * 是否开启纵向滚动
       * 当设置 eventPassthrough 为 'vertical' 的时候，该配置无效。
       */
      scrollY: {
        type: Boolean,
        default: true
      },
      /**
       * 支持横向和纵向同时滚动，而不仅限制在某个方向
       * 当设置 eventPassthrough 不为空的时候，该配置无效。
       */
      freeScroll: {
        type: Boolean,
        default: false
      },
      /**
       * 有时候我们使用 better-scroll 在某个方向模拟滚动的时候，
       * 希望在另一个方向保留原生的滚动
       * 比如轮播图，我们希望横向模拟横向滚动，而纵向的滚动还是保留原生滚动，
       * 我们可以设置 eventPassthrough 为 vertical；
       * 相应的，如果我们希望保留横向的原生滚动，
       * 可以设置eventPassthrough为 horizontal。
       */
      eventPassthrough: {
        type: String,
        default: ''
      },
      /**
       * better-scroll 默认会阻止浏览器的原生 click 事件
       * 点击列表是否派发click事件
       */
      click: {
        type: Boolean,
        default: true
      },
      /**
       * 派发双击点击事件
       * 当配置成 true 的时候，默认 2 次点击的延时为 300 ms
       * 如果配置成对象可以修改 delay
       * dblclick: {delay: 300}
       */
      dblclick: {
        type: Boolean | Object,
        default: false
      },
      /**
       * 因为 better-scroll 会阻止原生的 click 事件
       * 我们可以设置 tap 为 true
       * 它会在区域被点击的时候派发一个 tap 事件
       * 你可以像监听原生事件那样去监听它
       * 如：element.addEventListener('tap', doSomething, false);
       * 如果 tap 设置为字符串, 那么这个字符串就作为自定义事件名称
       * 如 tap: 'myCustomTapEvent'
       */
      tap: {
        type: Boolean | String,
        default: false
      },
      /**
       * 当滚动超过边缘的时候会有一小段回弹动画。设置为 true 则开启动画。
       * bounce: {
       *  top: true,
       *  bottom: true,
       *  left: true,
       *  right: true
       * }
       */
      bounce: {
        type: Boolean | Object,
        default: true
      },
      /**
       * 设置回弹动画的动画时长。
       * 单位ms，不建议修改
       */
      bounceTime: {
        type: Number,
        default: 800
      },
      /**
       * 当快速在屏幕上滑动一段距离的时候，
       * 会根据滑动的距离和时间计算出动量，
       * 并生成滚动动画。
       * 设置为 true 则开启动画。
       */
      momentum: {
        type: Boolean,
        default: true
      },
      /**
       * 0 不派发scroll事件
       * 1 滚动的时候会派发scroll事件，会截流,屏幕滑动超过一定时间后再派发
       * 2 滚动的时候实时派发scroll事件，不会截流。
       * 3 除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
       */
      probeType: {
        type: Number,
        default: 1
      },
      /**
       * better-scroll 的实现会阻止原生的滚动，
       * 这样也同时阻止了一些原生组件的默认行为。
       * 这个时候我们不能对这些元素做 preventDefault，
       * 所以我们可以配置 preventDefaultException。
       * 默认值 {tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/}
       * 表示标签名为 input、textarea、button、select
       * 这些元素的默认行为都不会被阻止。
       * 这是一个非常有用的配置，
       * 它的 key 是 DOM 元素的属性值，
       * value 可以是一个正则表达式。
       * 比如我们想配一个 class 名称为 test 的元素，
       * 那么配置规则为 {className:/(^|\s)test(\s|$)/}。
       */
      preventDefaultException: {
        type: Object,
        default: () => {
          tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/
        }
      },
      /**
       * 一旦移动的过程中光标或手指离开滚动的容器，滚动会立刻停止。
       */
      bindToWrapper: {
        type: Boolean,
        default: false
      },
      /**
       * 是否派发滚动事件
       */
      listenScroll: {
        type: Boolean,
        default: false
      },
      /**
       * 列表的数据
       */
      data: {
        type: Array,
        default: null
      },
      /**
       * 是否派发滚动到底部的事件，用于上拉加载
       */
      pullup: {
        type: Boolean,
        default: false
      },
      /**
       * 是否派发顶部下拉的事件，用于下拉刷新
       */
      pulldown: {
        type: Boolean,
        default: false
      },
      /**
       * 是否派发列表滚动开始的事件
       */
      beforeScroll: {
        type: Boolean,
        default: false
      },
      /**
       * 当数据更新后，刷新scroll的延时。
       */
      refreshDelay: {
        type: Number,
        default: 20
      },

      /**************************** 高级功能 ******************************/
      /**
       * 这个配置是为了做 Picker 组件用的，默认为 false，如果开启则需要配置一个 Object。
       * wheel:{
       *  selectedIndex: 0,
       *  rotate: 25,
       *  adjustTime: 400,
       *  wheelWrapperClass: 'wheel-scroll',
       *  wheelItemClass: 'wheel-item',
       *  wheelDisabledItemClass: 'wheel-disabled-item'
       * }
       *
       * wheelWrapperClass 和 wheelItemClass
       * 必须对应于你的实例
       * better-scroll 的 wrapper 类名和 wrapper 内的子类名。
       * 二者的默认值是 "wheel-scroll"/"wheel-item"，
       * 如果你不配置或者配置的名称和你对应DOM节点的类名不一致的话会导致一个问题：
       * 滚动起来的时候点击一下终止滚动并不会触发 scrollEnd 事件，
       * 进而影响诸如城市选择器联动数据的这种组件的结果。
       *
       * wheelDisabledItemClass 是用于配置禁止选中某选项的样式类名。
       * better-scroll 实例上的属性 selectedIndex 是表示当前选中项的索引，
       * 如果你配置的选项都是禁止选中的状态，
       * 那么 selectedIndex 一直保持为 -1。
       */
      wheel: {
        type: Boolean | Object,
        default: false
      },
      /**
       * 这个配置是为了做 Slide 组件用的，默认为 false，如果开启则需要配置一个 Object
       * snap: {
       *  loop: false,
       *  threshold: 0.1,
       *  stepX: 100,
       *  stepY: 100,
       *  easing: {
       *    style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
       *    fn: function(t) {
       *      return t * (2 - t)
       *     }
       *    }
       *  }
       *
       * loop 为 true 是为了支持循环轮播，
       * 但只有一个元素的时候，
       * loop 为 true 是无效的，
       * 也并不会 clone 节点。
       * threshold 表示可滚动到下一个的阈值，
       * easing 表示滚动的缓动函数。
       */
      snap: {
        type: Boolean | Object,
        default: false
      },
      /**
       * 这个配置可以开启滚动条，默认为 false。
       * 当设置为 true 或者是一个 Object 的时候，都会开启滚动条
       * scrollbar: {
       *  fade: true,
       *  interactive: false // 1.8.0 新增
       * }
       *
       * fade 为 true 表示当滚动停止的时候滚动条是否需要渐隐，
       * interactive 表示滚动条是否可以交互。
       */
      scrollbar: {
        type: Boolean | Object,
        default: false
      },
      /**
       * 这个配置用于做下拉刷新功能，默认为 false。
       * 当设置为 true 或者是一个 Object 的时候，可以开启下拉刷新
       *
       * pullDownRefresh: {
       *  threshold: 50,
       *  stop: 20
       * }
       *
       * 可以配置顶部下拉的距离（threshold）
       * 来决定刷新时机以及回弹停留的距离（stop）。
       * 当下拉刷新数据加载完毕后，
       * 需要执行 finishPullDown 方法
       */
      pullDownRefresh: {
        ype: Boolean | Object,
        default: false
      },
      /**
       * 这个配置用于做上拉加载功能，默认为 false。
       * 当设置为 true 或者是一个 Object 的时候，可以开启上拉加载
       *
       * pullUpLoad: {
       *  threshold: 50
       * }
       * 可以配置离（threshold）来决定开始加载的时机。
       * 当上拉加载数据加载完毕后，需要执行 finishPullUp 方法
       */
      pullUpLoad: {
        ype: Boolean | Object,
        default: false
      }
    },
    mounted() {
      // 保证在DOM渲染完毕后初始化better-scroll
      this.$nextTick(() => {
        this._initScroll()
      })
    },
    methods: {
      _initScroll() {
        if (!this.$refs.wrapper) {
          return
        }
        // better-scroll的初始化
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click,
          scrollX: this.scrollX,
          pullDown: this.pullDown,
          pullUp: this.pullUp,
          pullDownRefresh: this.pullDownRefresh,
          pullUpLoad: this.pullUpLoad
        })

        // 是否派发滚动事件
        if (this.listenScroll) {
          this.scroll.on('scroll', pos => {
            this.$emit('scroll', pos)
          })
        }

        // 是否派发滚动到底部事件，用于上拉加载
        if (this.pullup) {
          this.scroll.on('scrollEnd', () => {
            // 滚动到底部
            if (this.scroll.y <= this.scroll.maxScrollY + 50) {
              this.$emit('scrollBottom')
            }
          })
        }

        // 是否派发顶部下拉事件，用于下拉刷新
        if (this.pulldown) {
          this.scroll.on('touchEnd', pos => {
            // 下拉动作
            if (pos.y > 50) {
              this.$emit('scrollTop')
            }
          })
        }

        // 是否派发列表滚动开始的事件
        if (this.beforeScroll) {
          this.scroll.on('beforeScrollStart', () => {
            this.$emit('beforeScroll')
          })
        }
      },
      //禁用 better-scroll，DOM 事件（如 touchstart、touchmove、touchend）的回调函数不再响应。
      disable() {
        // 代理better-scroll的disable方法
        this.scroll && this.scroll.disable()
      },
      //启用 better-scroll, 默认 开启。
      enable() {
        // 代理better-scroll的enable方法
        this.scroll && this.scroll.enable()
      },
      //立即停止当前运行的滚动动画。
      stop() {
        // 代理better-scroll的stop方法
        this.scroll && this.scroll.stop()
      },
      //重新计算 better-scroll，当 DOM 结构发生变化的时候务必要调用确保滚动的效果正常。
      refresh() {
        // 代理better-scroll的refresh方法
        this.scroll && this.scroll.refresh()
      },
      /**
       * 滚动到指定的位置
       * {Number} x 横轴坐标（单位 px）
       * {Number} y 纵轴坐标（单位 px）
       * {Number} time 滚动动画执行的时长（单位 ms）
       */
      scrollTo() {
        // 代理better-scroll的scrollTo方法
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      /**
       * 滚动到指定的目标元素
       * {DOM | String} el 滚动到的目标元素, 如果是字符串，则内部会尝试调用 querySelector 转换成 DOM 对象。
       * {Number} time 滚动动画执行的时长（单位 ms）
       * {Number | Boolean} offsetX 相对于目标元素的横轴偏移量，如果设置为 true，则滚到目标元素的中心位置
       * {Number | Boolean} offsetY 相对于目标元素的纵轴偏移量，如果设置为 true，则滚到目标元素的中心位置
       */
      scrollToElement() {
        // 代理better-scroll的scrollToElement方法
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      },
      scrollEnd() {
        // 代理better-scroll的scrollEnd方法 滑动结束
        this.scroll && this.scroll.scrollEnd.apply(this.scroll, arguments)
      }
    },
    watch: {
      // 监听数据的变化，延时refreshDelay时间后调用refresh方法重新计算，保证滚动效果正常
      data() {
        //方案一
        /**
         *setTimeout(() => {
         *  this.refresh()
         *}, this.refreshDelay)
         */

        //方案二
        this.$nextTick(() => {
          this.refresh()
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .wrapper {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
</style>
```

:::tip
使用方法
:::

## 组件中(竖向)

```html
<template>
  <scroll
    class="scroll-box"
    :listenScroll="true"
    @scroll="scroll"
    ref="scroll-box"
    :pullup="true"
    :pulldown="true"
    @scrollBottom="scrollBottom"
    @scrollTop="scrollTop"
    :pullDownRefresh="pullDownRefresh"
    :pullUpLoad="pullUpLoad"
  >
    ...
  </scroll>
</template>

<script>
  import Scroll from './scroll.vue'
  export default {
    data() {
      return {
        pullDownRefresh: {
          threshold: 50,
          stop: 20
        },
        pullUpLoad: {
          threshold: 50
        }
      }
    },
    components: {
      Scroll
    },
    methods: {
      scroll(pos) {
        console.log(pos) //{x:0,y:0}
      },
      scrollTop() {
        //下拉刷新
        //刷新完后要执行执行完成函数
        this.$refs.scrollBox.finishPullDown()
      },
      scrollBottom() {
        //上拉加载
        //刷新完后要执行执行完成函数
        this.$refs.scrollBox.finishPullUp()
      }
    }
  }
</script>

<style scoped>
  .scroll-box {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
</style>
```

## 组件中(横向)

```html
<template>
  <scroll
    :listenScroll="true"
    :scrollX="true"
    :scrollY="false"
    eventPassthrough="vertical"
    @scroll="scroll"
    ref="scroll-box"
  >
    <div ref="singer-scroll-box" class="singer-scroll-box">
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
    </div>
  </scroll>
</template>

<script>
  import Scroll from './scroll.vue'
  export default {
    data() {
      return {}
    },
    components: {
      Scroll
    },
    methods: {
      scroll(pos) {
        console.log(pos) //{x:0,y:0}
      }
    },
    mounted() {
      const length = this.$refs['singer-scroll-box'].children.length
      const width = this.$refs['singer-scroll-box'].children[0].offsetWidth
      this.$refs['singer-scroll-box'].style.width = length * width + 'px'
      this.$nextTick(() => {
        this.$refs['scroll-box']._initScroll()
      })
    }
  }
</script>

<style scoped>
  .scroll-box {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .singer-scroll-box {
    display: flex;
  }
</style>
```
