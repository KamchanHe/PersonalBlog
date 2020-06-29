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

## 优化打包

```
npm i uglifyjs-webpack-plugin webpack-bundle-analyzer compression-webpack-plugin image-webpack-loader
```

去掉项目里 import 引入的插件 通过 cdn 加速

```js
// 是否为生产环境
const isProduction = process.env.NODE_ENV === 'production'
// 本地环境是否需要使用cdn
const devNeedCdn = true
const cdn = {
  externals: {
    html2canvas: 'html2canvas',
    lodash: '_',
    vue: 'Vue',
    vuex: 'Vuex',
    'vue-router': 'VueRouter',
    axios: 'axios',
    'vue-clipboard2': 'VueClipboard',
    moment: 'moment',
    validator: 'validator',
  },
  css: [],
  js: [
    'https://cdn.bootcss.com/vue/2.5.17/vue.runtime.min.js',
    'https://cdn.bootcss.com/vue-router/3.0.1/vue-router.min.js',
    'https://cdn.bootcss.com/vuex/3.0.1/vuex.min.js',
    'https://cdn.bootcdn.net/ajax/libs/qs/6.9.4/qs.min.js',
    'https://cdn.bootcss.com/axios/0.18.0/axios.min.js',
    'https://cdn.bootcdn.net/ajax/libs/html2canvas/0.5.0-beta4/html2canvas.min.js',
    'https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.15/lodash.min.js',
    'https://cdn.jsdelivr.net/gh/eduardolundgren/tracking.js/build/tracking-min.js',
    'https://cdn.jsdelivr.net/gh/eduardolundgren/tracking.js/build/data/face-min.js',
    'https://cdn.bootcdn.net/ajax/libs/vue-clipboard2/0.3.1/vue-clipboard.min.js',
    'https://cdn.bootcdn.net/ajax/libs/moment.js/2.26.0/moment.min.js',
    'https://cdn.bootcdn.net/ajax/libs/validator/13.1.0/validator.min.js',
  ],
}
// gzip压缩
const CompressionPlugin = require('compression-webpack-plugin')
// 代码压缩
const UglifyJsPlugin = require('terser-webpack-plugin')
// 配置别名
// function resolve(dir) {
//   return path.join(__dirname, dir)
// }

module.exports = {
  // 基本路径
  publicPath: process.env.NODE_ENV === 'production' ? '/dist/' : '/',
  //打包时不要map文件
  productionSourceMap: false,
  // 输出文件目录
  outputDir: 'dist',
  // eslint-loader 是否在保存的时候检查
  lintOnSave: true,
  // css相关配置
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: false,
    // 开启 CSS source maps?
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {},
    // 启用 CSS modules for all css / pre-processor files.
    requireModuleExtension: false,
    // css预设器配置项
    loaderOptions: {
      // pass options to sass-loader
      sass: {
        // 引入全局变量样式
        prependData: '@import "@/assets/css/reset.scss";',
      },
    },
  },
  transpileDependencies: ['vuex-persist'],
  // webpack配置
  chainWebpack: (config) => {
    // config
    //   .entry('index')
    //   .add('babel-polyfill')
    //   .end()
    // 配置别名
    // config.resolve.alias.set('@', resolve('src'))
    // 注入cdn
    config.plugin('html').tap((args) => {
      if (isProduction || devNeedCdn) args[0].cdn = cdn
      return args
    })
    /* 添加分析工具*/
    if (isProduction) {
      // 删除预加载
      config.plugins.delete('preload')
      config.plugins.delete('prefetch')
      // 压缩代码
      config.optimization.minimize(true)
      // 分割代码
      config.optimization.splitChunks({
        chunks: 'all',
      })
      config
        .plugin('webpack-bundle-analyzer')
        .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
        .end()
    }
  },
  configureWebpack: (config) => {
    // 用cdn方式引入
    if (isProduction || devNeedCdn) config.externals = cdn.externals
    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置...
      config.mode = 'production'
      config.plugins.push(
        // gzip压缩
        new CompressionPlugin({
          test: /\.js$|\.html$|\.css/, //匹配文件名
          threshold: 10240, //对超过10k的数据进行压缩
          minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
          deleteOriginalAssets: false, //是否删除原文件
        })
      )
      config.plugins.push(
        //生产环境自动删除console
        new UglifyJsPlugin({
          terserOptions: {
            warnings: false,
            compress: {
              drop_debugger: true,
              drop_console: true,
            },
          },
          sourceMap: false,
          parallel: true,
        })
      )
    }
  },

  devServer: {
    port: 9000,
    open: true,
    overlay: {
      warnings: false,
      errors: true,
    },
    host: '0.0.0.0',
    useLocalIp: true,
    proxy: {
      '/api': {
        target: `http://admin.jdcct.top`, //线上
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api',
        },
      },
    },
  },
}
```

## 人脸识别

### 效果

![face](https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/bug/quarklend/face.png)

### 使用 Tracking.js

在 index.html 引入 [tracking.js](https://github.com/eduardolundgren/tracking.js/blob/master/build/tracking-min.js) 和 [face.js](https://github.com/eduardolundgren/tracking.js/blob/master/build/data/face.js)

#### index.html

```html
<script src="https://cdn.jsdelivr.net/gh/eduardolundgren/tracking.js/build/tracking-min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/eduardolundgren/tracking.js/build/data/face-min.js"></script>
```

#### face.vue

```vue
<template>
  <div id="face">
    <div v-show="showContainer" class="face-capture" id="face-capture">
      <video ref="refVideo" id="video" autoplay></video>
      <img
        src="https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/bug/quarklend/video-cover.png"
        alt="cover"
        class="img-cover"
      />
      <div class="control-bg">
        <div></div>
      </div>
      <div class="control-container face-capture">
        <h2 class="title">{{ scanTip }}</h2>
        <img
          class="close"
          src="https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/bug/quarklend/icon-clear.png"
          alt=""
          @click="back"
        />
        <canvas
          ref="refCanvas"
          :width="screenSize.width"
          :height="screenSize.height"
          :style="{ opacity: 0 }"
        ></canvas>
      </div>
      <div
        class="rect"
        v-for="(item, index) in profile"
        :key="index"
        :style="{
          width: item.width + 'px',
          height: item.height + 'px',
          left: item.left + 'px',
          top: item.top + 'px',
        }"
      ></div>
    </div>
    <img v-show="!showContainer" :src="imgUrl" />
  </div>
</template>

<script>
export default {
  name: 'Face',
  data() {
    return {
      screenSize: { width: window.screen.width, height: window.screen.height }, // 屏幕数据
      URL: null, // 当前页面URL
      streamIns: null, // 视频流
      showContainer: true, // 显示
      tracker: null, // tracking实例
      tipFlag: false, // 提示用户已经检测到
      flag: false, // 判断是否已经拍照
      context: null, // canvas上下文
      profile: [], // 轮廓
      removePhotoID: null, // 停止转换图片
      scanTip: '人脸识别中...', // 提示文字
      imgUrl: '', // base64格式图片
      isClose: false, // 是否已关闭视频流
    }
  },
  mounted() {
    sessionStorage.removeItem('result')
    this.playVideo()
  },
  destroyed() {
    !this.isClose && this.close()
  },
  methods: {
    /**
     * @description: 获取用户媒体设备
     * @param {视频配置} constrains
     * @param {获取成功回调函数} success
     * @param {获取失败回调函数} error
     * @return: null
     */
    getUserMedia(constrains, success, error) {
      if (navigator.mediaDevices.getUserMedia) {
        //最新标准API
        navigator.mediaDevices
          .getUserMedia(constrains)
          .then(success)
          .catch(error)
      } else if (navigator.webkitGetUserMedia) {
        //webkit内核浏览器
        navigator
          .webkitGetUserMedia(constrains)
          .then(success)
          .catch(error)
      } else if (navigator.mozGetUserMedia) {
        //Firefox浏览器
        navagator
          .mozGetUserMedia(constrains)
          .then(success)
          .catch(error)
      } else if (navigator.getUserMedia) {
        //旧版API
        navigator
          .getUserMedia(constrains)
          .then(success)
          .catch(error)
      } else {
        this.scanTip = '你的浏览器不支持访问用户媒体设备'
      }
    },
    /**
     * @description: 获取用户媒体设备成功
     * @param {stream} 视频流
     * @return: null
     */
    success(stream) {
      this.streamIns = stream
      // webkit内核浏览器
      this.URL = window.URL || window.webkitURL
      if ('srcObject' in this.$refs.refVideo) {
        this.$refs.refVideo.srcObject = stream
      } else {
        this.$refs.refVideo.src = this.URL.createObjectURL(stream)
      }
      this.$refs.refVideo.onloadedmetadata = (e) => {
        this.$refs.refVideo.play()
        this.initTracker()
      }
    },
    /**
     * @description: 获取用户媒体设备失败
     * @param {e}
     * @return: null
     */
    error(e) {
      this.scanTip = '访问用户媒体失败' + e.name + ',' + e.message
    },
    /**
     * @description: 开始视频流
     * @return: null
     */
    playVideo() {
      this.getUserMedia(
        {
          video: {
            width: this.screenSize.width,
            height: this.screenSize.height,
            facingMode: 'user',
          } /* 前置优先 */,
        },
        this.success,
        this.error
      )
    },
    // 人脸捕捉
    initTracker() {
      this.context = this.$refs.refCanvas.getContext('2d') // 画布
      this.tracker = new tracking.ObjectTracker(['face']) // tracker实例
      this.tracker.setStepSize(1.7) // 设置步长
      try {
        tracking.track('#video', this.tracker) // 开始追踪
        this.tracker.on('track', this.handleTracked) // 绑定监听方法
      } catch (e) {
        this.scanTip = '访问用户媒体失败，请重试'
      }
    },
    // 追踪事件
    handleTracked(e) {
      if (e.data.length === 0) {
        this.scanTip = '未检测到人脸'
        // clearTimeout(this.removePhotoID)
      } else {
        e.data.forEach(this.plot)
        if (!this.tipFlag) {
          this.scanTip = '检测成功，正在拍照，请保持不动'
        }
        // 1秒后拍照，仅拍一次
        if (!this.flag) {
          this.scanTip = '拍照中...'
          this.flag = true
          this.removePhotoID = setTimeout(() => {
            this.tackPhoto()
            this.tipFlag = true
          }, 500)
        }
      }
    },
    // 绘制跟踪框
    plot({ x, y, width: w, height: h }) {
      // 创建框对象
      this.profile = []
      this.profile.push({ width: w, height: h, left: x, top: y })
    },
    // 拍照
    tackPhoto() {
      this.context.drawImage(
        this.$refs.refVideo,
        0,
        0,
        this.screenSize.width,
        this.screenSize.height
      )
      // 保存为base64格式
      this.imgUrl = this.saveAsPNG(this.$refs.refCanvas)
      /** 拿到base64格式图片之后就可以在this.compare方法中去调用后端接口比较了，也可以调用getBlobBydataURI方法转化成文件再去比较
       * 我们项目里有一个设置个人头像的地方，先保存一下用户的图片，然后去拿这个图片的地址和当前拍照图片给后端接口去比较。
       * */
      this.compare(this.imgUrl)
      // this.close()
    },
    // Base64转文件
    getBlobBydataURI(dataURI, type) {
      var binary = window.atob(dataURI.split(',')[1])
      var array = []
      for (var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i))
      }
      return new Blob([new Uint8Array(array)], {
        type: type,
      })
    },
    compare(url) {
      let blob = this.getBlobBydataURI(url, 'image/png')
      let formData = new FormData()
      formData.append('image', blob)
      formData.append('token', this.$store.state.token)
      let config = {
        headers: { 'Content-Type': 'multipart/form-data' },
      } //添加请求头
      this.$api
        .verifiedFace(formData, false, config)
        .then((res) => {
          if (res.data.code == 1) {
            sessionStorage.setItem('result', 1)
            this.close()
            this.$toast.show({
              text: res.data.msg || '认证成功',
              icon: 'success',
              duration: 1500,
            })
          } else {
            sessionStorage.setItem('result', 0)
            this.close()
            this.$toast.show({
              text: res.data.msg || '认证失败',
              icon: 'fail',
              duration: 1500,
            })
          }
        })
        .catch((err) => {
          sessionStorage.setItem('result', 0)
          this.close()
        })
    },
    // 保存为png,base64格式图片
    saveAsPNG(c) {
      return c.toDataURL('image/png', 0.3)
    },
    back() {
      sessionStorage.removeItem('faceImageUrl')
      this.close()
    },
    // 关闭并清理资源
    close() {
      if (this.isClose) return
      this.isClose = true
      this.flag = false
      this.tipFlag = false
      this.showFailPop = false
      this.showContainer = false
      this.tracker && this.tracker.removeListener('track', this.handleTracked)
      this.tracker = null
      this.context = null
      this.profile = []
      this.scanTip = '人脸识别中...'
      clearTimeout(this.removePhotoID)
      if (this.streamIns) {
        this.streamIns.enabled = false
        this.streamIns.getTracks()[0].stop()
        this.streamIns.getVideoTracks()[0].stop()
      }
      this.streamIns = null
      if (this.imgUrl) {
        sessionStorage.setItem('faceImageUrl', this.imgUrl)
      }
      this.$router.go(-1)
      // this.$router.push('/miner')
    },
  },
}
</script>

<style lang="scss" scoped>
#face {
  width: 100%;
  height: 100%;
}
.face-capture {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.face-capture video,
.face-capture canvas {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 2;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.face-capture canvas {
  z-index: 2;
}

.face-capture .img-cover {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 2;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.face-capture .rect {
  border: rem(2) solid #0aeb08;
  position: fixed;
  z-index: 3;
}

.face-capture .control-container {
  margin-top: rem(10);
  position: relative;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 4;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.face-capture .title {
  text-align: center;
  color: white;
  margin: 100% auto 0 auto;
  font-size: rem(18);
}

.face-capture .close {
  position: relative;
  z-index: 100;
  width: rem(40);
  height: rem(40);
}
</style>
```

## 上传头像

![logo](https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/bug/quarklend/logo.gif)

```vue
<template>
  <div class="createTerritory-logo flex flex-align-center">
    <div class="text flex">
      <span>领地头像</span>
    </div>
    <div class="input" @click="handleSeletImage">
      <img
        :src="
          logo
            ? $utils.handlerImgUrl(logo)
            : 'https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/bug/quarklend/upload.png'
        "
        alt=""
      />
      <input
        ref="uploadInput"
        type="file"
        accept="image/*"
        @change="uploadFile"
      />
      <div @click.stop="clearLogo" v-if="logo" class="clear">
        <img
          src="https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/bug/quarklend/icon-clear.png"
          alt=""
        />
      </div>
      <div v-if="isUploading" class="loading">
        <div class="loading-bg"></div>
        <div class="loading-icon">
          <div class="loading-icon-loading">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 50 50"
              style="enable-background:new 0 0 50 50"
              xml:space="preserve"
            >
              <path
                fill="#fff"
                d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z"
                transform="rotate(275.098 25 25)"
              >
                <animateTransform
                  attributeType="xml"
                  attributeName="transform"
                  type="rotate"
                  from="0 25 25"
                  to="360 25 25"
                  dur="0.6s"
                  repeatCount="indefinite"
                ></animateTransform>
              </path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CreateTerritory',
  data() {
    return {
      name: '', // 领地名称
      desc: '', // 领地简介
      logo: '', // 领地头像
      path: '', // 头像路径
      textMaxCount: 100, // 领地简介最大字数限制
      isUploading: false, // 上传头像中
    }
  },
  computed: {
    /**
     * @description: 领地简介的字数
     * @return: {number}
     */
    inputCount() {
      return this.desc.length
    },
  },
  methods: {
    /**
     * @description: 选择头像
     * @return: null
     */
    handleSeletImage() {
      if (this.isUploading) return
      this.$refs.uploadInput.click()
      if (!this.$notNeed) {
        this.$refs.uploadInput.click()
      }
    },
    /**
     * @description: 清除头像
     * @return: null
     */
    clearLogo() {
      this.logo = ''
      this.path = ''
      this.$refs.uploadInput.value = ''
    },
    /**
     * @description: 上传图片
     * @param {object} e 文件流
     * @return: null
     */
    uploadFile(e) {
      this.isUploading = true
      let $target = e.target || e.srcElement
      let file = $target.files[0]
      let param = new FormData() //创建form对象
      param.append('file', file) //通过append向form对象添加数据
      param.append('token', this.$store.state.token)
      let config = {
        headers: { 'Content-Type': 'multipart/form-data' },
      } //添加请求头
      this.$api
        .handleUpload(param, false, config)
        .then((res) => {
          this.isUploading = false
          this.$toast.show({
            text: '上传成功',
            duration: 1500,
          })
          this.logo = res.data.data.url
          this.path = res.data.data.path
        })
        .catch((err) => {
          this.isUploading = false
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.createTerritory-logo {
  margin-top: rem(20);
  .input {
    margin-left: rem(20);
    width: rem(90);
    height: rem(90);
    position: relative;
    input {
      display: none;
    }
    .clear {
      position: absolute;
      top: rem(-10);
      right: rem(-10);
      width: rem(20);
      height: rem(20);
    }
    .loading {
      position: absolute;
      top: 0;
      left: 0;
      &-bg {
        width: rem(90);
        height: rem(90);
        background: rgba(0, 0, 0, 0.5);
        position: absolute;
      }
      &-icon {
        width: rem(90);
        height: rem(90);
        margin: 0 auto rem(10) auto;
        font-size: rem(40);
        color: white;
        &-loading {
          position: relative;
          svg {
            position: absolute;
            top: 0;
          }
        }
        img {
          display: block;
          width: rem(90);
          height: rem(90);
        }
      }
    }
  }
}
</style>
```
