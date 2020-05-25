---
title: 日日币
date: 2020-05-22
categories: article
author: Kamchan
tags:
  - Javascript
  - Vue
  - Bug
---

## 移动端 click 300ms 延迟问题

### 解决方案

[使用 fastClick](https://github.com/ftlabs/fastclick)

### 问题

最近为了解决移动端 click 300ms 延迟问题，使用了 FastClick.js，效果很明显，基本是点击后立马有反馈。可是在写上传头像这个功能的时候发现一个问题，在使用模拟点击的时候，并不能触发点击的目的。而在安卓上，却能正常触发。

### 原因

不应用 FastClick 的场景

- 桌面浏览器；
- 如果  <font color='#e7254e'>viewport meta</font> 标签   中设置了  <font color='#e7254e'>width=device-width</font>， <font color='#e7254e'>Android</font> 上的 <font color='#e7254e'>Chrome 32+</font> 会禁用 300ms 延时；
- <font color='#e7254e'>viewport meta</font> 标签如果设置了  <font color='#e7254e'>user-scalable=no，Android</font> 上的 <font color='#e7254e'>Chrome（所有版本）</font>都会禁用 300ms 延迟。
- <font color='#e7254e'>IE10</font> 中，可以使用 <font color='#e7254e'>css</font> 属性<font color='#e7254e'> -ms-touch-action: none</font>  禁止元素双击缩放（参考文章）。

根据上面描述，终于知道在安卓之所以能生效，是因为属于 FastClick 不应用的场景，而 IOS 则应用上了 FastClick 的效果。于是跟踪代码，各种调试，发现了在 ios 上，需要调用“模拟两次触发”才能完成一次真正的点击事件;

#### main.js

```js
...
import fastClick from 'fastclick'
fastClick.attach(document.body)
Vue.prototype.$notNeed = fastClick.notNeeded(document.body)
...
```

#### 使用

```js
    handleSeletImage() {
      this.$refs.uploadInput.click()
      if (!this.$notNeed) {
        this.$refs.uploadInput.click()
      }
    },
```

目前暂时用这种方法处理了在 FastClick 环境下模拟触发点击失效的问题

### 问题

近期发现项目中关于输入框在 ios 上点击失效，多次点击才可以获取焦点的问题，那么导致这个问题所在的原因是因为项目中引入了 FastClick 这个是解决移动端延迟 300 毫秒的优化

### 原因

当使用 FastClick 时，输入框在 ios 上点击输入调取手机自带输入键盘不灵敏，有时候甚至点不出来。而安卓上完全没问题。这个原因是因为 FastClick 的点击穿透。

### 解决方案

#### main.js

```js
import fastClick from 'fastclick'

fastClick.prototype.focus = function(targetElement) {
  var length
  if (
    targetElement.setSelectionRange &&
    targetElement.type.indexOf('date') !== 0 &&
    targetElement.type !== 'time' &&
    targetElement.type !== 'month'
  ) {
    length = targetElement.value.length
    targetElement.focus()
    targetElement.setSelectionRange(length, length)
  } else {
    targetElement.focus()
  }
}

fastClick.attach(document.body)
```

## IOS 下 input 框无法输入问题

### 问题

开发过程中 input 输入框在 iOS 手机上点击无法定位光标且无法进行输入，在浏览器和安卓手机上没有这个问题。

### 原因

<font color='#e7254e'>-webkit-user-select：none</font> 样式导致。

### 解决办法

在 <font color='#e7254e'>input</font> 的父类加上<font color='#e7254e'>-webkit-user-select:text !important;</font>

```scss
.from {
  -webkit-user-select: text !important;
  input {
    -webkit-user-select: text !important;
    outline: none;
    border: none;
  }
}
```

## 表单重复提交

### 原因

用户连续点击或者不小心按了两次的话或者接口还没返回又操作了一遍

### 解决方案

用 axios 自带的取消方法

### 请求封装方法中

```js
const pending = [] // 声明一个数组用于存储每个ajax请求的队列
const cancelToken = axios.CancelToken // 初始化取消请求的构造函数

/**
 * @param {请求体信息} config
 * @param {直接执行的cancel函数，执行即可取消请求} f
 */
const removePending = (config, f) => {
  arr = config.url
  const flagUrl = arr + '&' + config.method // 每次请求存储在请求中队列的元素关键值
  // 当前请求存在队列中
  if (pending.indexOf(flagUrl) !== -1) {
    if (f) {
      f() // 取消请求
    } else {
      pending.splice(pending.indexOf(flagUrl), 1) // 取消函数不存在，则从队列中删除该请求
    }
  } else {
    // 当前请求不在队列中
    if (f) {
      pending.push(flagUrl)
    }
  }
}

class FetchData {
  constructor() {
    this.baseURL = process.env.NODE_ENV === 'development' ? '' : '' // 请求路径
    this.timeout = 5000 // 设置超时时间
  }
  setInterceptor(instance, loading) {
    // 设置拦截器
    instance.interceptors.request.use(
      (config) => {
        if (config.method === 'post') {
          config.cancelToken = new cancelToken((c) => {
            removePending(config, c)
          })
        }
        return config
      },
      (err) => {
        return Promise.reject(err)
      }
    )
    instance.interceptors.response.use(
      (res) => {
        if (res.config.method === 'post') {
          removePending(res.config)
        }
        if (res.status === 200) {
          return Promise.resolve(res)
        } else {
          return Promise.reject(res)
        }
      },
      (error) => {
        if (error && error.config && error.config.method === 'post') {
          removePending(error.config)
        }
        return Promise.reject(error.response)
      }
    )
  }
}
```

## 自定义数字键盘

### 效果
![](https://kamchan.oss-cn-shenzhen.aliyuncs.com/numberInput.gif)


### 代码
```vue
<template>
  <div>
    <div
      :class="[
        showKeyboard ? 'active' : '',
        text.length > 0 ? '' : 'placeholder',
        'numberInput',
        'flex',
        'flex-align-center',
      ]"
      @click="show"
    >
      {{ text.length > 0 ? text : placeholder }}
    </div>
    <div @click="hide" v-if="showKeyboard" class="bg"></div>
    <div
      ref="NumberBoard"
      v-if="showKeyboard"
      class="numberBoard flex flex-center"
    >
      <div class="numberBoard-left">
        <div class="numberBoard-left-top flex flex-wrap">
          <div
            @touchstart="touchStart(1)"
            @touchend="touchEnd(1)"
            @click="boardClick(1)"
            ref="1"
            class="numberBoard-left-top-num flex flex-center"
          >
            <span>1</span>
          </div>
          <div
            @touchstart="touchStart(2)"
            @touchend="touchEnd(2)"
            @click="boardClick(2)"
            ref="2"
            class="numberBoard-left-top-num flex flex-center"
          >
            <span>2</span>
          </div>
          <div
            @touchstart="touchStart(3)"
            @touchend="touchEnd(3)"
            @click="boardClick(3)"
            ref="3"
            class="numberBoard-left-top-num flex flex-center"
          >
            <span>3</span>
          </div>
          <div
            @touchstart="touchStart(4)"
            @touchend="touchEnd(4)"
            @click="boardClick(4)"
            ref="4"
            class="numberBoard-left-top-num flex flex-center"
          >
            <span>4</span>
          </div>
          <div
            @touchstart="touchStart(5)"
            @touchend="touchEnd(5)"
            @click="boardClick(5)"
            ref="5"
            class="numberBoard-left-top-num flex flex-center"
          >
            <span>5</span>
          </div>
          <div
            @touchstart="touchStart(6)"
            @touchend="touchEnd(6)"
            @click="boardClick(6)"
            ref="6"
            class="numberBoard-left-top-num flex flex-center"
          >
            <span>6</span>
          </div>
          <div
            @touchstart="touchStart(7)"
            @touchend="touchEnd(7)"
            @click="boardClick(7)"
            ref="7"
            class="numberBoard-left-top-num flex flex-center"
          >
            <span>7</span>
          </div>
          <div
            @touchstart="touchStart(8)"
            @touchend="touchEnd(8)"
            @click="boardClick(8)"
            ref="8"
            class="numberBoard-left-top-num flex flex-center"
          >
            <span>8</span>
          </div>
          <div
            @touchstart="touchStart(9)"
            @touchend="touchEnd(9)"
            @click="boardClick(9)"
            ref="9"
            class="numberBoard-left-top-num flex flex-center"
          >
            <span>9</span>
          </div>
        </div>
        <div class="numberBoard-bottom flex">
          <div
            @touchstart="touchStart(0)"
            @touchend="touchEnd(0)"
            @click="boardClick(0)"
            ref="0"
            class="numberBoard-left-bottom-num flex flex-center"
          >
            <span>0</span>
          </div>
          <div
            @touchstart="touchStart('.')"
            @touchend="touchEnd('.')"
            @click="boardClick('.')"
            ref="."
            class="numberBoard-left-bottom-num flex flex-center"
          >
            <span>.</span>
          </div>
        </div>
      </div>
      <div class="numberBoard-right flex flex-column">
        <div
          @touchstart="touchStart('del')"
          @touchend="touchEnd('del')"
          @click="del"
          class="flex flex-center"
          ref="del"
        >
          <i class="fas fa-backspace"></i>
        </div>
        <div
          @click="handleSubmit"
          :class="['flex', 'flex-center', text.length > 0 ? 'active' : '']"
        >
          <span>确定</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NumberBoard',
  props: {
    placeholder: {
      type: String,
      default: '请输入数字',
    },
  },
  data() {
    return {
      showKeyboard: false,
      text: '',
    }
  },
  methods: {
    show() {
      this.showKeyboard = true
      setTimeout(() => {
        this.$refs.NumberBoard.style.transform = `translateY(0)`
      }, 20)
    },
    hide() {
      this.$refs.NumberBoard.style.transform = `translateY(100%)`
      setTimeout(() => {
        this.showKeyboard = false
      }, 500)
    },
    handleSubmit() {
      if (!this.text) {
        return
      } else {
        this.hide()
        this.$emit('text', this.text)
      }
    },
    boardClick(el) {
      if (this.text.length <= 0 && el == '.') {
        this.text = '0.'
      } else if (el == '.' && this.text.indexOf('.') > 0) {
        this.text = this.text.toString()
      } else {
        this.text = this.text.toString() + el.toString()
      }
      this.$emit('text', this.text)
    },
    touchStart(el) {
      this.$refs[el].style.background = 'rgb(228, 229, 228)'
    },
    touchEnd(el) {
      this.$refs[el].style.background = '#fff'
    },
    del() {
      let text = this.text
      text = text.slice(0, text.length - 1)
      this.text = text
    },
  },
}
</script>

<style lang="scss" scoped>
.numberBoard {
  font-size: rem(30);
  width: rem(375);
  background: rgb(246, 247, 246);
  padding: rem(5) rem(5) rem(50) rem(5);
  position: fixed;
  z-index: 9999;
  bottom: 0;
  left: 0;
  right: 0;
  transform: translateY(100%);
  transition: all 0.5s;
  &-left {
    flex: 1;
    &-top {
      &-num {
        font-size: rem(25);
        width: rem(80);
        background: #fff;
        margin: rem(5);
        text-align: center;
        border-radius: rem(3);
        height: rem(45);
      }
    }
    &-bottom {
      &-num {
        font-size: rem(25);
        width: rem(80);
        background: #fff;
        margin: rem(5);
        text-align: center;
        border-radius: rem(3);
        height: rem(45);
        &:nth-child(1) {
          width: rem(170);
        }
      }
    }
  }
  &-right {
    flex-basis: 25%;
    > div:nth-child(1) {
      font-size: rem(25);
      width: rem(80);
      background: #fff;
      margin: rem(5);
      text-align: center;
      border-radius: rem(3);
      padding: rem(3) 0;
      flex-basis: rem(45);
    }
    > div:nth-child(2) {
      font-size: rem(25);
      width: rem(80);
      background: rgb(172, 227, 194);
      margin: rem(5);
      text-align: center;
      border-radius: rem(3);
      padding: rem(3) 0;
      flex-basis: rem(155);
      color: #fff;
      &.active {
        background: rgb(87, 189, 106);
      }
    }
  }
}
.bg {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(255, 255, 255, 0);
}
.numberInput {
  outline: none;
  width: 100%;
  height: 100%;
  display: block;
  position: relative;
  font-size: rem(18);
  line-height: 100%;
  text-align: right;
  padding-right: rem(10);
  &.active::before {
    content: '|';
    position: absolute;
    top: 0;
    right: rem(5);
    top: 50%;
    transform: translateY(-50%);
    animation: cursorImg 1s infinite steps(1, start);
    color: black;
  }
  &.placeholder {
    color: #ccc;
  }
}

@keyframes cursorImg {
  0%,
  100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}
</style>
```
