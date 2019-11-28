---
title: 微信公众号 优普道H5开发遇到的BUG
date: 2019-11-27
categories: article
author: Kamchan
tags:
  - Mac
  - MacOS Catalina
  - Javascript
  - Vue
  - H5
  - WeChat
---

## 导语

- 在微信授权方面，这是个不得不吐槽的点，不能本地调试，必须每次打包项目放到线上去调试，这个是真的不爽太浪费时间了。

- 而且 <font color='#c7254e'>vue</font> 开发并授权好像只能用 <font color='#c7254e'>hash</font> 路由，而且授权时返回在 <font color='#c7254e'>URL</font> 上的 <font color='#c7254e'>code</font> 码等参数会拼接在‘<font color='#c7254e'>#</font>’之前，而 <font color='#c7254e'>vue</font> 的 <font color='#c7254e'>query</font> 参数都是在‘#’之后的。

- 而且授权完成后最好把 <font color='#c7254e'>code</font> 这参数从 <font color='#c7254e'>URL</font> 上去掉，是为了避免不必要的麻烦，而且这个最好写全局路由导航守卫中，这样能保证每个页面授权，就算你想某个页面不授权也可以在 <font color='#c7254e'>from</font> 参数中去做判断不授权，还是比较方便的

- 最坑的一点是由于是<font color='#c7254e'>单页面应用</font>，在 <font color='#c7254e'>ios</font> 里微信只记录你<font color='#c7254e'>页面最后一次刷新的地址</font>

## 微信授权

做这个项目跳转到<font color='#c7254e'>pay.vue</font>获取支付页信息的时候，如果用户没有授权过，则需要用户授权并把授权返回的<font color='#c7254e'>code</font>传给后台更新用户信息并重新请求数据渲染

### pay.vue

```js
//获取支付页的详情
getPayPageData() {
	this.$ajax({
		api: this.$api.getPayPage,//获取支付页详情的接口
		data: {
			orders_id: this.orderId,//把确认页面生成的订单ID传过去
		},
	}).then(res => {
    if (res.code == 10001) {//如果返回的状态码为10001 则需要授权更新信息
      //utils.js文件绑到vue.prototype上 vue.prototype.$utils = utils;
      //路由使用了hash模式 导致code拼接到#号前面 用this.$router.query是拿不到的
      //像这样 https://www.baidu.com/zlb/?code=xxxxxxxxxx#/recharge
      this.code = this.$utils.getParam('code');
      //拿到code后 请求更新用户信息接口
	  	if (this.code) {
			  this.$ajax({
				  api: this.$api.bindWeChat,
				  data: {
					  code: this.code,//把拿到的code传给后台更新数据
				  },
			  }).then(r => {
          //把code更新后 重新请求后不再有10001 则继续往下走
				  this.getPayPageData();
			  });
			return;
      }
      //微信授权需要把当前的url通过encodeURIComponent转码 微信授权后会携带code回到此url
		  let url = encodeURIComponent(window.location.href);
		  this.$ajax({
			  api: this.$api.getAppId,//请求后台获取appid
      }).then(rs => {
        //跳转到微信授权地址
        //需要带上appid
        //静默授权 scope=snsapi_base
        //主动授权 scope=snsapi_userinfo
			  window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${rs.data.appid}&redirect_uri=${url}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
			});
			return;
    }
    //获取到数据了 对页面进行业务逻辑
    //...
	});
}

getParam(name) {
	let reg = new RegExp('(^|\\?|&)' + name + '=([^&]*)(\\s|&|$)', 'i');
	if (reg.test(location.href)) return unescape(RegExp.$2.replace(/\+/g, ' '));
	return '';
},
```

## 微信支付

### 路由模式

前端技术选型用的 <font color='#c7254e'>vuejs+vue-router</font>，<font color='#c7254e'>vue-router</font> 使用 <font color='#c7254e'>hashbang</font> 模式（使用 <font color='#c7254e'>hashbang</font> 也是为了避免微信 <font color='#c7254e'>jssdk</font> 的 <font color='#c7254e'>wx.config</font> 签名的坑）。在调用微信支付的时候(<font color='#c7254e'>IOS</font>)遇到提示”<font color='#c7254e'>URL 未注册</font>”，这通常是因为没有在微信支付后台正确配置授权目录的问题，但是我遇到并不是这个。
我在调试的时候发现唤起微信支付时，<font color='#c7254e'>IOS</font> 内打印日志中的 <font color='#c7254e'>URL</font> 和实际中的 <font color='#c7254e'>URL</font> 不一样安卓却是好的，我不知道是不是微信的 BUG。后来在网上搜寻答案，发现是下面这个问题：

### 问题原因

首先把当前页面叫做 <font color='#c7254e'>Current Page</font>。当我们从微信别的地方点击链接呼出微信浏览器时所落在的页面、或者点击微信浏览器的刷新按钮时所刷新的页面，我们叫做 <font color='#c7254e'>Landing Page</font>。
举个例子，我们从任何地方点击链接进入页面 A，然后依次浏览到 B、C、D，那么 Current Page 就是 D，而 Landing Page 是 A，如果此时我们在 D 页面点击一下浏览器的刷新按钮，那么 Landing Page 就变成了 D（以上均是在单页应用的环境下，即以 hashbang 模式通过 js 更改浏览器路径，直接 href 跳转的不算）。

问题来了，在 iOS 和安卓下呼出微信支付的时候，微信支付判断当前路径的规则分别是：

<font color='#c7254e'>IOS：Landing Page</font>
<font color='#c7254e'>安卓：Current Page</font>

这就意味着，在 ios 环境下，任何一个页面都有可能成为支付页面（因为我无法预知和控制用户在哪个页面点微信浏览器的刷新按钮，或是用户通过哪个连接从外部进入到系统）。

### 解决

- 1、配置好支付路径 - 登录微信商户平台-产品中心-开发配置，配置支付授权路径。如果掉起支付的页面在 <font color='#c7254e'>域名/pay.html</font> 中，那么就在此添加授权路径，如我的掉起支付的页面在<font color='#c7254e'>http://example.com/#/cart/pay.html</font> 中，那么授权目录就配置为<font color='#c7254e'>http://example.com/</font>

- 2、对支付页面的 URL 做处理
  将所有的路由#前加了一个？，于是微信浏览器妥妥的把井号“#”后面的内容给去掉了

```
原来路由链接：
http://example.com/#/cart/index
现在路由链接：
http://example.com/?#/cart/index
```

我们只要将授权目录设置到根目录<font color='#e7254e'>http://example.com/</font>即可

```js
directRightUrl() {
	let { href, protocol, host, pathname, search, hash } = window.location;
	console.log(window.location);
	search = search || '?';
	let newHref = `${protocol}//${host}${pathname}${search}${hash}`;
	console.log('newHref', newHref, newHref !== href);
	if (newHref !== href) {
		window.location.replace(newHref);
	}
},
```

### 调用微信支付接口

#### pay.vue 调用支付接口

```js
//请求后台获取调取微信支付的参数
this.$ajax({
  api: _this.$api.weChatPay,
  data: {
    orders_id: _this.orderId
  }
}).then(rl => {
  let payInfo;
  //对获取回来的配置参数字符串转成对象
  try {
    payInfo = JSON.parse(rl.data.brand_wcpayrequest);
  } catch (error) {
    payInfo = {};
  }
  console.log("支付参数", payInfo);
  //调用微信支付接口
  this.$utils.weChatPay(payInfo).then(ra => {
    console.log("支付成功啦——pay/pay", ra);
  });
});
```

### utils.js 常用方法

```js
weChatPay(params) {
	if (typeof WeixinJSBridge == 'undefined') {
		if (document.addEventListener) {
			document.addEventListener(
				'WeixinJSBridgeReady',
				function() {
					return onBridgeReady(params);
				},
				false
			);
		} else if (document.attachEvent) {
			document.attachEvent('WeixinJSBridgeReady', function() {
				return onBridgeReady(params);
			});
			document.attachEvent('onWeixinJSBridgeReady', function() {
				return onBridgeReady(params);
			});
		}
	} else {
		return onBridgeReady(params);
	}
	function onBridgeReady(obj) {
		return new Promise(resolve => {
			// eslint-disable-next-line no-undef
			WeixinJSBridge.invoke(
				'getBrandWCPayRequest',
				{
					appId: obj.appId,
					timeStamp: obj.timeStamp,
					nonceStr: obj.nonceStr,
					package: obj.package,
					signType: obj.signType,
					paySign: obj.paySign,
				},
				function(res) {
					resolve(res);
				}
			);
		});
	}
},
getParam(name) {
	let reg = new RegExp('(^|\\?|&)' + name + '=([^&]*)(\\s|&|$)', 'i');
	if (reg.test(location.href)) return unescape(RegExp.$2.replace(/\+/g, ' '));
	return '';
},
checkPhone(tel) {
	return /^(?:(?:\+|00)86)?1\d{10}$/.test(tel);
},
checkEmail(email) {
	// eslint-disable-next-line no-useless-escape
	return /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email);
},
getImageUrl(url) {
	if (!url) {
		return '';
	}
	if (/^(http|https|static|wxfile:\/\/)/.test(url)) {
		return url;
	} else {
		return process.env.NODE_ENV === 'production'
			? 'http://company.maolvxiansheng.top' + url
			: 'http://dev.zjlp.test' + url;
	}
},
isEmptyObj(obj) {
	for (let el in obj) {
		return false;
	}
	return true;
}
```

### 支付非法

微信确认支付合法路径的时候，ios 取 Landing Page， Android 取 Current Page。即 ios 认为合法路径的配置应该是 https://example.com/lesson/，而 Android 认为合法路径的配置应该是 https://example.com/lesson/redpacket/。 导致微信支付合法 url 认定不一致的问题。一种解决办法是就在微信开放平台设置两个合法路径

## 分享

### 插件 m-share 实现

[m-share](https://github.com/backToNature/m-share#readme)

### 全局签名封装

```js
router.afterEach((to, from) => {
  request
    .ajax({
      api: api.checkLogin
    })
    .then(res => {
      if (res.data.islogin) {
        const u = navigator.userAgent;
        const isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        let _url = window.location.origin + to.fullPath;
        if (isIOS) {
          _url = window.location.href.split("#")[0];
        }
        console.log("url", _url);
        request
          .ajax({
            api: api.getWxSdkConfig,
            data: {
              apis: "updateTimelineShareData,onMenuShareTimeline",
              url: _url
            }
          })
          .then(rs => {
            let data = JSON.parse(rs.data);
            Mshare.wxConfig({
              wx: {
                appId: data.appId, // 必填，公众号的唯一标识
                timestamp: data.timestamp, // 必填，生成签名的时间戳
                nonceStr: data.nonceStr, // 必填，生成签名的随机串
                signature: data.signature // 必填，签名
              }
            });
          });
      }
    });
});
```

### vue wxconfig 签名组件

#### wxPay.js

```js
import wx from 'weixin-js-sdk
var AppId = ''
var Timestamp = ''
var Signature = ''
var Noncestr = ''
function GetSignature (callback) {
  // qryWxSignature 这个是调用后台获取签名的接口
  qryWxSignature({
    url: window.location.href.split('#')[0]
  }).then((data) => {
    AppId = data.appId
    Timestamp = data.timestamp
    Signature = data.signature
    Noncestr = data.nonceStr
    wx.config({
      beta: true,
      debug: false,
      appId: AppId,
      timestamp: Timestamp,
      nonceStr: Noncestr,
      signature: Signature,
      // 这里是把所有的方法都写出来了 如果只需要一个方法可以只写一个
      jsApiList: [
        'checkJsApi',
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'onMenuShareQQ',
        'onMenuShareWeibo',
        'hideMenuItems',
        'showMenuItems',
        'hideAllNonBaseMenuItem',
        'showAllNonBaseMenuItem',
        'translateVoice',
        'startRecord',
        'stopRecord',
        'onRecordEnd',
        'playVoice',
        'pauseVoice',
        'stopVoice',
        'uploadVoice',
        'downloadVoice',
        'chooseImage',
        'previewImage',
        'uploadImage',
        'downloadImage',
        'getNetworkType',
        'openLocation',
        'getLocation',
        'hideOptionMenu',
        'showOptionMenu',
        'closeWindow',
        'scanQRCode',
        'chooseWXPay',
        'openProductSpecificView',
        'addCard',
        'chooseCard',
        'openCard',
        'openWXDeviceLib',
        'closeWXDeviceLib',
        'configWXDeviceWiFi',
        'getWXDeviceInfos',
        'sendDataToWXDevice',
        'startScanWXDevice',
        'stopScanWXDevice',
        'connectWXDevice',
        'disconnectWXDevice',
        'getWXDeviceTicket',
        'WeixinJSBridgeReady',
        'onWXDeviceBindStateChange',
        'onWXDeviceStateChange',
        'onScanWXDeviceResult',
        'onReceiveDataFromWXDevice',
        'onWXDeviceBluetoothStateChange'
      ]
    })
    wx.ready(function () {
      console.log(callback, 'callback')
      if (callback) callback()
    })
  })
}
export {
  GetSignature
}
```

#### 使用

```js
import { GetSignature } from './wxPay'
import wx from 'weixin-js-sdk'
payNow() {
  var that = this
  GetSignature(() => {
    // wxpayPreOrder 为后台微信支付接口
    wxpayPreOrder(this.payMsg).then(res => {
      wx.chooseWXPay({
         // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。
         // 但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
        timestamp: res.timeStamp,
        // 支付签名随机串，不长于 32 位
        nonceStr: res.nonceStr,
        package: res.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
        signType: res.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
        paySign: res.paySign, // 支付签名
        success: function(res) {
          // 支付成功后的回调函数
        },
        fail: function(res) {
          console.log('支付失败')
        },
        complete: function(res) {
          console.log(res, 'complete')
        }
      })
    })
  })
}
```

### 手写实现分享

- 1、通过 npm 安装 微信的 js-sdk，当然你也可以在 index.html 页面中直接加 script 标签来引用，哪种方式都可以。

      		npm install weixin-js-sdk --save-dev

- 2、在 Vue 目录下，比如：common 文件夹，新建一个 js 文件，起名你随意，我这边叫 wxapi.js，贴入下面代码(PS: Axios 根据实际情况来使用)：

```js
/**
 * 微信js-sdk
 * 参考文档：https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141115
 */
import wx from "weixin-js-sdk";
import Axios from "axios";
const wxApi = {
  /**
   * [wxRegister 微信Api初始化]
   * @param  {Function} callback [ready回调函数]
   */
  wxRegister(callback) {
    // 这边的接口请换成你们自己的
    Axios.post(
      "/api/wechat/shares",
      { reqUrl: window.location.href },
      { timeout: 5000, withCredentials: true }
    )
      .then(res => {
        let data = JSON.parse(res.data.data); // PS: 这里根据你接口的返回值来使用
        wx.config({
          debug: false, // 开启调试模式
          appId: data.appId, // 必填，公众号的唯一标识
          timestamp: data.timestamp, // 必填，生成签名的时间戳
          nonceStr: data.noncestr, // 必填，生成签名的随机串
          signature: data.signature, // 必填，签名，见附录1
          jsApiList: data.jsApiList // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
      })
      .catch(error => {
        console.log(error);
      });
    wx.ready(res => {
      // 如果需要定制ready回调方法
      if (callback) {
        callback();
      }
    });
  },
  /**
   * [ShareTimeline 微信分享到朋友圈]
   * @param {[type]} option [分享信息]
   * @param {[type]} success [成功回调]
   * @param {[type]} error   [失败回调]
   */
  ShareTimeline(option) {
    wx.onMenuShareTimeline({
      title: option.title, // 分享标题
      link: option.link, // 分享链接
      imgUrl: option.imgUrl, // 分享图标
      success() {
        // 用户成功分享后执行的回调函数
        option.success();
      },
      cancel() {
        // 用户取消分享后执行的回调函数
        option.error();
      }
    });
  },
  /**
   * [ShareAppMessage 微信分享给朋友]
   * @param {[type]} option [分享信息]
   * @param {[type]} success [成功回调]
   * @param {[type]} error   [失败回调]
   */
  ShareAppMessage(option) {
    wx.onMenuShareAppMessage({
      title: option.title, // 分享标题
      desc: option.desc, // 分享描述
      link: option.link, // 分享链接
      imgUrl: option.imgUrl, // 分享图标
      success() {
        // 用户成功分享后执行的回调函数
        option.success();
      },
      cancel() {
        // 用户取消分享后执行的回调函数
        option.error();
      }
    });
  }
};
export default wxApi;
```

- 3、使用 - 在 Vue 页面，比如首页，先引入刚刚的 js 文件：

      			import wxapi from '@/common/wxapi.js'

      	- 在mounted()中加入调用的代码：

      			wxapi.wxRegister(this.wxRegCallback)

      	- 然后再methods中加入下面3个方法：

```js
wxRegCallback () {
  // 用于微信JS-SDK回调
  this.wxShareTimeline()
  this.wxShareAppMessage()
},
wxShareTimeline () {
  // 微信自定义分享到朋友圈
  let option = {
    title: '限时团购周 挑战最低价', // 分享标题, 请自行替换
    link: window.location.href.split('#')[0], // 分享链接，根据自身项目决定是否需要split
    imgUrl: 'logo.png', // 分享图标, 请自行替换，需要绝对路径
    success: () => {
      alert('分享成功')
    },
    error: () => {
      alert('已取消分享')
    }
  }
  // 将配置注入通用方法
  wxapi.ShareTimeline(option)
},
wxShareAppMessage () {
  // 微信自定义分享给朋友
  let option = {
    title: '限时团购周 挑战最低价', // 分享标题, 请自行替换
    desc: '限时团购周 挑战最低价', // 分享描述, 请自行替换
    link: window.location.href.split('#')[0], // 分享链接，根据自身项目决定是否需要split
    imgUrl: 'logo.png', // 分享图标, 请自行替换，需要绝对路径
    success: () => {
      alert('分享成功')
    },
    error: () => {
      alert('已取消分享')
    }
  }
  // 将配置注入通用方法
  wxapi.ShareAppMessage(option)
}
```

:::tip config:fail,Error: AppID 不合法
以上几步即实现了微信的分享功能，如果期间遇到问题，请自己开启 debug 调试模式，并根据错误提示的内容去解决。一般如果后端接口没问题的话，前端一般只会遇到：签名验证失败或者 URL 的问题。😆
:::

### 补充说明：jsApiList 的值

[微信官网 jsApiList](https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html)

```
onMenuShareTimeline
onMenuShareAppMessage
onMenuShareQQ
onMenuShareWeibo
onMenuShareQZone
startRecord
stopRecord
onVoiceRecordEnd
playVoice
pauseVoice
stopVoice
onVoicePlayEnd
uploadVoice
downloadVoice
chooseImage
previewImage
uploadImage
downloadImage
translateVoice
getNetworkType
openLocation
getLocation
hideOptionMenu
showOptionMenu
hideMenuItems
showMenuItems
hideAllNonBaseMenuItem
showAllNonBaseMenuItem
closeWindow
scanQRCode
chooseWXPay
openProductSpecificView
addCard
chooseCard
openCard
```

## keep-alive 保持当前位置

[vue-navigation](https://www.npmjs.com/package/vue-navigation)

[vue-page-stack](https://www.npmjs.com/package/vue-page-stack)

app.vue

```html
<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>
```

main.js

```js
router.beforeEach(function(to, from, next) {
  if (from.meta.scrollTop == false) {
    store.commit("recordScrollTop", document.documentElement.scrollTop);
  }
  next();
});

router.afterEach((to, from) => {
  // 如果进入后的页面是要滚动到顶部，则设置scrollTop = 0
  // 否则从vuex中读取上次离开本页面记住的高度，恢复它
  if (to.meta.scrollTop == true) {
    setTimeout(() => {
      document.documentElement.scrollTop = 0;
    }, 10);
  } else {
    setTimeout(() => {
      document.documentElement.scrollTop = store.state.cart.scrollTop;
    }, 50);
  }
});
```

router.js

```js
const routes = [
  {
    path: "/",
    redirect: "/home"
  },
  {
    path: "/home",
    name: "home",
    component: Home,
    meta: {
      keepAlive: true,
      scrollTop: false
    }
  },
  {
    path: "/cart",
    name: "cart",
    component: Cart,
    meta: {
      keepAlive: false,
      scrollTop: true
    }
  },
  {
    path: "/mine",
    name: "mine",
    component: Mine,
    meta: {
      keepAlive: false,
      scrollTop: true
    }
  }
];
```

store/index.js

```js
import Vue from "vue";
import Vuex from "vuex";
import cart from "./modules/cart";
Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    cart
  }
});
```

store/cart.js

```js
const _state = {
  scrollTop: 0
};
const mutations = {
  recordScrollTop(state, n) {
    state.scrollTop = n;
  }
};

const getters = {
  getScrollTop(state) {
    return state.scrollTop;
  }
};
export default {
  state: _state,
  mutations,
  getters
};
```

## Input

### iOS

iOS 下 input 输入框聚焦后 页面会往上弹 防止输入框被软键盘挡住
当 input 失去焦点后 页面不会归位 导致一些点击不了

#### 解决方法

给 input 绑定 <font color='#c7254e'>@blur='inputBlur'</font>事件

```js
inputBlur() {
	window.scrollTo(0, 0);
}
```

### Android

Android 下 input 输入框聚焦后 输入框被软键盘挡住

#### 解决方法

给 input 绑定 <font color='#c7254e'>@focus='inputFocus'</font>事件

```js
inputFocus() {
	document.querySelector('#id').scrollIntoView();
},
```
