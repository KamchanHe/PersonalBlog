---
title: 做项目用过的axios封装
date: 2019-11-20
categories: article
author: Kamchan
tags:
- Javascript
- Axios
- Ajax
- Mint-ui
---

## ajax.js

```js
import axios from 'axios';
import { Indicator, Toast } from 'mint-ui';
import config from  './config'

let request = {};
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
				});
			} else {
				Toast(
					JSON.stringify({
						message: msg,
						duration: 1500,
					})
				);
			}
		}, 20);
	} else {
		Toast({
			message: '网络连接错误~',
			duration: 1500,
		});
	}
	Indicator.close();
	clearTimeout(timeOut);
};
/**
 * ajax
 * @param opt
 */
request.ajax = opt => {
	let option = {};
	let setTime = {};
	let time = new Date() * 1;
	let _showLoading = true; // 是否出現loading
	let loadingTime = config.loadingTime || 500; // 出现loading时间
	let method = opt.api.method || config.requestType.get;
	let url = opt.api.url;
	let headers = opt.headers || opt.api.headers || {};
	if (!url) {
		request.ajaxError('网络连接超时~', setTime[time]);
		return false;
	}
	if (opt.api && opt.api.loadingTime) {
		loadingTime = opt.api.loadingTime;
	}
	setTime[time] = setTimeout(() => {
		// 超过一定時間后出现加载条
		if (_showLoading) {
			Indicator.open({ text: 'Loading...', spinnerType: 'fading-circle' });
		}
	}, loadingTime);
	option.headers = headers;
	option.method = method;
	option.url = url;
	option.transformRequest = [
		function(data) {
			let ret = '';
			for (let it in data) {
				ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
			}
			return ret;
		},
	];
	option.headers = {
		'Content-Type': 'application/x-www-form-urlencoded',
	};
	if (opt.api && opt.api.inject) {
		// 自定义注入器
		option = opt.api.inject(option);
	}
	if (opt.data) {
		opt.data.token = localStorage.getItem('token') || '';
	} else {
		opt.data = {};
		opt.data.token = localStorage.getItem('token') || '';
	}
	if (method === config.requestType.get) {
		// get请求
		if (opt.data) {
			option.params = opt.data;
		}
	} else {
		// post请求
		if (opt.data) {
			option.data = opt.data;
		}
	}
	option.params = option.params || opt.params || {};

	return new Promise((resolve, reject) => {
		axios(option)
			.then(response => {
				request.render(response, opt, setTime, time, resolve);
				Indicator.close();
				clearTimeout(setTime[time]);
			})
			.catch(error => {
				let response = error.response;
				request.render(response, opt, setTime, time, resolve);
				Indicator.close();
				clearTimeout(setTime[time]);
			});
	});
};
request.render = (response, opt, setTime, time, resolve) => {
	if (response) {
		if (response.status === 503 || response.status === 404) {
			// 自定义状态码拦截器
			request.ajaxError(response.statusText, setTime[time]);
			if (opt.api.errorCallback instanceof Function) {
				opt.api.errorCallback(response.statusText);
			}
		} else if (response.status === 401) {
			console.log('TCL: request.render -> response', response);
			request.ajaxError(response.data.msg, setTime[time]);
			if (opt.api.errorCallback instanceof Function) {
				opt.api.errorCallback(response.data.msg);
			}
			setTimeout(() => {
				window.location.replace('/wap_front#/login');
			}, 1500);
		} else if (opt.api && opt.api.intercept) {
			opt.api.intercept(response.data, resolve, msg => {
				if (opt.api.errorCallback instanceof Function) {
					opt.api.errorCallback(msg);
				}
				request.ajaxError(msg, setTime[time]);
			});
		} else {
			resolve(response.data);
		}
	} else {
		if (opt.api.errorCallback instanceof Function) {
			opt.api.errorCallback('网络连接错误~');
		}
		request.ajaxError('网络连接错误~', setTime[time]);
	}
};
export default request;
```

## config.js

```js
let config = {};

config.requestType = {
    get: 'get',
    post: 'post',
    put: 'put',
    delete: 'delete',
    jsonp: 'jsonp'
};
config.api = api;
```

## api.js

```js
import config from  './config'
let intercept = async (response, resolve, errorCallBack) => {
	if (Number(response.code) === 1 || Number(response.code) === 10001) {
		resolve(response);
	} else {
		errorCallBack(response.msg);
	}
};
let inject = option => {
	option.headers = option.headers || {};
	// option.headers.token = localStorage.getItem('token');
	return option;
};

let api = {};
api.requestType = config.requestType;
let baseUrl = '';//服务器地址

if (process.env.NODE_ENV === 'production') {
	baseUrl = '';// 线上服务器地址
} else {
	baseUrl = '';// 开发服务器地址
}
// 请求的接口
api.apiName = {
	url: `${baseUrl}/xxx`,
	method: api.requestType.get,
	inject: inject,
	intercept: intercept,
};

export default api;
```

## 使用

### main.js

```js
import { request } from './ajax';
import api from './api';
Vue.prototype.$ajax = request.ajax;
Vue.prototype.$api = api;
```

### 组件中使用

```js
this.$ajax({
  api: this.$api.apiName,
  data: {
    // 参数
  }
}).then(res=>{
  // 接口返回的数据
})
```