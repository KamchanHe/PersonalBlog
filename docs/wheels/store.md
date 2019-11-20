---
title: Vue小型项目状态管理
date: 2019-11-20
categories: article
author: Kamchan
tags:
- Vue
- Javascript
---

## Vue简单状态管理（适用于简单项目）

:::tip
这个简单的store，支持全自动本地缓存，应对vue的刷新状态丢失问题
:::

### store.js

```js
var store = {
  data: {
    type: {
      isLogin: false,
      isModule: false
    },
    userInfo: {}
  },
  get state () {
    return this.data
  },
  set state (val) {
    window.localStorage.setItem('store', JSON.stringify(this.data))
  },
  amendType (obj) {
    let state = this.data
    switch (obj.type) {
      case 'isLogin':
        state.type.isLogin = obj.blo
        break
      case 'isModule':
        state.type.isModule = obj.blo
        break
      default:
        break
    }
    this.state = state
  },
  setUserInfo (obj) {
    if (obj.user_pic) {
      let http = new RegExp('http').test(obj.user_pic)
      // if(!wx) {
      if (!http) {
         obj.user_pic = window.location.origin + obj.user_pic
        // }
      }
    }
    let state = this.data
    state.userInfo = obj
    this.state = state
  },
  synchronousData (obj) {
    this.data = obj
  }
}

if (window.localStorage.getItem('store')) {
  store.synchronousData(JSON.parse(window.localStorage.getItem('store')))
}
export default store
```

### main.js中引入

```js
import store from './store'
Vue.prototype.$store = store
```

### 在组件中使用：

```js
data () {
  return {
    pageMessage: {
      page: 1,
      size: 10
    },
    total: 0,
    tableData: [],
    store: null
  }
},
created () {
  this.store = this.$store.state // 获取状态值
},
methods: {
	test () {
   	this.$store.amendType({type: 'isLogin', blo: true}) // 使用状态方法
   }
}
```

:::tip
这样就能全局使用状态值，并且刷新状态不会丢失，只适用于小项目，大型复杂项目还是使用Vuex。
:::
