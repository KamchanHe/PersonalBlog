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
      config => {
        config.headers.Authorization = `${localStorage.getItem('token')}`
        return config // 增加token
      },
      err => {
        Promise.reject(err)
      }
    )

    instance.interceptors.response.use(
      res => res.data,
      err => {
        Promise.reject(err)
      }
    )
  }

  request(request) {
    const instance = axios.create()
    const config = {
      baseURL: this.baseURL,
      timeout: this.timeout,
      ...request
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
    username
  }
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
export const login = username =>
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
    username: ''
  },
  mutations: {
    setUsername(state, username) {
      state.username = username
    }
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
    }
  }
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
    const flag = to.matched.some(item => item.meta.needLogin)
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
    const flag = to.matched.some(item => item.meta.needLogin)
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
        default: false
      }
    },
    data() {
      return {
        defaultOptions: { animationData: dotted.default },
        animationSpeed: 1,
        anim: {}
      }
    },
    components: {
      lottie
    }
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
  }
}

export default {
  install() {
    if (!Vue.$loading) {
      Vue.$loading = loading
    }
    Vue.mixin({
      created() {
        this.$loading = Vue.$loading
      }
    })
  }
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
  render: h => h(App)
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
      config => {
        if (!navigator.onLine) {
          Message({
            message: '断网啦~',
            type: 'error',
            duration: 1500
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
      err => {
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
      res => {
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
                duration: 2000
              })
            }, 500)
          }
          return Promise.resolve(res)
        } else {
          return Promise.reject(res)
        }
      },
      error => {
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
                  duration: 1500
                })
                setTimeout(() => {
                  router.replace({
                    path: '/login',
                    query: { redirect: router.currentRoute.fullPath }
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
                  duration: 1500
                })
                // 清除token
                localStorage.removeItem('token')
                // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
                setTimeout(() => {
                  router.replace({
                    path: '/login',
                    query: {
                      redirect: router.currentRoute.fullPath
                    }
                  })
                }, 1500)
                break
              // 404请求不存在
              case 404:
                Message({
                  message: '请求页面不存在',
                  type: 'error',
                  duration: 1500
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
                  duration: 1500
                })
            }
          }
          return Promise.reject(error.response)
        } else {
          Message({
            message: '断网啦~',
            type: 'warning',
            duration: 2000
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
      data: data
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
      responseType: 'arraybuffer'
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
      params: params
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
          duration: 1500
        })
      } else {
        Toast(
          JSON.stringify({
            message: msg,
            duration: 1500
          })
        )
      }
    }, 20)
  } else {
    Toast({
      message: '网络连接错误~',
      duration: 1500
    })
  }
  Indicator.close()
  clearTimeout(timeOut)
}
/**
 * ajax
 * @param opt
 */
request.ajax = opt => {
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
    }
  ]
  option.headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
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
      .then(response => {
        request.render(response, opt, setTime, time, resolve)
        Indicator.close()
        clearTimeout(setTime[time])
      })
      .catch(error => {
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
      opt.api.intercept(response.data, resolve, msg => {
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
  jsonp: 'jsonp'
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
let inject = option => {
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
  intercept: intercept
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
  }
}).then(res => {
  // 接口返回的数据
})
```
