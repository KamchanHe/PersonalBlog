---
title: Axios封装
date: 2020-03-31
categories: article
author: Kamchan
tags:
  - Javascript
  - Axios
  - Ajax
---

## 简单版(有守卫)

ajaxRequest.js

```js
import axios from 'axios'

class FetchData {
  constructor() {
    this.baseURL =
      process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '/' // 请求路径
    this.timeout = 3000 // 设置超时时间
  }

  setInterceptor(instance) {
    // 设置拦截器
    instance.interceptors.request.use(
      (config) => {
        config.headers.Authorization = `${localStorage.getItem('token')}`
        return config // 增加token
      },
      (err) => {
        Promise.reject(err)
      }
    )

    instance.interceptors.response.use(
      (res) => res.data,
      (err) => {
        Promise.reject(err)
      }
    )
  }

  request(request) {
    const instance = axios.create()
    const config = {
      baseURL: this.baseURL,
      timeout: this.timeout,
      ...request,
    } // 合并配置
    this.setInterceptor(instance)
    return instance(config)
  }
}

export default new FetchData()
```

:::tip
使用
:::

```js
import axios from './ajaxRequest'

axios.request({ url: '/test' })

axios.request({
  url: '/login',
  method: 'POST',
  data: {
    username,
  },
})
```

:::tip
全局路由拦截校验登录
:::

api.js

```js
import axios from '../lib/ajaxRequest'
// 全部是promise
export const getTest = () => axios.request({ url: '/test' })
export const login = (username) =>
  axios.request({ url: '/login', method: 'POST', data: { username } })

export const validate = () => axios.request({ url: '/validate' })
export default {}
```

store.js

```js
import Vue from 'vue'
import Vuex from 'vuex'
import { validate } from './api'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    username: '',
  },
  mutations: {
    setUsername(state, username) {
      state.username = username
    },
  },
  actions: {
    async validate({ commit }) {
      const r = await validate()
      if (r.code === 1) {
        return false
      }
      commit('setUsername', r.username)
      localStorage.setItem('token', r.token)
      return true
    },
  },
})
```

main.js

```js
const whiteList = ['/']
router.beforeEach(async (to, from, next) => {
  // 路由的渲染流程  钩子的执行顺序
  // 要校验一下 当前用户登录没登录
  if (whiteList.includes(to.path)) {
    return next()
  }
  const flag = await store.dispatch('validate')
  if (flag) {
    if (to.path === '/login') {
      next('/')
    } else {
      next() // 登录过而且不是login  那就ok 跳转吧
    }
  } else {
    // 没登录过 ，如果这条路由 还需要登录那么就跳转到登录页面
    // 看vue文档
    const flag = to.matched.some((item) => item.meta.needLogin)
    if (flag) {
      next('/login')
    } else {
      next()
    }
  }
  next()
})
```

## Element-ui 搭配(有守卫)

### 路由守卫

#### permission.js

```js
import router from './router'
import store from './store'

const whiteList = ['/', '/login', '/index']
router.beforeEach(async (to, from, next) => {
  if (to.name === 'Index') {
    store.state.tabIndex = 0
  } else if (to.name === 'User' || 'Login') {
    store.state.tabIndex = 2
  }
  // 路由的渲染流程  钩子的执行顺序
  // 要校验一下 当前用户登录没登录
  if (whiteList.includes(to.path)) {
    return next()
  }

  // const flag = localStorage.getItem('token')
  // const isLogin = await store.dispatch('validate')
  const isLogin = await store.dispatch('validate')
  // const isLogin = true
  if (isLogin) {
    if (to.path === '/index/login') {
      next('/')
    } else {
      next() // 登录过而且不是login  那就ok 跳转吧
    }
  } else {
    // 没登录过 ，如果这条路由 还需要登录那么就跳转到登录页面
    // 看vue文档
    const flag = to.matched.some((item) => item.meta.needLogin)
    if (flag) {
      next('/index/login')
    } else {
      next()
    }
  }
  next()
})
```

### Loading 组件

:::tip
用到的 lottie 插件需要的动画 json 文件

[dotted.json](https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/dotted.json)
:::

#### Loading.vue

```html
<template>
  <div class="loading" id="loading" v-show="show">
    <div style="z-index:9999">
      <lottie :options="defaultOptions" />
    </div>
  </div>
</template>

<script>
  import lottie from 'vue-lottie'
  import * as dotted from '../../assets/js/dotted.json'
  export default {
    props: {
      show: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        defaultOptions: { animationData: dotted.default },
        animationSpeed: 1,
        anim: {},
      }
    },
    components: {
      lottie,
    },
  }
</script>

<style lang="scss" scoped>
  .loading {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.7);
    z-index: 9998;
    > div {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
      height: 100%;
    }
  }
</style>
```

#### Loading.js

```js
import LoadingComponent from './Loading.vue'
import Vue from 'vue'

let instance

const LoadingConstructor = Vue.extend(LoadingComponent)

instance = new LoadingConstructor().$mount()

instance.show = false

const loading = {
  show(options = {}) {
    instance.show = true
    document.body.appendChild(instance.$el)
  },
  hide() {
    instance.show = false
    try {
      document.body.removeChild(instance.$el)
    } catch (error) {}
  },
}

export default {
  install() {
    if (!Vue.$loading) {
      Vue.$loading = loading
    }
    Vue.mixin({
      created() {
        this.$loading = Vue.$loading
      },
    })
  },
}
```

### 使用 loading 组件

#### main.js

```js
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/permission'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI, { size: 'small' })

import lottie from 'vue-lottie'
Vue.component('lottie', lottie)

Vue.config.productionTip = false

import loading from '@/components/Loading/Loading'
Vue.use(loading)

import http from '@/http/http'

Vue.prototype.$http = http

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')

export default Vue
```

### axios 封装

#### http.js

```js
import axios from 'axios'
import router from '@/router'
import app from '@/main'
import { Message } from 'element-ui'

axios.defaults.withCredentials = true

let num = 0

class FetchData {
  constructor() {
    this.baseURL = process.env.NODE_ENV === 'development' ? '/api' : '/api' // 请求路径
    this.timeout = 5000 // 设置超时时间
  }

  setInterceptor(instance, loading) {
    // 设置拦截器
    instance.interceptors.request.use(
      (config) => {
        if (!navigator.onLine) {
          Message({
            message: '断网啦~',
            type: 'error',
            duration: 1500,
          })
          return config
        }
        num++
        loading ? app.$loading.show() : app.$loading.hide()
        config.withCredentials = true
        config.headers.Authorization = localStorage.getItem('token')
        config.headers.post['Content-Type'] =
          'application/x-www-form-urlencoded;charset=UTF-8'
        return config // 增加token
      },
      (err) => {
        num--
        if (num === 0) {
          setTimeout(() => {
            app.$loading.hide()
          }, 500)
        }
        return Promise.reject(err)
      }
    )

    instance.interceptors.response.use(
      (res) => {
        num--
        if (num === 0) {
          setTimeout(() => {
            app.$loading.hide()
          }, 500)
        }
        if (res.status === 200) {
          if (res.data.code === 1) {
            setTimeout(() => {
              Message({
                message: res.data.msg || '请求失败～',
                type: 'error',
                duration: 2000,
              })
            }, 500)
          }
          return Promise.resolve(res)
        } else {
          return Promise.reject(res)
        }
      },
      (error) => {
        num--
        if (num === 0) {
          setTimeout(() => {
            app.$loading.hide()
          }, 500)
        }
        if (error.response) {
          if (error.response.status) {
            switch (error.response.status) {
              // 401: 未登录
              // 未登录则跳转登录页面，并携带当前页面的路径
              // 在登录成功后返回当前页面，这一步需要在登录页操作。
              case 401:
                Message({
                  message: '未登录,请先登录',
                  type: 'error',
                  duration: 1500,
                })
                setTimeout(() => {
                  router.replace({
                    path: '/login',
                    query: { redirect: router.currentRoute.fullPath },
                  })
                }, 1500)
                break
              // 403 token过期
              // 登录过期对用户进行提示
              // 清除本地token和清空vuex中token对象
              // 跳转登录页面
              case 403:
                Message({
                  message: '登录过期,请重新登录',
                  type: 'error',
                  duration: 1500,
                })
                // 清除token
                localStorage.removeItem('token')
                // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
                setTimeout(() => {
                  router.replace({
                    path: '/login',
                    query: {
                      redirect: router.currentRoute.fullPath,
                    },
                  })
                }, 1500)
                break
              // 404请求不存在
              case 404:
                Message({
                  message: '请求页面不存在',
                  type: 'error',
                  duration: 1500,
                })
                break
              case 301:
                return Promise.resolve(error)
                break
              // 其他错误，直接抛出错误提示
              default:
                Message({
                  message:
                    error.response.data.message || '服务器错误,请联系管理员',
                  type: 'error',
                  duration: 1500,
                })
            }
          }
          return Promise.reject(error.response)
        } else {
          Message({
            message: '断网啦~',
            type: 'warning',
            duration: 2000,
          })
          return Promise.reject(error.response)
        }
      }
    )
  }

  post(url, data, loading = true) {
    const instance = axios.create()
    const config = {
      baseURL: this.baseURL,
      timeout: this.timeout,
      method: 'POST',
      url: url,
      data: data,
    }
    this.setInterceptor(instance, loading)
    return instance(config)
  }

  nodePost(url, data, loading = true) {
    const instance = axios.create()
    const config = {
      baseURL: '/test',
      timeout: this.timeout,
      method: 'POST',
      url: url,
      data: data,
      responseType: 'arraybuffer',
    }
    this.setInterceptor(instance, loading)
    return instance(config)
  }

  get(url, params, loading = true) {
    const instance = axios.create()
    const config = {
      baseURL: this.baseURL,
      timeout: this.timeout,
      method: 'get',
      url: url,
      params: params,
    }
    this.setInterceptor(instance, loading)
    return instance(config)
  }
}

export default new FetchData()
```

## mint-ui 搭配(无守卫)

```js
import axios from 'axios'
import { Indicator, Toast } from 'mint-ui'
import config from './config'

let request = {}
/**
 * ajax请求失败
 * @param msg
 */
request.ajaxError = (msg, timeOut) => {
  if (msg) {
    setTimeout(() => {
      if (typeof msg === 'string') {
        Toast({
          message: msg,
          duration: 1500,
        })
      } else {
        Toast(
          JSON.stringify({
            message: msg,
            duration: 1500,
          })
        )
      }
    }, 20)
  } else {
    Toast({
      message: '网络连接错误~',
      duration: 1500,
    })
  }
  Indicator.close()
  clearTimeout(timeOut)
}
/**
 * ajax
 * @param opt
 */
request.ajax = (opt) => {
  let option = {}
  let setTime = {}
  let time = new Date() * 1
  let _showLoading = true // 是否出現loading
  let loadingTime = config.loadingTime || 500 // 出现loading时间
  let method = opt.api.method || config.requestType.get
  let url = opt.api.url
  let headers = opt.headers || opt.api.headers || {}
  if (!url) {
    request.ajaxError('网络连接超时~', setTime[time])
    return false
  }
  if (opt.api && opt.api.loadingTime) {
    loadingTime = opt.api.loadingTime
  }
  setTime[time] = setTimeout(() => {
    // 超过一定時間后出现加载条
    if (_showLoading) {
      Indicator.open({ text: 'Loading...', spinnerType: 'fading-circle' })
    }
  }, loadingTime)
  option.headers = headers
  option.method = method
  option.url = url
  option.transformRequest = [
    function(data) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    },
  ]
  option.headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  }
  if (opt.api && opt.api.inject) {
    // 自定义注入器
    option = opt.api.inject(option)
  }
  if (opt.data) {
    opt.data.token = localStorage.getItem('token') || ''
  } else {
    opt.data = {}
    opt.data.token = localStorage.getItem('token') || ''
  }
  if (method === config.requestType.get) {
    // get请求
    if (opt.data) {
      option.params = opt.data
    }
  } else {
    // post请求
    if (opt.data) {
      option.data = opt.data
    }
  }
  option.params = option.params || opt.params || {}

  return new Promise((resolve, reject) => {
    axios(option)
      .then((response) => {
        request.render(response, opt, setTime, time, resolve)
        Indicator.close()
        clearTimeout(setTime[time])
      })
      .catch((error) => {
        let response = error.response
        request.render(response, opt, setTime, time, resolve)
        Indicator.close()
        clearTimeout(setTime[time])
      })
  })
}
request.render = (response, opt, setTime, time, resolve) => {
  if (response) {
    if (response.status === 503 || response.status === 404) {
      // 自定义状态码拦截器
      request.ajaxError(response.statusText, setTime[time])
      if (opt.api.errorCallback instanceof Function) {
        opt.api.errorCallback(response.statusText)
      }
    } else if (response.status === 401) {
      console.log('TCL: request.render -> response', response)
      request.ajaxError(response.data.msg, setTime[time])
      if (opt.api.errorCallback instanceof Function) {
        opt.api.errorCallback(response.data.msg)
      }
      setTimeout(() => {
        window.location.replace('/wap_front#/login')
      }, 1500)
    } else if (opt.api && opt.api.intercept) {
      opt.api.intercept(response.data, resolve, (msg) => {
        if (opt.api.errorCallback instanceof Function) {
          opt.api.errorCallback(msg)
        }
        request.ajaxError(msg, setTime[time])
      })
    } else {
      resolve(response.data)
    }
  } else {
    if (opt.api.errorCallback instanceof Function) {
      opt.api.errorCallback('网络连接错误~')
    }
    request.ajaxError('网络连接错误~', setTime[time])
  }
}
export default request
```

### config.js

```js
let config = {}

config.requestType = {
  get: 'get',
  post: 'post',
  put: 'put',
  delete: 'delete',
  jsonp: 'jsonp',
}
config.api = api
```

### api.js

```js
import config from './config'
let intercept = async (response, resolve, errorCallBack) => {
  if (Number(response.code) === 1 || Number(response.code) === 10001) {
    resolve(response)
  } else {
    errorCallBack(response.msg)
  }
}
let inject = (option) => {
  option.headers = option.headers || {}
  // option.headers.token = localStorage.getItem('token');
  return option
}

let api = {}
api.requestType = config.requestType
let baseUrl = '' //服务器地址

if (process.env.NODE_ENV === 'production') {
  baseUrl = '' // 线上服务器地址
} else {
  baseUrl = '' // 开发服务器地址
}
// 请求的接口
api.apiName = {
  url: `${baseUrl}/xxx`,
  method: api.requestType.get,
  inject: inject,
  intercept: intercept,
}

export default api
```

### 使用

#### main.js

```js
import { request } from './ajax'
import api from './api'
Vue.prototype.$ajax = request.ajax
Vue.prototype.$api = api
```

#### 组件中使用

```js
this.$ajax({
  api: this.$api.apiName,
  data: {
    // 参数
  },
}).then((res) => {
  // 接口返回的数据
})
```

## 自封装组件版

### reset.scss

```scss
// rem 单位换算：定为 75px 只是方便运算，750px-75px、640-64px、1080px-108px，如此类推
$vw_fontsize: 75; // iPhone 6尺寸的根元素大小基准值
@function rem($px) {
  @return ($px / $vw_fontsize) * 1rem;
}
// 根元素大小使用 vw 单位
$vw_design: 750;
html {
  font-size: ($vw_fontsize / ($vw_design / 2)) * 100vw;
  // 同时，通过Media Queries 限制根元素最大最小值
  @media screen and (max-width: 320px) {
    font-size: 64px;
  }
  @media screen and (min-width: 540px) {
    font-size: 108px;
  }
}

html,
body {
  width: 100%;
  height: 100%;
  max-width: 540px;
  min-width: 320px;
  margin: 0 auto;
  overflow: hidden;
  -webkit-text-size-adjust: 100%;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

.mod_banner {
  position: relative;
  padding-top: percentage(100/750);
  height: 0;
  overflow: hidden;
  img {
    width: 100%;
    height: auto;
    position: absolute;
    left: 0;
    top: 0;
  }
}

$scale2: 0.5;
$scale3: 0.33;
$color: #eeeeee;
$radius: 2px;
$style: solid;
$width2: 200%;
$width3: 300%;

@mixin min-device-pixel-ratio {
  @media screen and (min-device-pixel-ratio: 2),
    (-webkit-min-device-pixel-ratio: 2) {
    transform: scale($scale2);
    width: $width2;
    transform-origin: 0 0;
  }
  @media screen and (min-device-pixel-ratio: 3),
    (-webkit-min-device-pixel-ratio: 3) {
    transform: scale($scale3);
    width: $width3;
    transform-origin: 0 0;
  }
}

@mixin vertical-min-device-pixel-ratio {
  @media screen and (min-device-pixel-ratio: 2),
    (-webkit-min-device-pixel-ratio: 2) {
    transform: scale($scale2);
    width: $width2;
    height: $width2;
    transform-origin: 0 0;
  }
  @media screen and (min-device-pixel-ratio: 3),
    (-webkit-min-device-pixel-ratio: 3) {
    transform: scale($scale3);
    width: $width3;
    height: $width3;
    transform-origin: 0 0;
  }
}

.border-1px {
  position: relative;
  &::before {
    content: '';
    pointer-events: none;
    display: block;
    position: absolute;
    z-index: 0;
    left: 0;
    top: 0;
    transform-origin: 0 0;
    border: 1px $style $color;
    border-radius: $radius;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    @media screen and (min-device-pixel-ratio: 2),
      (-webkit-min-device-pixel-ratio: 2) {
      width: 200%;
      border-radius: $radius * 2;
      transform: scale(0.5);
    }
    @media screen and (min-device-pixel-ratio: 3),
      (-webkit-min-device-pixel-ratio: 3) {
      width: 300%;
      border-radius: $radius * 3;
      transform: scale(0.33);
    }
  }
}

.border-top-1px {
  position: relative;
  &::before {
    content: '';
    position: absolute;
    z-index: 0;
    left: 0;
    top: 0;
    border-top: 1px $style $color;
    @include min-device-pixel-ratio;
  }
}
.border-right-1px {
  position: relative;
  &::before {
    content: '';
    position: absolute;
    z-index: 0;
    right: 0;
    top: 0;
    border-left: 1px $style $color;
    @include vertical-min-device-pixel-ratio;
  }
}
.border-bottom-1px {
  position: relative;
  &::after {
    content: '';
    position: absolute;
    z-index: 0;
    left: 0;
    bottom: 0;
    border-bottom: 1px $style $color;
    @include min-device-pixel-ratio;
  }
}
.border-left-1px {
  position: relative;
  &::before {
    content: '';
    position: absolute;
    z-index: 0;
    left: 0;
    top: 0;
    border-left: 1px $style $color;
    @include vertical-min-device-pixel-ratio;
  }
}

/*初始化样式*/
body,
h1,
h2,
h3,
h4,
h5,
h6,
hr,
p,
blockquote,
dl,
dt,
dd,
ul,
ol,
li,
pre,
form,
fieldset,
legend,
button,
input,
textarea,
th,
td {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  -khtml-user-select: none;
  user-select: none;
  -webkit-touch-callout: none;
  -moz-touch-callout: none;
  -ms-touch-callout: none;
  touch-callout: none;
}

button,
input,
select,
textarea {
  box-sizing: border-box;
  -webkit-tap-highlight-color: rgba(255, 0, 0, 0);
}

button:focus,
button:active:focus,
button.active:focus,
button.focus,
button:active.focus,
button.active.focus {
  outline: none;
  border-color: transparent;
  box-shadow: none;
  border: none;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-size: 100%;
}

address,
cite,
dfn,
em,
var {
  font-style: normal;
}

code,
kbd,
pre,
samp {
  font-family: couriernew, courier, monospace;
}

div {
  box-sizing: border-box;
}

ul,
ol {
  list-style: none;
}

a {
  text-decoration: none;
  color: black;
}

a:hover {
  text-decoration: none;
}

input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 1000px white inset !important;
}

sup {
  vertical-align: text-top;
}

sub {
  vertical-align: text-bottom;
}

legend {
  color: #000;
}

fieldset,
img {
  border: none;
  border: 0;
}

img {
  display: block;
  width: 100%;
  content: normal !important;
}

table {
  border-collapse: collapse;
  border-spacing: 0;
}
/*flex 相关*/
.flex {
  display: flex;

  &.flex-column {
    flex-direction: column;
  }

  &.flex-wrap {
    flex-wrap: wrap;
  }

  &.flex-row {
    flex-direction: row;
  }

  &.flex-center {
    align-items: center;
    justify-content: center;
  }

  &.flex-align-center {
    align-items: center;
  }

  &.flex-align-end {
    align-items: flex-end;
  }

  &.flex-content-end {
    justify-content: flex-end;
  }

  &.flex-content-center {
    justify-content: center;
  }

  &.flex-content-between {
    justify-content: space-between;
  }

  &.flex-content-around {
    justify-content: space-around;
  }

  .flex-1 {
    flex: 1;
  }

  .flex-2 {
    flex: 2;
  }

  .flex-3 {
    flex: 3;
  }

  .flex-4 {
    flex: 4;
  }
}

// 一行超出省略
.ellipsis-one {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
// 两行超出省略
.ellipsis-two {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
```

### Loading.vue

```vue
<template>
  <div class="loading-box" v-if="show">
    <div class="loading-bg"></div>
    <div class="loading">
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
      <div class="loading-text">
        <p>Loading...</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Loading',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="scss" scoped>
.loading {
  background: rgba(17, 17, 17, 0.7);
  min-width: rem(180);
  min-height: rem(10);
  padding: rem(10) 0;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  z-index: 1000;
  border-radius: rem(5);
  &-icon {
    width: rem(55);
    height: rem(55);
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
      width: rem(55);
      height: rem(55);
    }
  }
  &-text {
    font-size: rem(14);
    font-weight: 300;
    color: white;
    text-align: center;
    padding: 0 rem(10);
  }
}
.loading-bg {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.5);
}
</style>
```

### Loading.js

```js
import LoadingComponent from './Loading.vue'
import Vue from 'vue'

let instance

const LoadingConstructor = Vue.extend(LoadingComponent)

instance = new LoadingConstructor().$mount()

instance.show = false

const loading = {
  show(options = {}) {
    instance.show = true
    document.body.appendChild(instance.$el)
  },
  hide() {
    instance.show = false
    try {
      document.body.removeChild(instance.$el)
    } catch (error) {}
  },
}

export default {
  install() {
    if (!Vue.$loading) {
      Vue.$loading = loading
    }
    Vue.mixin({
      created() {
        this.$loading = Vue.$loading
      },
    })
  },
}
```

### Toast.vue

```vue
<template>
  <div class="toast-box" v-if="show">
    <div v-if="icon === 'loading'" class="loading-bg"></div>
    <div class="toast">
      <div v-if="icon" class="toast-icon">
        <div v-if="icon === 'loading'" class="toast-icon-loading">
          <!-- <i class="fas fa-spinner"></i> -->
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
        <div
          v-else-if="icon === 'success'"
          class="toast-icon-success flex flex-center"
        >
          <img src="../../assets/image/icon-success.png" alt="" />
        </div>
        <div
          v-else-if="icon === 'fail'"
          class="toast-icon-fail flex flex-center"
        >
          <img src="../../assets/image/icon-fail.png" alt="" />
        </div>
      </div>
      <div class="toast-text">
        <p>{{ text }}</p>
      </div>
      <div v-if="tip" class="toast-tip">
        <p>{{ tip }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Toast',
  props: {
    text: {
      type: String,
      default: '删除成功',
    },
    tip: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    duration: {
      type: Number,
      default: 1500,
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="scss" scoped>
.toast {
  background: rgba(17, 17, 17, 0.7);
  min-width: rem(180);
  min-height: rem(10);
  padding: rem(10) 0;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  z-index: 1000;
  border-radius: rem(5);
  &-icon {
    width: rem(55);
    height: rem(55);
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
      width: rem(55);
      height: rem(55);
    }
  }
  &-text {
    font-size: rem(14);
    font-weight: 300;
    color: white;
    text-align: center;
    padding: 0 rem(10);
  }
  &-tip {
    height: rem(20);
    font-size: rem(11);
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    text-align: center;
    padding: 0 rem(10);
    p {
      height: rem(20);
    }
  }
}
.loading-bg {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.5);
}
</style>
```

### Toast.js

```js
import ToastComponent from './Toast.vue'
import Vue from 'vue'

let instance

const ToastConstructor = Vue.extend(ToastComponent)

instance = new ToastConstructor().$mount()

instance.show = false

const toast = {
  show(options = {}) {
    instance.show = true
    instance.text = options.text || ''
    instance.tip = options.tip || ''
    instance.icon = options.icon || ''
    instance.duration = options.duration || 0
    document.body.appendChild(instance.$el)
    if (instance.duration) {
      clearTimeout(instance.timer)
      instance.timer = null
      instance.timer = setTimeout(() => {
        instance.show = false
      }, instance.duration)
    }
  },
  hide() {
    instance.show = false
    try {
      document.body.removeChild(instance.$el)
    } catch (error) {}
  },
}

export default {
  install() {
    if (!Vue.$toast) {
      Vue.$toast = toast
    }
    Vue.mixin({
      created() {
        this.$toast = Vue.$toast
      },
    })
  },
}
```

### Dialog.vue

```vue
<template>
  <transition name="dialog-anime">
    <div class="dialog" v-if="showDialog">
      <div class="dialog-bg"></div>
      <div class="dialog-content">
        <div class="dialog-content-title">
          <span>{{ title }}</span>
        </div>
        <div class="dialog-content-text">
          <span>{{ content }}</span>
        </div>
        <div
          class="dialog-content-btn flex flex-align-center flex-content-between"
        >
          <span @click="sure">确定</span>
          <span @click="cancel">取消</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Dialog',
  props: {
    title: {
      type: String,
      default: '提示',
    },
    content: {
      type: String,
      default: '',
    },
    showDialog: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    cancel() {
      this.callBack(false)
      this.showDialog = false
    },
    sure() {
      this.callBack(true)
      this.showDialog = false
    },
  },
}
</script>

<style lang="scss" scoped>
.dialog-anime-enter-to,
.dialog-anime-leave {
  transition: all 0.5s;
  opacity: 1;
}
.dialog-anime-leave-to,
.dialog-anime-enter {
  transition: all 0.5s;
  opacity: 0;
}
.dialog {
  position: fixed;
  z-index: 1000;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  &-bg {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
  }
  &-content {
    position: fixed;
    width: rem(280);
    height: rem(181);
    background: rgba(255, 255, 255, 1);
    border-radius: rem(5);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-weight: 500;
    color: rgba(43, 43, 43, 1);
    padding: 0 rem(15);
    text-align: center;
    &-title {
      font-size: rem(18);
      margin-top: rem(30);
    }
    &-text {
      font-size: rem(16);
      margin-top: rem(20);
    }
    &-btn {
      span {
        display: block;
        margin-top: rem(20);
        width: rem(120);
        height: rem(40);
        background: rgba(252, 173, 1, 1);
        border-radius: rem(20);
        font-size: rem(16);
        color: rgba(255, 255, 255, 1);
        line-height: rem(40);
        &:nth-child(2) {
          background: #d0cdd0;
        }
      }
    }
  }
}
</style>
```

### Dialog.js

```js
import DialogComponent from './Dialog.vue'
import Vue from 'vue'

let instance

const DialogConstructor = Vue.extend(DialogComponent)

instance = new DialogConstructor().$mount()

instance.show = false

let currentMsg = null

function defaultCallBack(action) {
  if (!action) currentMsg.reject()
  currentMsg.resolve()
}

const dialog = {
  show(options = {}) {
    instance.showDialog = true
    instance.title = options.title || '提示'
    instance.content = options.content || ''
    document.body.appendChild(instance.$el)
    return new Promise((resolve, reject) => [
      (currentMsg = { resolve, reject }),
    ])
  },
  hide() {
    instance.showDialog = false
    try {
      document.body.removeChild(instance.$el)
    } catch (error) {}
  },
}

export default {
  install() {
    DialogConstructor.prototype.callBack = defaultCallBack
    if (!Vue.$dialog) {
      Vue.$dialog = dialog
    }
    Vue.mixin({
      created() {
        this.$dialog = Vue.$dialog
      },
    })
  },
}
```

### api.js

```js
import http from '@/http/http'

export default {
  validate: () => http.get(''),
}
```

### http.js

```js
import axios from 'axios'
import router from '@/router'
import Qs from 'qs'
import app from '@/main'

// 同一地址的表单如果多次请求则自动取消 避免重复提交表单
const pending = [] // 声明一个数组用于存储每个ajax请求的队列
const cancelToken = axios.CancelToken // 初始化取消请求的构造函数
let arr = [] // 区分是请求还是响应的头部

/**
 * @param {请求体信息} config
 * @param {直接执行的cancel函数，执行即可取消请求} f
 */
const removePending = (config, f) => {
  arr = config.url
  arr = arr[arr.length - 1]
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

// cookie跨域配置
axios.defaults.withCredentials = true

let num = 0 // 记录请求次数 成功和出错时-1 归0时关闭loading层

class FetchData {
  constructor() {
    this.baseURL = process.env.NODE_ENV === 'development' ? '' : '' // 请求路径
    this.timeout = 5000 // 设置超时时间
  }

  setInterceptor(instance, loading) {
    // 设置拦截器
    instance.interceptors.request.use(
      (config) => {
        if (!navigator.onLine) {
          // TODO: '断网啦~'
          app.$toast.show({
            text: '断网啦~',
            icon: 'fail',
            duration: 1500,
          })
          return config
        }
        if (config.method === 'post') {
          config.cancelToken = new cancelToken((c) => {
            removePending(config, c)
          })
        }
        num++
        // TODO: 打开loading
        loading ? app.$loading.show() : app.$loading.hide()
        config.withCredentials = true
        config.headers.post['Content-Type'] =
          'application/x-www-form-urlencoded;charset=UTF-8'
        return config
      },
      (err) => {
        num--
        if (num === 0) {
          // TODO: 关闭loading
          app.$loading.hide()
        }
        return Promise.reject(err)
      }
    )

    instance.interceptors.response.use(
      (res) => {
        if (response.config.method === 'post') {
          removePending(response.config)
        }
        num--
        if (num === 0) {
          // TODO: 关闭loading
          app.$loading.hide()
        }
        if (res.status === 200) {
          if (res && res.data && res.data.code === 0) {
            // TODO: 请求失败
            if (res.config.url == '') {
              // 特殊接口 如果code为错误码1 也要用到 则需要在这里单独配置resolve
              return Promise.resolve(res)
            } else {
              app.$toast.show({
                text: res.data.msg || '请求失败~',
                icon: 'fail',
                duration: 1500,
              })
              return Promise.reject(res)
            }
          } else {
            return Promise.resolve(res)
          }
        } else {
          return Promise.reject(res)
        }
      },
      (error) => {
        console.log('error', error)
        num--
        if (num === 0) {
          // TODO: 关闭loading
          app.$loading.hide()
        }
        if (error.response) {
          if (error.response.status) {
            switch (error.response.status) {
              // 401: 未登录
              // 未登录则跳转登录页面，并携带当前页面的路径
              // 在登录成功后返回当前页面，这一步需要在登录页操作。
              case 401:
                // TODO: 未登录,请先登录
                app.$toast.show({
                  text: '未登录,请先登录',
                  icon: 'fail',
                  duration: 1500,
                })
                // 记录下想去的url 在登录逻辑那里通过接受跳转地址等登录后跳转到想去的页面
                setTimeout(() => {
                  router.replace({
                    path: '/index',
                    query: { redirect: router.currentRoute.fullPath },
                  })
                }, 1500)
                // TODO:清除token
                break
              // 403 token过期
              // 登录过期对用户进行提示
              // 清除本地token和清空vuex中token对象
              // 跳转登录页面
              case 403:
                // TODO: 登录过期,请重新登录
                app.$toast.show({
                  text: '登录过期,请重新登录',
                  icon: 'fail',
                  duration: 1500,
                })
                // TODO:清除token
                // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
                setTimeout(() => {
                  router.replace({
                    path: '/index',
                    query: {
                      redirect: router.currentRoute.fullPath,
                    },
                  })
                }, 1500)
                break
              // 404请求不存在
              case 404:
                // TODO: 请求页面不存在
                app.$toast.show({
                  text: '请求页面不存在',
                  icon: 'fail',
                  duration: 1500,
                })
                break
              case 301:
                return Promise.resolve(error)
                break
              // 其他错误，直接抛出错误提示
              default:
                // TODO: error.response.data.message || '服务器错误,请联系管理员'
                app.$toast.show({
                  text:
                    error.response.data.message || '服务器错误,请联系管理员',
                  icon: 'fail',
                  duration: 1500,
                })
            }
          }
          return Promise.reject(error.response)
        } else {
          if (error.message) {
            // TODO: 断网啦~
            app.$toast.show({
              text: error || '断网啦~',
              icon: 'fail',
              duration: 1500,
            })
          }
          return Promise.reject(error.response)
        }
      }
    )
  }

  /**
   * @description: POST请求
   * @param {string} url 请求路径
   * @param {object} data 请求参数
   * @param {boolean} loading 是否显示loading层
   * @return:
   */
  post(url, data = {}, loading = true) {
    data.token = localStorage.getItem('token') || ''
    data = Qs.stringify(data)
    const instance = axios.create()
    const config = {
      baseURL: this.baseURL,
      timeout: this.timeout,
      method: 'POST',
      url: url,
      data: data,
    }
    this.setInterceptor(instance, loading)
    return instance(config)
  }

  /**
   * @description: GET请求
   * @param {string} url 请求路径
   * @param {object} params 请求参数
   * @param {boolean} loading 是否显示loading层
   * @return:
   */
  get(url, params = {}, loading = true) {
    const instance = axios.create()
    const config = {
      baseURL: this.baseURL,
      timeout: this.timeout,
      method: 'GET',
      url: url,
      params: params,
    }
    this.setInterceptor(instance, loading)
    return instance(config)
  }
}

export default new FetchData()
```

### permission.js

```js
import router from './router'
import store from './store'
import Vue from 'vue'

const whiteList = ['/', '/index']
router.beforeEach(async (to, from, next) => {
  // 要校验一下 当前用户登录没登录
  if (whiteList.includes(to.path)) {
    return next()
  }
  const isLogin = store.state.isLogin
  if (isLogin) {
    if (to.path === '/index') {
      next('/')
    } else {
      next() // 登录过而且不是login  那就ok 跳转吧
    }
  } else {
    // 没登录过 ，如果这条路由 还需要登录那么就跳转到登录页面
    const flag = to.matched.some((item) => item.meta.needLogin)
    if (flag) {
      Vue.$toast.show({
        text: '请先登录!',
        duration: 1500,
      })
      next('/index')
    } else {
      next()
    }
  }
  // next()
})

router.afterEach((route) => {
  document.getElementsByTagName('title')[0].textContent =
    route.meta.title || route.name || ''
})
```

### directive

button 加上指令即可在自定义秒数或者默认的 3 秒内不可再点击

```html
<button @click="点击事件" v-preventReClick="1000"></button>
<button @click="点击事件" v-preventReClick></button>
```

```js
import Vue from 'vue'

const preventReClick = Vue.directive('preventReClick', {
  inserted: function(el, binding) {
    el.addEventListener('click', () => {
      if (!el.disabled) {
        el.disabled = true
        setTimeout(() => {
          el.disabled = false
        }, binding.value || 3000) // 传入绑定值就使用，默认3000毫秒内不可重复触发
      }
    })
  },
})

export { preventReClick }
```

### main.js

```js
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/css/reset.scss'
import { preventReClick } from '@/utils/directive'

import '@/permission'
import http from '@/http/http'
Vue.prototype.$http = http

import api from '@/api/api'
Vue.prototype.$api = api

import Toast from '@/components/Toast/Toast'
Vue.use(Toast)

import Loading from '@/components/Loading/Loading'
Vue.use(Loading)

import Dialog from '@/components/Dialog/Dialog'
Vue.use(Dialog)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')

export default Vue
```
