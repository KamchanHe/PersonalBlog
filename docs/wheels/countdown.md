---
title: 翻牌倒计时
date: 2019-12-02
categories: article
author: Kamchan
tags:
  - Javascript
  - Vue
  - Css3
---

## 效果

![countdown.gif](https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/countdown.gif)

## JavaScript 版

### html 部分

```html
<!-- 根据个人需求 可以天时分秒 可以时分秒 可以分秒 可以秒 -->
<div class="clock" id="clock">
  <div class="flip down">
    <div class="digital front number0"></div>
    <div class="digital back number1"></div>
  </div>
  <div class="flip down">
    <div class="digital front number0"></div>
    <div class="digital back number1"></div>
  </div>
  <em>天</em>
  <div class="flip down">
    <div class="digital front number0"></div>
    <div class="digital back number1"></div>
  </div>
  <div class="flip down">
    <div class="digital front number0"></div>
    <div class="digital back number1"></div>
  </div>
  <em>:</em>
  <div class="flip down">
    <div class="digital front number0"></div>
    <div class="digital back number1"></div>
  </div>
  <div class="flip down">
    <div class="digital front number0"></div>
    <div class="digital back number1"></div>
  </div>
  <em>:</em>
  <div class="flip down">
    <div class="digital front number0"></div>
    <div class="digital back number1"></div>
  </div>
  <div class="flip down">
    <div class="digital front number0"></div>
    <div class="digital back number1"></div>
  </div>
</div>
```

### css 部分

```css
.single-demo {
  margin: 50px auto;
  padding: 30px;
  width: 600px;
  text-align: center;
  border: solid 1px #999;
}

.flip {
  display: inline-block;
  position: relative;
  width: 60px;
  height: 100px;
  line-height: 100px;
  border: solid 1px #000;
  border-radius: 10px;
  background: #fff;
  font-size: 66px;
  color: #fff;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.5);
  text-align: center;
  font-family: "Helvetica Neue";
}

.flip .digital:before,
.flip .digital:after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  background: #000;
  overflow: hidden;
  box-sizing: border-box;
}

.flip .digital:before {
  top: 0;
  bottom: 50%;
  border-radius: 10px 10px 0 0;
  border-bottom: solid 1px #666;
}

.flip .digital:after {
  top: 50%;
  bottom: 0;
  border-radius: 0 0 10px 10px;
  line-height: 0;
}

/*向下翻*/
.flip.down .front:before {
  z-index: 3;
}

.flip.down .back:after {
  z-index: 2;
  transform-origin: 50% 0%;
  transform: perspective(160px) rotateX(180deg);
}

.flip.down .front:after,
.flip.down .back:before {
  z-index: 1;
}

.flip.down.go .front:before {
  transform-origin: 50% 100%;
  animation: frontFlipDown 0.6s ease-in-out both;
  box-shadow: 0 -2px 6px rgba(255, 255, 255, 0.3);
  backface-visibility: hidden;
}

.flip.down.go .back:after {
  animation: backFlipDown 0.6s ease-in-out both;
}

/*向上翻*/
.flip.up .front:after {
  z-index: 3;
}

.flip.up .back:before {
  z-index: 2;
  transform-origin: 50% 100%;
  transform: perspective(160px) rotateX(-180deg);
}

.flip.up .front:before,
.flip.up .back:after {
  z-index: 1;
}

.flip.up.go .front:after {
  transform-origin: 50% 0;
  animation: frontFlipUp 0.6s ease-in-out both;
  box-shadow: 0 2px 6px rgba(255, 255, 255, 0.3);
  backface-visibility: hidden;
}

.flip.up.go .back:before {
  animation: backFlipUp 0.6s ease-in-out both;
}

@keyframes frontFlipDown {
  0% {
    transform: perspective(160px) rotateX(0deg);
  }

  100% {
    transform: perspective(160px) rotateX(-180deg);
  }
}

@keyframes backFlipDown {
  0% {
    transform: perspective(160px) rotateX(180deg);
  }

  100% {
    transform: perspective(160px) rotateX(0deg);
  }
}

@keyframes frontFlipUp {
  0% {
    transform: perspective(160px) rotateX(0deg);
  }

  100% {
    transform: perspective(160px) rotateX(180deg);
  }
}

@keyframes backFlipUp {
  0% {
    transform: perspective(160px) rotateX(-180deg);
  }

  100% {
    transform: perspective(160px) rotateX(0deg);
  }
}

.flip .number0:before,
.flip .number0:after {
  content: "0";
}

.flip .number1:before,
.flip .number1:after {
  content: "1";
}

.flip .number2:before,
.flip .number2:after {
  content: "2";
}

.flip .number3:before,
.flip .number3:after {
  content: "3";
}

.flip .number4:before,
.flip .number4:after {
  content: "4";
}

.flip .number5:before,
.flip .number5:after {
  content: "5";
}

.flip .number6:before,
.flip .number6:after {
  content: "6";
}

.flip .number7:before,
.flip .number7:after {
  content: "7";
}

.flip .number8:before,
.flip .number8:after {
  content: "8";
}

.flip .number9:before,
.flip .number9:after {
  content: "9";
}

.clock {
  text-align: center;
  margin-bottom: 200px;
}

.clock em {
  display: inline-block;
  line-height: 102px;
  font-size: 66px;
  font-style: normal;
  vertical-align: top;
}
```

### javascript 部分

```js
function getTimeDown(minuTime, formatDate, fn) {
  var flip = document.getElementById("flip");
  var backNode = document.querySelector(".back");
  var frontNode = document.querySelector(".front");

  // 当前数字
  var count = 0;
  // 是否正在翻转（防止翻转未结束就进行下一次翻转）
  var isFlipping = false;

  /* 时钟代码 */
  // 时钟翻牌
  function Flipper(config) {
    // 默认配置
    this.config = {
      // 时钟模块的节点
      node: null,
      // 初始前牌文字
      frontText: "number0",
      // 初始后牌文字
      backText: "number1",
      // 翻转动画时间（毫秒，与翻转动画CSS 设置的animation-duration时间要一致）
      duration: 600
    };
    // 节点的原本class，与html对应，方便后面添加/删除新的class
    this.nodeClass = {
      flip: "flip",
      front: "digital front",
      back: "digital back"
    };
    // 覆盖默认配置
    Object.assign(this.config, config);
    // 定位前后两个牌的DOM节点
    this.frontNode = this.config.node.querySelector(".front");
    this.backNode = this.config.node.querySelector(".back");
    // 是否处于翻牌动画过程中（防止动画未完成就进入下一次翻牌）
    this.isFlipping = false;
    // 初始化
    this._init();
  }
  Flipper.prototype = {
    constructor: Flipper,
    // 初始化
    _init: function() {
      // 设置初始牌面字符
      this._setFront(this.config.frontText);
      this._setBack(this.config.backText);
    },
    // 设置前牌文字
    _setFront: function(className) {
      this.frontNode.setAttribute(
        "class",
        this.nodeClass.front + " " + className
      );
    },
    // 设置后牌文字
    _setBack: function(className) {
      this.backNode.setAttribute(
        "class",
        this.nodeClass.back + " " + className
      );
    },
    _flip: function(type, front, back) {
      // 如果处于翻转中，则不执行
      if (this.isFlipping) {
        return false;
      }
      // 设置翻转状态为true
      this.isFlipping = true;
      // 设置前牌文字
      this._setFront(front);
      // 设置后牌文字
      this._setBack(back);
      // 根据传递过来的type设置翻转方向
      let flipClass = this.nodeClass.flip;
      if (type === "down") {
        flipClass += " down";
      } else {
        flipClass += " up";
      }
      // 添加翻转方向和执行动画的class，执行翻转动画
      this.config.node.setAttribute("class", flipClass + " go");
      // 根据设置的动画时间，在动画结束后，还原class并更新前牌文字
      setTimeout(() => {
        // 还原class
        this.config.node.setAttribute("class", flipClass);
        // 设置翻转状态为false
        this.isFlipping = false;
        // 将前牌文字设置为当前新的数字，后牌因为被前牌挡住了，就不用设置了。
        this._setFront(back);
      }, this.config.duration);
    },
    // 下翻牌
    flipDown: function(front, back) {
      this._flip("down", front, back);
    },
    // 上翻牌
    flipUp: function(front, back) {
      this._flip("up", front, back);
    }
  };

  // 定位时钟模块
  let clock = document.getElementById("clock");
  // 定位6个翻板
  let flips = clock.querySelectorAll(".flip");
  // 获取当前时间
  let times = minuTime;
  let nowTime = new Date().getTime() / 1000;

  // 定义牌板数组，用来存储6个Flipper翻板对象
  let nowTimeStr = secondsFormat(times - nowTime);
  let nextTimeStr = secondsFormat(times - nowTime - 1);
  let flipObjs = [];
  for (let i = 0; i < flips.length; i++) {
    // 创建6个Flipper实例，并初始化
    flipObjs.push(
      new Flipper({
        // 每个flipper实例按数组顺序与翻板DOM的顺序一一对应
        node: flips[i],
        // 按数组顺序取时间字符串对应位置的数字
        frontText: "number" + nowTimeStr[i],
        backText: "number" + nextTimeStr[i]
      })
    );
  }

  // 开始计时
  this.countdownTimer = setInterval(function() {
    let nowTime = new Date().getTime() / 1000;
    if (times - nowTime <= 1) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
      if (fn) {
        fn();
      }
    } else {
      let nowTimeStr = secondsFormat(times - nowTime);
      let nextTimeStr = secondsFormat(times - nowTime - 1);
      for (let i = 0; i < flipObjs.length; i++) {
        if (nowTimeStr[i] === nextTimeStr[i]) {
          continue;
        }
        flipObjs[i].flipDown(
          "number" + nowTimeStr[i],
          "number" + nextTimeStr[i]
        );
      }
    }
  }, 1000);

  function secondsFormat(s) {
    var day = Math.floor(s / (24 * 3600)); // Math.floor()向下取整
    var hour = Math.floor((s - day * 24 * 3600) / 3600);
    var minute = Math.floor((s - day * 24 * 3600 - hour * 3600) / 60);
    var second = s - day * 24 * 3600 - hour * 3600 - minute * 60;
    day = day > 10 ? day : "0" + day;
    hour = hour > 10 ? hour : "0" + hour;
    minute = minute > 10 ? minute : "0" + minute;
    second = second > 10 ? second : "0" + second;
    let format = formatDate.split("+");
    let refund = "";
    format.forEach(item => {
      switch (item) {
        case "day":
          refund += day;
          break;
        case "hour":
          refund += hour;
          break;
        case "minute":
          refund += minute;
          break;
        case "second":
          refund += second;
          break;
      }
    });
    return refund;
  }
}
```

### 使用

```js
let times = 1575353940; //目标日期时间戳（秒） 不能比当前时间小
let format = "day+hour+minute+second";
let fn = function() {
  //结束后要做的事情
};
getTimeDown(times, format, fn);
```

## Vue 版

### Filpper.vue

```html
<template>
  <div class="M-Flipper" :class="[flipType, {'go': isFlipping}]">
    <div class="digital front" :class="_textClass(frontTextFromData)"></div>
    <div class="digital back" :class="_textClass(backTextFromData)"></div>
  </div>
</template>

<script>
  export default {
    name: "FlipClock",
    data() {
      return {
        isFlipping: false,
        flipType: "down",
        frontTextFromData: 0,
        backTextFromData: 1
      };
    },
    props: {
      // front paper text
      // 前牌文字
      frontText: {
        type: [Number, String],
        default: 0
      },
      // back paper text
      // 后牌文字
      backText: {
        type: [Number, String],
        default: 1
      },
      // flipping duration, please be consistent with the CSS animation-duration value.
      // 翻牌动画时间，与CSS中设置的animation-duration保持一致
      duration: {
        type: Number,
        default: 600
      }
    },
    methods: {
      _textClass(number) {
        return "number" + number;
      },
      _flip(type, front, back) {
        // 如果处于翻转中，则不执行
        if (this.isFlipping) {
          return false;
        }
        this.frontTextFromData = front;
        this.backTextFromData = back;
        // 根据传递过来的type设置翻转方向
        this.flipType = type;
        // 设置翻转状态为true
        this.isFlipping = true;
        setTimeout(() => {
          // 设置翻转状态为false
          this.isFlipping = false;
          this.frontTextFromData = back;
        }, this.duration);
      },
      // 下翻牌
      flipDown(front, back) {
        this._flip("down", front, back);
      },
      // 上翻牌
      flipUp(front, back) {
        this._flip("up", front, back);
      },
      // 设置前牌文字
      setFront(text) {
        this.frontTextFromData = text;
      },
      // 设置后牌文字
      setBack(text) {
        this.backTextFromData = text;
      }
    },
    created() {
      this.frontTextFromData = this.frontText;
      this.backTextFromData = this.backText;
    }
  };
</script>

<style>
  .M-Flipper {
    display: inline-block;
    position: relative;
    width: 60px;
    height: 100px;
    line-height: 100px;
    border: solid 1px #000;
    border-radius: 10px;
    background: #fff;
    font-size: 66px;
    color: #fff;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.5);
    text-align: center;
    font-family: "Helvetica Neue";
  }

  .M-Flipper .digital:before,
  .M-Flipper .digital:after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    background: #000;
    overflow: hidden;
    box-sizing: border-box;
  }

  .M-Flipper .digital:before {
    top: 0;
    bottom: 50%;
    border-radius: 10px 10px 0 0;
    border-bottom: solid 1px #666;
  }

  .M-Flipper .digital:after {
    top: 50%;
    bottom: 0;
    border-radius: 0 0 10px 10px;
    line-height: 0;
  }

  /*向下翻*/
  .M-Flipper.down .front:before {
    z-index: 3;
  }

  .M-Flipper.down .back:after {
    z-index: 2;
    transform-origin: 50% 0%;
    transform: perspective(160px) rotateX(180deg);
  }

  .M-Flipper.down .front:after,
  .M-Flipper.down .back:before {
    z-index: 1;
  }

  .M-Flipper.down.go .front:before {
    transform-origin: 50% 100%;
    animation: frontFlipDown 0.6s ease-in-out both;
    box-shadow: 0 -2px 6px rgba(255, 255, 255, 0.3);
    backface-visibility: hidden;
  }

  .M-Flipper.down.go .back:after {
    animation: backFlipDown 0.6s ease-in-out both;
  }

  /*向上翻*/
  .M-Flipper.up .front:after {
    z-index: 3;
  }

  .M-Flipper.up .back:before {
    z-index: 2;
    transform-origin: 50% 100%;
    transform: perspective(160px) rotateX(-180deg);
  }

  .M-Flipper.up .front:before,
  .M-Flipper.up .back:after {
    z-index: 1;
  }

  .M-Flipper.up.go .front:after {
    transform-origin: 50% 0;
    animation: frontFlipUp 0.6s ease-in-out both;
    box-shadow: 0 2px 6px rgba(255, 255, 255, 0.3);
    backface-visibility: hidden;
  }

  .M-Flipper.up.go .back:before {
    animation: backFlipUp 0.6s ease-in-out both;
  }

  @keyframes frontFlipDown {
    0% {
      transform: perspective(160px) rotateX(0deg);
    }

    100% {
      transform: perspective(160px) rotateX(-180deg);
    }
  }

  @keyframes backFlipDown {
    0% {
      transform: perspective(160px) rotateX(180deg);
    }

    100% {
      transform: perspective(160px) rotateX(0deg);
    }
  }

  @keyframes frontFlipUp {
    0% {
      transform: perspective(160px) rotateX(0deg);
    }

    100% {
      transform: perspective(160px) rotateX(180deg);
    }
  }

  @keyframes backFlipUp {
    0% {
      transform: perspective(160px) rotateX(-180deg);
    }

    100% {
      transform: perspective(160px) rotateX(0deg);
    }
  }

  .M-Flipper .number0:before,
  .M-Flipper .number0:after {
    content: "0";
  }

  .M-Flipper .number1:before,
  .M-Flipper .number1:after {
    content: "1";
  }

  .M-Flipper .number2:before,
  .M-Flipper .number2:after {
    content: "2";
  }

  .M-Flipper .number3:before,
  .M-Flipper .number3:after {
    content: "3";
  }

  .M-Flipper .number4:before,
  .M-Flipper .number4:after {
    content: "4";
  }

  .M-Flipper .number5:before,
  .M-Flipper .number5:after {
    content: "5";
  }

  .M-Flipper .number6:before,
  .M-Flipper .number6:after {
    content: "6";
  }

  .M-Flipper .number7:before,
  .M-Flipper .number7:after {
    content: "7";
  }

  .M-Flipper .number8:before,
  .M-Flipper .number8:after {
    content: "8";
  }

  .M-Flipper .number9:before,
  .M-Flipper .number9:after {
    content: "9";
  }
</style>
```

### FlipClock.vue

```html
<template>
  <div class="FlipClock">
    <Flipper ref="flipperDay1" v-if="formatDate.includes('day')" />
    <Flipper ref="flipperDay2" v-if="formatDate.includes('day')" />
    <em v-if="formatDate.includes('day')">天</em>
    <Flipper ref="flipperHour1" v-if="formatDate.includes('hour')" />
    <Flipper ref="flipperHour2" v-if="formatDate.includes('hour')" />
    <em v-if="formatDate.includes('hour')">:</em>
    <Flipper ref="flipperMinute1" v-if="formatDate.includes('minute')" />
    <Flipper ref="flipperMinute2" v-if="formatDate.includes('minute')" />
    <em v-if="formatDate.includes('minute')">:</em>
    <Flipper ref="flipperSecond1" v-if="formatDate.includes('second')" />
    <Flipper ref="flipperSecond2" v-if="formatDate.includes('second')" />
  </div>
</template>

<script>
  import Flipper from "./Flipper";

  export default {
    name: "FlipClock",
    props: {
      formatDate: {
        type: String,
        default: "hour+minute+second"
      },
      minuTime: {
        type: Number,
        default: 1575275426
      }
    },
    data() {
      return {
        countdownTimer: null,
        flipObjs: []
      };
    },
    components: {
      Flipper
    },
    methods: {
      // 初始化数字
      init() {
        let nowTime = new Date().getTime() / 1000;
        let nowTimeStr = this.secondsFormat(this.minuTime - nowTime);
        console.log(this.minuTime - nowTime);
        for (let i = 0; i < this.flipObjs.length; i++) {
          console.log(i);
          this.flipObjs[i].setFront(nowTimeStr[i]);
        }
      },
      // 开始计时
      run() {
        this.countdownTimer = setInterval(() => {
          // 获取当前时间
          let nowTime = new Date().getTime() / 1000;
          if (this.minuTime - nowTime <= 1) {
            clearInterval(this.countdownTimer);
            this.countdownTimer = null;
            if (this.fn) {
              this.fn();
            }
          } else {
            let nowTimeStr = this.secondsFormat(this.minuTime - nowTime);
            let nextTimeStr = this.secondsFormat(this.minuTime - nowTime - 1);
            for (let i = 0; i < this.flipObjs.length; i++) {
              if (nowTimeStr[i] === nextTimeStr[i]) {
                continue;
              }
              this.flipObjs[i].flipDown(nowTimeStr[i], nextTimeStr[i]);
            }
          }
        }, 1000);
      },
      secondsFormat(s) {
        var day = Math.floor(s / (24 * 3600)); // Math.floor()向下取整
        var hour = Math.floor((s - day * 24 * 3600) / 3600);
        var minute = Math.floor((s - day * 24 * 3600 - hour * 3600) / 60);
        var second = s - day * 24 * 3600 - hour * 3600 - minute * 60;
        day = day > 10 ? day : "0" + day;
        hour = hour > 10 ? hour : "0" + hour;
        minute = minute > 10 ? minute : "0" + minute;
        second = second > 10 ? second : "0" + second;
        let format = this.formatDate.split("+");
        let refund = "";
        format.forEach(item => {
          switch (item) {
            case "day":
              refund += day;
              break;
            case "hour":
              refund += hour;
              break;
            case "minute":
              refund += minute;
              break;
            case "second":
              refund += second;
              break;
          }
        });
        return refund;
      }
    },
    mounted() {
      this.flipObjs = [];
      if (this.formatDate.includes("day")) {
        this.flipObjs.push(this.$refs.flipperDay1);
        this.flipObjs.push(this.$refs.flipperDay2);
      }
      if (this.formatDate.includes("hour")) {
        this.flipObjs.push(this.$refs.flipperHour1);
        this.flipObjs.push(this.$refs.flipperHour2);
      }
      if (this.formatDate.includes("minute")) {
        this.flipObjs.push(this.$refs.flipperMinute1);
        this.flipObjs.push(this.$refs.flipperMinute2);
      }
      if (this.formatDate.includes("second")) {
        this.flipObjs.push(this.$refs.flipperSecond1);
        this.flipObjs.push(this.$refs.flipperSecond2);
      }
      this.init();
      this.run();
    }
  };
</script>

<style>
  .FlipClock {
    text-align: center;
  }
  .FlipClock .M-Flipper {
    margin: 0 3px;
  }
  .FlipClock em {
    display: inline-block;
    line-height: 102px;
    font-size: 66px;
    font-style: normal;
    vertical-align: top;
  }
</style>
```

### 使用

```html
<template>
  <div id="app">
    <FlipClock
      :formatDate='"day+hour+minute+second"'
      :minuTime="1577807999"
      :fn='fn'
    ></FlipClock>
  </div>
</template>

<script>
  import FlipClock from "./components/FlipClock.vue";

  export default {
    name: "app",
    components: {
      FlipClock
    },
    methods: {
      fn() {
        console.log('倒计时结束');
      }
    }
  };
</script>
```
