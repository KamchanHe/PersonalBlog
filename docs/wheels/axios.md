---
title: Axios封装
date: 2019-11-20
categories: article
author: Kamchan
tags:
- Javascript
- Axios
- Ajax
---

ajaxRequest.js
```js
import axios from 'axios';

class FetchData {
  constructor() {
    this.baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '/'; // 请求路径 
    this.timeout = 3000; // 设置超时时间
  }

  setInterceptor(instance) { // 设置拦截器
    instance.interceptors.request.use(config => {
      config.headers.Authorization = `${localStorage.getItem('token')}`;
      return config; // 增加token
    }, (err) => {
      Promise.reject(err);
    });

    instance.interceptors.response.use(res => res.data, (err) => {
      Promise.reject(err);
    });
  }

  request(request) {
    const instance = axios.create();
    const config = {
      baseURL: this.baseURL,
      timeout: this.timeout,
      ...request,
    }; // 合并配置
    this.setInterceptor(instance);
    return instance(config);
  }
}

export default new FetchData();
```

:::tip
使用
:::

```js
import axios from './ajaxRequest';

axios.request({ url: '/test' });

axios.request({
  url: '/login',
  method: 'POST',
  data: {
    username,
  },
});
```

:::tip
全局路由拦截校验登录
:::

api.js
```js
import axios from '../lib/ajaxRequest';
// 全部是promise
export const getTest = () => axios.request({ url: '/test' });
export const login = username => axios.request({ url: '/login', method: 'POST', data: { username } });

export const validate = () => axios.request({ url: '/validate' });
export default {};
```

store.js
```js
import Vue from 'vue';
import Vuex from 'vuex';
import { validate } from './api';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    username: '',
  },
  mutations: {
    setUsername(state, username) {
      state.username = username;
    },
  },
  actions: {
    async validate({ commit }) {
      const r = await validate();
      if (r.code === 1) {
        return false;
      }
      commit('setUsername', r.username);
      localStorage.setItem('token', r.token);
      return true;
    }
  },
});
```

main.js
```js
const whiteList = ['/'];
router.beforeEach(async (to, from, next) => { // 路由的渲染流程  钩子的执行顺序
  // 要校验一下 当前用户登录没登录
  if (whiteList.includes(to.path)) {
    return next();
  }
  const flag = await store.dispatch('validate');
  if (flag) {
    if (to.path === '/login') {
      next('/');
    } else {
      next(); // 登录过而且不是login  那就ok 跳转吧
    }
  } else {
    // 没登录过 ，如果这条路由 还需要登录那么就跳转到登录页面
    // 看vue文档
    const flag = to.matched.some(item => item.meta.needLogin);
    if (flag) {
      next('/login');
    } else {
      next();
    }
  }
  next();
});
```