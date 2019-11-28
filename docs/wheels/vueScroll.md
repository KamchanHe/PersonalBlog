---
title: 自封装Vue-Scroll
date: 2019-11-28
categories: article
author: Kamchan
tags:
  - Javascript
  - Vue
  - BetterScroll
  - Scroll
---

## 自封装 vue-scroll

### scroll.vue

```html
<template lang="html">
  <div
    class="yo-scroll"
    :class="{'down':(state===0),'up':(state==1),refresh:(state===2),touch:touching}"
    @touchstart="touchStart($event)"
    @touchmove="touchMove($event)"
    @touchend="touchEnd($event)"
    @scroll="(onInfinite || infiniteLoading) ? onScroll($event) : undefined"
  >
    <section
      class="inner"
      :style="{ transform: 'translate3d(0, ' + top + 'px, 0)' }"
    >
      <header class="pull-refresh">
        <slot name="pull-refresh">
          <span class="down-tip">下拉更新</span>
          <span class="up-tip">松开更新</span>
          <span class="refresh-tip">更新中……</span>
        </slot>
      </header>
      <slot></slot>
      <footer class="load-more">
        <slot name="load-more">
          <span>{{loadingText}}</span>
        </slot>
      </footer>
    </section>
  </div>
</template>

<script>
  export default {
    name: "kl-scroll",
    props: {
      offset: {
        type: Number,
        default: 40
      },
      loadingText: {
        type: String,
        default: "加载中..."
      },
      enableInfinite: {
        type: Boolean,
        default: true
      },
      enableRefresh: {
        type: Boolean,
        default: true
      },
      onRefresh: {
        type: Function,
        default: undefined,
        required: false
      },
      onInfinite: {
        type: Function,
        default: undefined,
        require: false
      }
    },
    data() {
      return {
        top: 0,
        state: 0,
        startY: 0,
        touching: false,
        infiniteLoading: false
      };
    },
    methods: {
      touchStart(e) {
        this.startY = e.targetTouches[0].pageY;
        this.startScroll = this.$el.scrollTop || 0;
        this.touching = true;
      },
      touchMove(e) {
        if (!this.enableRefresh || this.$el.scrollTop > 0 || !this.touching) {
          return;
        }
        let diff = e.targetTouches[0].pageY - this.startY - this.startScroll;
        if (diff > 0) e.preventDefault();
        this.top = Math.pow(diff, 0.8) + (this.state === 2 ? this.offset : 0);

        if (this.state === 2) {
          // in refreshing
          return;
        }
        if (this.top >= this.offset) {
          this.state = 1;
        } else {
          this.state = 0;
        }
      },
      touchEnd(e) {
        if (!this.enableRefresh) return;
        this.touching = false;
        if (this.state === 2) {
          // in refreshing
          this.state = 2;
          this.top = this.offset;
          return;
        }
        if (this.top >= this.offset) {
          // do refresh
          this.refresh();
        } else {
          // cancel refresh
          this.state = 0;
          this.top = 0;
        }
      },
      refresh() {
        this.state = 2;
        this.top = this.offset;
        this.onRefresh(this.refreshDone);
      },
      refreshDone() {
        this.state = 0;
        this.top = 0;
        this.infiniteLoading = false;
      },

      infinite() {
        this.infiniteLoading = true;
        this.onInfinite(this.infiniteDone);
      },

      infiniteDone() {
        this.infiniteLoading = false;
      },

      onScroll(e) {
        if (!this.enableInfinite || this.infiniteLoading) {
          return;
        }
        let outerHeight = this.$el.clientHeight;
        let innerHeight = this.$el.querySelector(".inner").clientHeight;
        let scrollTop = this.$el.scrollTop;
        let ptrHeight = this.onRefresh
          ? this.$el.querySelector(".pull-refresh").clientHeight
          : 0;
        let infiniteHeight = this.$el.querySelector(".load-more").clientHeight;
        let bottom = innerHeight - outerHeight - scrollTop - ptrHeight;
        if (bottom < infiniteHeight) this.infinite();
      }
    }
  };
</script>
<style>
  .yo-scroll {
    position: absolute;
    /* top: 2.5rem;  */
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    background-color: #f5f8fa;
  }
  .yo-scroll .inner {
    position: absolute;
    top: -2rem;
    width: 100%;
    transition-duration: 300ms;
  }
  .yo-scroll .pull-refresh {
    position: relative;
    left: 0;
    top: 0;
    width: 100%;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .yo-scroll.touch .inner {
    transition-duration: 0ms;
  }
  .yo-scroll.down .down-tip {
    display: block;
  }
  .yo-scroll.up .up-tip {
    display: block;
  }
  .yo-scroll.refresh .refresh-tip {
    display: block;
  }
  .yo-scroll .down-tip,
  .yo-scroll .refresh-tip,
  .yo-scroll .up-tip {
    display: none;
  }
  .yo-scroll .load-more {
    height: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
```

### 使用

```html
<template>
  <kl-scroll :on-refresh="onRefresh" :on-infinite="onInfinite">
    <div v-for="(item,index) in list" :key="index">
      {{item}}
    </div>
    <div slot="load-more">{{loadtext}}</div>
  </kl-scroll>
</template>
<script>
  import klScroll from "./components/HelloWorld.vue";

  export default {
    name: "app",
    data() {
      return {
        list: 50,
        loadtext: "加载更多"
      };
    },
    components: {
      klScroll
    },
    methods: {
      onRefresh(done) {
        setTimeout(() => {
          this.list = 10;
          done();
        }, 5000);
      },
      onInfinite(done) {
        setTimeout(() => (this.loadtext = "加载中"), 1000);
        setTimeout(() => {
          this.list = 100;
          this.loadtext = "加载完成";
          done();
        }, 5000);
      }
    }
  };
</script>
<style></style>
```

## vueScroll 插件

[VueScroll](https://vuescrolljs.yvescoding.org/zh/)

### 安装

    npm install vuescroll --save

### 全局注册

```js
// **main.js**
import Vue from "vue";
import vuescroll from "vuescroll";

// 你可以在这里设置全局配置
Vue.use(vuescroll, {
  ops: {}, // 在这里设置全局默认配置
  name: "myScroll" // 在这里自定义组件名字，默认是vueScroll
});
/*
 * 或者
 */
Vue.use(vuescroll); // install the vuescroll first
Vue.prototype.$vuescrollConfig = {
  bar: {
    background: "#000"
  }
};
```

### 局部注册

```html
<template>
  <vuescroll> <!-- 你的内容... --> </vuescroll>
</template>
<script>
  import vuescroll from "vuescroll";

  export default {
    components: {
      vuescroll
    }
  };
</script>
```

### 本地封装 vue-scroll.vue 组件

```html
<template>
  <div class="pr-wrap">
    <div class="wrap-part first">
      <vuescroll
        ref="vs"
        :ops="ops"
        @refresh-start="handleRS"
        @load-before-deactivate="handleLBD"
        @refresh-before-deactivate="handleRBD"
        @load-start="handleLoadStart"
      >
        <slot></slot>
        <div slot="load-deactive">1</div>
        <div slot="load-active">2</div>
        <div slot="load-start">3</div>
        <div slot="load-beforeDeactive" v-if="noData">
          没有更多了
        </div>
        <div slot="refresh-deactive">1</div>
        <div slot="refresh-active">2</div>
        <div slot="refresh-start">3</div>
        <div slot="refresh-beforeDeactive">4</div>
      </vuescroll>
    </div>
  </div>
</template>
<script>
  import vuescroll from "vuescroll";
  export default {
    props: {
      // 语言
      // zh|en
      lang: {
        default: "zh" // en
      },
      /*-------------vuescroll---------------*/
      // 选择一个模式
      // native|slide
      mode: {
        default: "slide"
      },
      // 如果父容器不是固定高度，请设置为 number , 否则保持默认即可
      // number|percent
      sizeStrategy: {
        default: "percent"
      },
      // 是否检测内容尺寸发生变化
      // blloeane
      detectResize: {
        default: true
      },
      // 下拉刷新
      pullRefresh: {
        default: () => {
          return {
            enable: true,
            tips: {
              deactive: "下拉刷新",
              active: "释放刷新",
              start: "刷新中...",
              beforeDeactive: "刷新成功!"
            }
          };
        }
      },
      // 上拉加载
      pushLoad: {
        default: () => {
          return {
            enable: true,
            tips: {
              deactive: "上拉加载",
              active: "释放加载",
              start: "加载中...",
              beforeDeactive: "加载成功!"
            },
            // 是否自动触发加载
            // boolean
            auto: false,
            // 距离底部触发自动加载的距离
            // number
            autoLoadDistance: 0
          };
        }
      },
      /*-------------vuescroll---------------*/
      /*-------------scrollPanel---------------*/
      // 只要组件mounted之后自动滚动的距离。 例如 100 or 10%
      // number|string||false
      initialScrollX: {
        default: false
      },
      initialScrollY: {
        default: false
      },
      // 是否启用 x 或者 y 方向上的滚动
      // blloeane
      scrollingX: {
        default: true
      },
      scrollingY: {
        default: true
      },
      // 多长时间内完成一次滚动。 数值越小滚动的速度越快
      // number
      speed: {
        default: 300
      },
      /*
        滚动动画， 所有的动画如下
        easeInQuad
        easeOutQuad
        easeInOutQuad
        easeInCubic
        easeOutCubic
        easeInOutCubic
        easeInQuart
        easeOutQuart
        easeInOutQuart
        easeInQuint
        easeOutQuint
        easeInOutQuint
         */
      easing: {
        default: undefined
      },
      // 原生滚动条的位置
      // right|left
      verticalNativeBarPos: {
        default: "right"
      },
      /*-------------scrollPanel---------------*/
      /*-------------rail---------------*/
      // 轨道的背景色
      // string
      backgroundRail: {
        default: "#a5d6a7"
      },
      // 轨道的尺寸
      // string
      sizeRail: {
        default: "6px"
      },
      // 轨道的透明度
      // number
      opacityRail: {
        default: 0
      },
      // 是否指定轨道的 borderRadius， 如果不那么将会自动设置
      // false|string
      specifyBorderRadiusRail: {
        default: false
      },
      // 轨道距 x 和 y 轴两端的距离
      // string
      gutterOfEndsRail: {
        default: "2px"
      },
      // 距离容器的距离
      // string
      gutterOfSideRail: {
        default: "2px"
      },
      // 是否即使 bar 不存在的情况下也保持显示
      // boolean
      keepShowRail: {
        default: false
      },
      // 轨道的边框
      // string
      borderRail: {
        default: "none"
      },
      /*-------------rail---------------*/
      /*-------------bar---------------*/
      // 是否只在滚动时显示 bar
      // boolean
      onlyShowBarOnScroll: {
        default: true
      },
      // 在鼠标离开容器后多长时间隐藏滚动条
      // number
      showDelay: {
        default: 500
      },
      // 滚动条背景色
      // string
      backgroundBar: {
        default: "#4caf50"
      },
      // 滚动条是否保持显示
      // boolean
      keepShowBar: {
        default: false
      },
      // 滚动条透明度
      // number
      opacityBar: {
        default: 1
      },
      // 是否指定滚动条的 borderRadius， 如果不那么和轨道的保持一致
      // false|string
      specifyBorderRadius: {
        default: false
      },
      // 为 bar 设置一个最小尺寸, 从 0 到 1. 如 0.3, 代表 30%
      // number
      minSize: {
        default: 0
      },
      // bar 的尺寸
      // string
      sizeBar: {
        default: "6px"
      },
      // 是否禁用滚动条
      // boolean
      disable: {
        default: false
      },
      /*-------------bar---------------*/
      // 是否开启下拉刷新
      isRefresh: {
        default: true
      },
      // 是否开启上拉加载
      isPushLoad: {
        default: true
      },
      // 数据是否全部加载完成 true为全部加载完成
      noData: {
        default: false
      },
      // 下拉刷新开始
      refreshStart: {
        default: () => {}
      },
      // 下拉刷新完成之后
      refreshDeactivate: {
        default: () => {}
      },
      // 上拉开始
      loadStart: {
        default: () => {}
      },
      // 上拉完成之后
      loadDeactivate: {
        default: () => {}
      }
    },
    components: { vuescroll },
    data() {
      const config = {};
      const ops = {
        vuescroll: {
          mode: this.mode,
          sizeStrategy: this.sizeStrategy,
          detectResize: this.detectResize,
          pullRefresh: this.pullRefresh,
          pushLoad: this.pushLoad
        },
        scrollPanel: {
          initialScrollX: this.initialScrollX,
          initialScrollY: this.initialScrollY,
          scrollingX: this.scrollingX,
          scrollingY: this.scrollingY,
          speed: this.speed,
          easing: this.easing,
          verticalNativeBarPos: this.verticalNativeBarPos
        },
        rail: {
          background: this.backgroundRail,
          size: this.sizeRail,
          opacity: this.opacityRail,
          specifyBorderRadius: this.specifyBorderRadiusRail,
          gutterOfEnds: this.gutterOfEndsRail,
          gutterOfSide: this.gutterOfSideRail,
          keepShow: this.keepShowRail,
          border: this.borderRail
        },
        bar: {
          onlyShowBarOnScroll: this.onlyShowBarOnScroll,
          showDelay: this.showDelay,
          background: this.backgroundBar,
          keepShow: this.keepShowBar,
          opacity: this.opacityBar,
          specifyBorderRadius: this.specifyBorderRadiusBar,
          minSize: this.minSize,
          size: this.sizeBar,
          disable: this.disable
        }
      };
      return {
        ops,
        config
      };
    },
    methods: {
      // 刷新开始
      // vsInstance vm===this
      // refreshDom === 刷新dom
      handleRS(vsInstance, refreshDom, done) {
        if (this.refreshStart) {
          this.refreshStart(done);
        } else {
          this.setDone(done);
        }
      },
      // 刷新完之后
      handleRBD(vm, loadDom, done) {
        if (this.refreshDeactivate) {
          this.refreshDeactivate(done);
        } else {
          setTimeout(() => {
            this.setDone(done);
          }, 600);
        }
      },
      // 上拉开始
      handleLoadStart(vm, dom, done) {
        if (this.loadStart) {
          this.loadStart(done);
        } else {
          this.setDone(done);
        }
      },
      // 上拉完成后
      handleLBD(vm, loadDom, done) {
        if (!this.$parent.noData) {
          if (this.loadDeactivate) {
            this.loadDeactivate(done);
          } else {
            setTimeout(() => {
              this.setDone(done);
            }, 600);
          }
        } else {
          setTimeout(() => {
            this.setDone(done);
          }, 600);
        }
      },
      // 手动触发 外部通过ref触发
      // type load 为加载   refresh 为刷新
      trigger(type = "load") {
        this.$refs["vs"].triggerRefreshOrLoad(type);
      },
      setDone(done) {
        done();
      }
    }
  };
</script>
<style scoped>
  .pr-wrap {
    display: flex;
    height: 100%;
    justify-content: center;
    width: 100%;
  }

  .wrap-part {
    height: 100%;
  }

  .wrap-part.first {
    width: 100%;
    height: 100%;
  }
</style>
```

### 在 vue 中使用

```html
<template>
  <div class="test">
    <vue-scroll
      :refreshStart="refreshStart"
      :loadStart="loadStart"
      :noData="noData"
    >
      <div class="rl-child child1"></div>
      <div class="rl-child child2"></div>
      <div class="rl-child child3"></div>
    </vue-scroll>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        noData: false //判断是否数据全部加载完成 true为全部加载完
      };
    },
    methods: {
      // 刷新开始
      refreshStart(done) {
        setTimeout(() => {
          // 这里写 ajax 业务请求，在数据请求到后执行 done() 关闭动画
          done();
        }, 1600);
      },
      // 加载开始
      loadStart(done) {
        setTimeout(() => {
          // 这里写 ajax 业务请求，在数据请求到后执行 done() 关闭动画
          done();
        }, 1600);
      }
    }
  };
</script>

<style scoped>
  html,
  body {
    height: 100%;
  }
  .test {
    height: 100%;
  }

  .rl-child {
    width: 100%;
    height: 500px;
  }

  .child1 {
    width: 100%;
    height: 500px;
    background-color: #43d2c6;
  }

  .child2 {
    background-color: #589be5;
  }

  .child3 {
    background-color: #f3b500;
  }
</style>
```
