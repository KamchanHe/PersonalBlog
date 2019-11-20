---
title: Vue-progress
date: 2019-11-20
categories: article
author: Kamchan
tags:
  - Javascript
  - Vue
---

progress.vue

```html
<template>
  <div class="progress-bar" ref="progressBar">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div
        class="progress-btn-wrapper"
        ref="progressBtn"
        @touchstart.prevent="progressTouchStart"
        @touchmove.prevent="progressTouchMove"
        @touchend="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
  export default {
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    methods: {
      _offset(width) {
        this.$refs.progress.style.width = width + "px";
        this.$refs.progressBtn.style.transform = `translate3d(${width}px,0,0)`;
      },
      progressTouchStart(e) {
        this.touch.initiated = true;
        this.touch.startX = e.touches[0].pageX;
        this.touch.left = this.$refs.progress.clientWidth;
      },
      progressTouchMove(e) {
        if (!this.touch.initiated) {
          return;
        }
        const deltaX = e.touches[0].pageX - this.touch.startX;
        // const offsetWidth=this.touch.startX+deltaX-this.$refs.progressBar.offsetLeft;
        // this._offset(offsetWidth);
        const offsetWidth = Math.min(
          Math.max(0, this.touch.left + deltaX),
          this.$refs.progressBar.clientWidth -
            this.$refs.progressBtn.clientWidth +
            14
        );
        this._offset(offsetWidth);
      },
      progressTouchEnd(e) {
        this.touch.initiated = false;
        this.$emit(
          "percentChange",
          this.$refs.progress.clientWidth /
            (this.$refs.progressBar.clientWidth -
              this.$refs.progressBtn.clientWidth)
        );
      }
    },
    created() {
      this.touch = {};
    },
    watch: {
      percent(newPercent) {
        if (newPercent >= 0 && !this.touch.initiated) {
          const barWidth =
            this.$refs.progressBar.clientWidth -
            this.$refs.progressBtn.clientWidth;
          const offsetWidth = barWidth * newPercent;
          this._offset(offsetWidth);
        }
      }
    }
  };
</script>

<style scoped>
  .progress-bar {
    height: 30px;
  }
  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);
  }
  .progress {
    position: absolute;
    height: 100%;
    background: #ffcd32;
  }
  .progress-btn-wrapper {
    position: absolute;
    left: -8px;
    top: -13px;
    width: 30px;
    height: 30px;
  }
  .progress-btn {
    position: relative;
    top: 7px;
    left: 7px;
    box-sizing: border-box;
    width: 16px;
    height: 16px;
    border: 3px solid $color-text;
    border-radius: 50%;
    background: #ffcd32;
  }
</style>
```

:::tip
使用方法
:::

```html
<template>
  <div>
    <progress :percent="percent" @percentChange="percentChange"></progress>
  </div>
</template>

<script>
  import Progress from "./progress";
  export default {
    components: {
      Progress
    },
    methods: {
      percentChange(percent) {
        this.currentTime = '当前媒体资源总时长' * percent;
        this.$refs['媒体控件'] = this.currentTime;
      }
    },
    computed: {
      percent() {
        return "媒体资源当前进度" / "媒体资源总时长";
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
```
