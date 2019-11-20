---
title: Vue-Slider组件
date: 2019-11-20
categories: article
author: Kamchan
tags:
  - Javascript
  - Vue
  - BetterScroll
  - Slider
  - Swiper
---

slider.vue

```html
<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span
        v-for="(item,index) in dots"
        :class="['dot',{'active':index==currentPageIndex}]"
      ></span>
    </div>
  </div>
</template>

<script type="text/javascript">
  import BScroll from "better-scroll";
  export default {
    data() {
      return {
        dots: [],
        currentPageIndex: 0
      };
    },
    props: {
      loop: {
        type: Boolean,
        default: true
      },
      autoplay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 2000
      }
    },
    methods: {
      _setSliderWidth(resize) {
        this.children = this.$refs.sliderGroup.children;
        let sliderWidth = this.$refs.slider.clientWidth;
        let width = 0;
        for (var i = 0; i < this.children.length; i++) {
          let child = this.children[i];
          child.classList.add("slider-item");
          child.style.width = sliderWidth + "px";
          width += sliderWidth;
        }
        if (!resize) {
          this.dots = new Array(this.children.length);
        }
        if (this.loop && !resize) {
          width += 2 * sliderWidth;
        }
        this.$refs.sliderGroup.style.width = width + "px";
      },
      _initSlider() {
        this.slider = new BScroll(this.$refs.slider, {
          scrollX: true,
          snap: {
            loop: this.loop
          },
          momentum: false,
          click: true
        });
        this.slider.on("scrollEnd", () => {
          this.currentPageIndex = this.slider.getCurrentPage().pageX;
          if (this.autoplay) {
            clearTimeout(this.timer);
            this._play();
          }
        });
        this.slider.on("scrollStart", () => {
          clearTimeout(this.timer);
        });
      },
      _play() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.slider.next();
        }, this.interval);
      }
    },
    mounted() {
      this._setSliderWidth();
      this._initSlider();
      if (this.autoplay) {
        clearTimeout(this.timer);
        this._play();
      }
      window.addEventListener("resize", () => {
        if (!this.slider) {
          return;
        }
        this._setSliderWidth(true);
        this.slider.refresh();
      });
    },
    destroyed() {
      clearTimeout(this.timer);
    }
  };
</script>

<style scoped>
  .slider {
    height: 100%;
    position: relative;
  }
  .slider-group {
    position: relative;
    overflow: hidden;
    white-space: nowrap;
  }
  .slider-item {
    float: left;
    box-sizing: border-box;
    overflow: hidden;
    text-align: center;
  }
  .slider-item a {
    display: block;
    width: 100%;
    overflow: hidden;
    text-decoration: none;
  }
  .slider-item img {
    display: block;
    width: 100%;
  }
  .dots {
    position: absolute;
    right: 0;
    left: 0;
    bottom: 12px;
    text-align: center;
    font-size: 0;
  }
  .dot {
    display: inline-block;
    margin: 0 4px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
  }
  .dot.active {
    width: 20px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.8);
  }
</style>
```

:::tip
使用方法
:::

组件中

```html
<template>
  <slider :loop="true" :autoplay="true">
    <div></div>
    <div></div>
    <div></div>
  </slider>
</template>
```
