---
title: Utils-常用方法
date: 2019-11-28
categories: article
author: Kamchan
tags:
  - Javascript
---

## 检查手机号

```js
checkPhone(tel) {
  return /^(?:(?:\+|00)86)?1\d{10}$/.test(tel);
},
```

## 检查邮箱

```js
checkEmail(email) {
  return /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(
    email
  );
},
```

## 图片拼接域名

```js
getImageUrl(url) {
  if (!url) {
    return "";
  }
  if (/^(http|https|static|wxfile:\/\/)/.test(url)) {
    return url;
  } else {
    return process.env.NODE_ENV === "production"
      ? "http://company.maolvxiansheng.top" + url
      : "http://dev.zjlp.test" + url;
  }
},
```

## 是否是空对象

```js
isEmptyObj(obj) {
  for (let el in obj) {
    return false;
  }
  return true;
},
```

## 微信内置浏览器的支付

```js
weChatPay(params) {
  if (typeof WeixinJSBridge == "undefined") {
    if (document.addEventListener) {
      document.addEventListener(
        "WeixinJSBridgeReady",
        function() {
          return onBridgeReady(params);
        },
        false
      );
    } else if (document.attachEvent) {
      document.attachEvent("WeixinJSBridgeReady", function() {
        return onBridgeReady(params);
      });
      document.attachEvent("onWeixinJSBridgeReady", function() {
        return onBridgeReady(params);
      });
    }
  } else {
    return onBridgeReady(params);
  }
  function onBridgeReady(obj) {
    return new Promise(resolve => {
      WeixinJSBridge.invoke(
        "getBrandWCPayRequest",
        {
          appId: obj.appId,
          timeStamp: obj.timeStamp,
          nonceStr: obj.nonceStr,
          package: obj.package,
          signType: obj.signType,
          paySign: obj.paySign
        },
        function(res) {
          resolve(res);
        }
      );
    });
  }
},
```

## img 转 base64

```js
getBase64Image(url, cb) {
  var image = new Image();
  image.src = url + "?v=" + Math.random(); // 处理缓存
  image.crossOrigin = "*"; // 支持跨域图片
  image.onload = function() {
    var canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, image.width, image.height);
    var dataURL = canvas.toDataURL("image/jpeg", 1); // 可选其他值 image/jpeg
    // handlerDownload(base64ToBlob(dataURL), 'post.jpg');
    cb(dataURL);
  };
},
```

## base64 转 blob

```js
base64ToBlob(code) {
  let parts = code.split(";base64,");
  let contentType = parts[0].split(":")[1];
  let raw = window.atob(parts[1]);
  let rawLength = raw.length;
  let uInt8Array = new Uint8Array(rawLength);
  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }
  return new Blob([uInt8Array], {
    type: contentType
  });
},
```

## 处理下载

```js
handlerDownload(data, fileName, contentType = "image/jpeg") {
  const blob = new Blob([data], {
    type: contentType
  });
  const downloadElement = document.createElement("a");
  const href = window.URL.createObjectURL(blob); // 创建下载的链接
  downloadElement.href = href;
  downloadElement.download = fileName; // 下载后文件名
  document.body.appendChild(downloadElement);
  downloadElement.click(); // 点击下载
  document.body.removeChild(downloadElement); // 下载完成移除元素
  window.URL.revokeObjectURL(href);
},
```

## 比较两个对象是否相等

```js
Compare(origin, target) {
  if (typeof target !== "object") {
    //target不是对象/数组
    return origin === target; //直接返回全等的比较结果
  }
  if (typeof origin !== "object") {
    //origin不是对象/数组
    return false; //直接返回false
  }
  if (origin == null && target == null) {
    return origin === target;
  }
  if (origin == undefined && target == undefined) {
    return origin === target;
  }
  if (origin.length == 0 && target.length == 0) {
    return true;
  }
  for (let key of Object.keys(target)) {
    //遍历target的所有自身属性的key
    if (!Compare(origin[key], target[key])) {
      //递归比较key对应的value，
      //value不等，则两对象不等，结束循环，退出函数，返回false
      return false;
    }
  }
  //遍历结束，所有value都深度比较相等，则两对象相等
  return true;
},
```

## 时间格式化

```js
formatTime(dateTime) {
  var date = new Date(dateTime);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  return (
    [year, month, day].map(formatNumber).join("-") +
    " " +
    [hour, minute].map(formatNumber).join(":")
  );
},
```

## 判断浏览器类型

```js
parseUA() {
  var u = navigator.userAgent;
  var u2 = navigator.userAgent.toLowerCase();
  return {
    //移动终端浏览器版本信息
    trident: u.indexOf("Trident") > -1, //IE内核
    presto: u.indexOf("Presto") > -1, //opera内核
    webKit: u.indexOf("AppleWebKit") > -1, //苹果、谷歌内核
    gecko: u.indexOf("Gecko") > -1 && u.indexOf("KHTML") == -1, //火狐内核
    mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
    android: u.indexOf("Android") > -1 || u.indexOf("Linux") > -1, //android终端或uc浏览器
    iPhone: u.indexOf("iPhone") > -1, //是否为iPhone或者QQHD浏览器
    iPad: u.indexOf("iPad") > -1, //是否iPad
    webApp: u.indexOf("Safari") == -1, //是否web应该程序，没有头部与底部
    iosv: u.substr(u.indexOf("iPhone OS") + 9, 3),
    weixin: u2.match(/MicroMessenger/i) == "micromessenger",
    ali: u.indexOf("AliApp") > -1
  };
},
```

## 微信小程序支付

```js
wepay(data) {
  return new Promise((resolve, reject) => {
    wx.requestPayment({
      provider: "wxpay",
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr,
      package: data.package,
      signType: data.signType,
      paySign: data.paySign,
      success: function(res) {
        // console.log('wepaysuccess:' + JSON.stringify(res));
        resolve(res);
      },
      fail: function(err) {
        // console.log('wepayfail:' + JSON.stringify(err));
        reject(err);
      }
    });
  });
},
```

## 微信小程序上传图片

```js
uploadFile(path, title = "上传中") {
  return new Promise((resolve, reject) => {
    wx.showLoading({
      title: title,
      mask: true
    });
    wx.uploadFile({
      url: api.uploadImg,
      filePath: path,
      name: "file",
      formData: {
        token: wx.getStorageSync("token")
      },
      success: res => {
        resolve(res);
      },
      fail: err => {
        reject(err);
      },
      complete: function() {
        wx.hideLoading();
      }
    });
  });
},
```

## 微信小程序选择图片

```js
chooseImg(count = 1) {
  return new Promise((resolve, reject) => {
    wx.chooseImage({
      count: count,
      sizeType: ["compressed", "original"],
      success: res => {
        resolve(res);
      },
      fail: err => {
        reject(err);
      }
    });
  });
},
```

## 微信小程序保存图片到手机相册

```js
saveImgToPhotosAlbum(imgUrl) {
  var imgSrc = imgUrl;
  wx.showLoading({
    title: "正在保存",
    icon: "none"
  });
  wx.downloadFile({
    url: imgSrc,
    success: function(res) {
      // console.log(res);
      //图片保存到本地
      wx.saveImageToPhotosAlbum({
        filePath: res.tempFilePath,
        success: function(data) {
          wx.hideLoading();
          wx.showToast({
            title: "保存成功",
            icon: "success",
            duration: 2000
          });
        },
        fail: function(err) {
          console.log(err);
          wx.hideLoading();
          if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
            wx.showToast({
              title: "如需保存该图片，请点击图片授权",
              icon: "none"
            });
          }
        },
        complete(res) {
          // console.log(res);
        }
      });
    },
    fail: function(err) {
      wx.hideLoading();
    }
  });
}
```

## Vue 项目启动时获取本机 IP 地址

#### getIp.js

```js
const os = require('os')
const ifaces = os.networkInterfaces() // 获取本机ip
let ip = ''

out: for (var i in ifaces) {
  for (var j in ifaces[i]) {
    var val = ifaces[i][j]
    if (val.family === 'IPv4' && val.address !== '127.0.0.1') {
      ip = val.address
      break out
    }
  }
}

module.exports = ip
```

#### 引入

```js
// webpack.dev.conf.js
const IP = require('./get-ip')
const HOST = process.env.HOST
...
devServer: {
	...
	host: HOST || config.dev.host || IP
}
// 当HOST和config.dev.host不存在时则使用本机IP
```

## 两个数字是否近似相等

#### approximatelyEqual

#### 此代码示例检查两个数字是否近似相等，差异值可以通过传参的形式进行设置

```js
const approximatelyEqual = (v1, v2, epsilon = 0.001) =>
  Math.abs(v1 - v2) < epsilon

approximatelyEqual(Math.PI / 2.0, 1.5708) // true
```

## arrayToCSV

#### 此段代码将没有逗号或双引号的元素转换成带有逗号分隔符的字符串即 CSV 格式识别的形式

```js
const arrayToCSV = (arr, delimiter = ',') =>
  arr.map(v => v.map(x => `"${x}"`).join(delimiter)).join('\n')

arrayToCSV([
  ['a', 'b'],
  ['c', 'd']
]) // '"a","b"\n"c","d"'
arrayToCSV(
  [
    ['a', 'b'],
    ['c', 'd']
  ],
  ';'
) // '"a";"b"\n"c";"d"'
```

## arrayToHtmlList

#### 此段代码将数组元素转换成`<li>`标记，并将此元素添加至给定的 ID 元素标记内。

```js
const arrayToHtmlList = (arr, listID) =>
  (el => (
    (el = document.querySelector('#' + listID)),
    (el.innerHTML += arr.map(item => `<li>${item}</li>`).join(''))
  ))()

arrayToHtmlList(['item 1', 'item 2'], 'myListID')
```

## 捕获函数异常

#### attempt

#### 此段代码执行一个函数，将剩余的参数传回函数当参数，返回相应的结果，并能捕获异常。

```js
const attempt = (fn, ...args) => {
  try {
    return fn(...args)
  } catch (e) {
    return e instanceof Error ? e : new Error(e)
  }
}
var elements = attempt(function(selector) {
  return document.querySelectorAll(selector)
}, '>_>')
if (elements instanceof Error) elements = [] // elements = []
```

## 返回平均数

#### average

#### 此段代码返回两个或多个数的平均数。

```js
const average = (...nums) =>
  nums.reduce((acc, val) => acc + val, 0) / nums.length
average(...[1, 2, 3]) // 2
average(1, 2, 3) // 2
```

## 数组分组

#### bifurcateBy

#### 此段代码将数组按照指定的函数逻辑进行分组，满足函数条件的逻辑为真，放入第一个数组中，其它不满足的放入第二个数组 。这里运用了 Array.prototype.reduce() 和 Array.prototype.push() 相结合的形式，基于函数过滤逻辑，通过 Array.prototype.push() 函数将其添加到数组中

```js
const bifurcateBy = (arr, fn) =>
  arr.reduce((acc, val, i) => (acc[fn(val, i) ? 0 : 1].push(val), acc), [
    [],
    []
  ])

bifurcateBy(['beep', 'boop', 'foo', 'bar'], x => x[0] === 'b')
// [ ['beep', 'boop', 'bar'], ['foo'] ]
```

## 页面是否到底

#### bottomVisible

#### 用于检测页面是否滚动到页面底部

```js
const bottomVisible = () =>
  document.documentElement.clientHeight + window.scrollY >=
  (document.documentElement.scrollHeight ||
    document.documentElement.clientHeight)

bottomVisible() // true
```

## 字符串字节长度

#### byteSize

#### 此代码返回字符串的字节长度。这里用到了 Blob 对象，Blob（Binary Large Object）对象代表了一段二进制数据，提供了一系列操作接口。其他操作二进制数据的 API（比如 File 对象），都是建立在 Blob 对象基础上的，继承了它的属性和方法。生成 Blob 对象有两种方法：一种是使用 Blob 构造函数，另一种是对现有的 Blob 对象使用 slice 方法切出一部分

```js
const byteSize = str => new Blob([str]).size

byteSize('😀') // 4
byteSize('Hello World') // 11
```

## 首字母小写

#### decapitalize

#### 将字符串的首字母转换成小写字母

```js
const decapitalize = ([first, ...rest]) => first.toLowerCase() + rest.join('')

decapitalize('FooBar') // 'fooBar'
```

## 首字母大写

#### capitalize

#### 将字符串的首字母转成大写,这里主要运用到了 ES6 的展开语法在数组中的运用

```js
const capitalize = ([first, ...rest]) => first.toUpperCase() + rest.join('')

capitalize('fooBar') // 'FooBar'
capitalize('fooBar', true) // 'FooBar'
```

## 每个单词首字母大写

#### capitalizeEveryWord

#### 将一个句子中每个单词首字母转换成大写字母，这里中要运用了正则表达式进行替换

```js
const capitalizeEveryWord = str =>
  str.replace(/\b[a-z]/g, char => char.toUpperCase())

capitalizeEveryWord('hello world!') // 'Hello World!'
```

## 创建目录

#### Create Directory

#### 此代码段使用 existSync() 检查目录是否存在，然后使用 mkdirSync() 创建目录（如果不存在）

```js
const fs = require('fs')
const createDirIfNotExists = dir =>
  !fs.existsSync(dir) ? fs.mkdirSync(dir) : undefined
createDirIfNotExists('test')
// creates the directory 'test', if it doesn't exist
```

## 当前访问的 URL

#### currentURL

#### 返回当前访问的 URL 地址

```js
const currentURL = () => window.location.href

currentURL() // 'https://medium.com/@fatosmorina'
```

## 今年的第几天

#### dayOfYear

#### 返回当前是今年的第几天

```js
const dayOfYear = date =>
  Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24)

dayOfYear(new Date()) // 272
```

## 多维数组=>一维数组

#### deepFlatten

#### 通过递归的形式，将多维数组展平成一维数组

```js
const deepFlatten = arr =>
  [].concat(...arr.map(v => (Array.isArray(v) ? deepFlatten(v) : v)))

deepFlatten([1, [2], [[3], 4], 5]) // [1,2,3,4,5]
```

## 对象去重

#### default

#### 去重对象的属性，如果对象中含有重复的属性，以前面的为准

```js
const defaults = (obj, ...defs) =>
  Object.assign({}, obj, ...defs.reverse(), obj)

defaults({ a: 1 }, { b: 2 }, { b: 6 }, { a: 3 }) // { a: 1, b: 2 }
```

## 异步调用函数

#### defer

#### 延迟函数的调用，即异步调用函数

```js
const defer = (fn, ...args) => setTimeout(fn, 1, ...args)

defer(console.log, 'a'), console.log('b') // logs 'b' then 'a'
```

## 角度=>弧度

#### degreesToRads

#### 此段代码将标准的度数，转换成弧度

```js
const degreesToRads = deg => (deg * Math.PI) / 180.0

degreesToRads(90.0) // ~1.5708
```

## 两个数组的差异

#### difference

#### 此段代码查找两个给定数组的差异，查找出前者数组在后者数组中不存在元素

```js
const difference = (a, b) => {
  const s = new Set(b)
  return a.filter(x => !s.has(x))
}

difference([1, 2, 3], [1, 2, 4]) // [3]
```

## 函数比较数组的差异

#### differenceBy

#### 通过给定的函数来处理需要对比差异的数组，查找出前者数组在后者数组中不存在元素

```js
const differenceBy = (a, b, fn) => {
  const s = new Set(b.map(fn))
  return a.filter(x => !s.has(fn(x)))
}

differenceBy([2.1, 1.2], [2.3, 3.4], Math.floor) // [1.2]
differenceBy([{ x: 2 }, { x: 1 }], [{ x: 1 }], v => v.x) // [ { x: 2 } ]
```

## 逻辑筛选数组的差异

#### differenceWith

#### 此段代码按照给定函数逻辑筛选需要对比差异的数组，查找出前者数组在后者数组中不存在元素

```js
const differenceWith = (arr, val, comp) =>
  arr.filter(a => val.findIndex(b => comp(a, b)) === -1)

differenceWith(
  [1, 1.2, 1.5, 3, 0],
  [1.9, 3, 0],
  (a, b) => Math.round(a) === Math.round(b)
)
// [1, 1.2]
```

## 数字拆分为数组

#### digitize

#### 将输入的数字拆分成单个数字组成的数组

```js
const digitize = n => [...`${n}`].map(i => parseInt(i))

digitize(431) // [4, 3, 1]
```

## 计算两点之间的距离

#### distance

```js
const distance = (x0, y0, x1, y1) => Math.hypot(x1 - x0, y1 - y0)

distance(1, 1, 2, 3) // 2.23606797749979
```

## 筛选数组

#### dropWhile

#### 按照给的的函数条件筛选数组，不满足函数条件的将从数组中移除

```js
const dropWhile = (arr, func) => {
  while (arr.length > 0 && !func(arr[0])) arr = arr.slice(1)
  return arr
}

dropWhile([1, 2, 3, 4], n => n >= 3) // [3,4]
```

## 筛选满足条件第一个 key

#### findKey

#### 按照给定的函数条件，查找第一个满足条件对象的键值

```js
const findKey = (obj, fn) =>
  Object.keys(obj).find(key => fn(obj[key], key, obj))

findKey(
  {
    barney: { age: 36, active: true },
    fred: { age: 40, active: false },
    pebbles: { age: 1, active: true }
  },
  o => o['active']
) // 'barney'
```

## 指定深度展平数组

#### flatten

#### 按照指定数组的深度，将嵌套数组进行展平

```js
const flatten = (arr, depth = 1) =>
  arr.reduce(
    (a, v) =>
      a.concat(depth > 1 && Array.isArray(v) ? flatten(v, depth - 1) : v),
    []
  )

flatten([1, [2], 3, 4]) // [1, 2, 3, 4]
flatten([1, [2, [3, [4, 5], 6], 7], 8], 2) // [1, 2, 3, [4, 5], 6, 7, 8]
```

## 指定函数条件送迭对象

#### forOwn

#### 此段代码按照给定的函数条件，支持三个参数作为输入（值、键、对象本身），进行迭代对象

```js
const forOwn = (obj, fn) =>
  Object.keys(obj).forEach(key => fn(obj[key], key, obj))
forOwn({ foo: 'bar', a: 1 }, v => console.log(v)) // 'bar', 1
```

## 获取当前时分秒

#### getColonTimeFromDate

#### 此段代码从 Date 对象里获取当前时间

```js
const getColonTimeFromDate = date => date.toTimeString().slice(0, 8)
getColonTimeFromDate(new Date()) // "08:38:00"
```

## 两个日期相差的天数

#### getDaysDiffBetweenDates

#### 此段代码返回两个日期之间相差多少天

```js
const getDaysDiffBetweenDates = (dateInitial, dateFinal) =>
  (dateFinal - dateInitial) / (1000 * 3600 * 24)

getDaysDiffBetweenDates(new Date('2019-01-13'), new Date('2019-01-15')) // 2
```

## 获取 DOM 元素的样式值

#### getStyle

#### 此代码返回 DOM 元素节点对应的属性值

```js
const getStyle = (el, ruleName) => getComputedStyle(el)[ruleName]

getStyle(document.querySelector('p'), 'font-size') // '16px'
```

## 获取数据类型

#### getType

#### 此段代码的主要功能就是返回数据的类型

```js
const getType = v =>
  v === undefined
    ? 'undefined'
    : v === null
    ? 'null'
    : v.constructor.name.toLowerCase()

getType(new Set([1, 2, 3])) // 'set'
```

## HTTP 重定向到 HTTPS

#### httpsRedirect

#### 此段代码的功能就是将 http 网址重定向 https 网址

```js
const httpsRedirect = () => {
  if (location.protocol !== 'https:')
    location.replace('https://' + location.href.split('//')[1])
}

httpsRedirect() // If you are on http://mydomain.com, you are redirected to https://mydomain.com
```

## 返回数组指定值的索引值

#### indexOfAll

#### 此代码可以返回数组中某个值对应的所有索引值，如果不包含该值，则返回一个空数组

```js
const indexOfAll = (arr, val) =>
  arr.reduce((acc, el, i) => (el === val ? [...acc, i] : acc), [])

indexOfAll([1, 2, 3, 1, 2, 3], 1) // [0,3]
indexOfAll([1, 2, 3], 4) // []
```

## 判断是否为指定类型

#### is

#### 此段代码用于判断数据是否为指定的数据类型，如果是则返回 true

```js
const is = (type, val) => ![, null].includes(val) && val.constructor === type

is(Array, [1]) // true
is(ArrayBuffer, new ArrayBuffer()) // true
is(Map, new Map()) // true
is(RegExp, /./g) // true
is(Set, new Set()) // true
is(WeakMap, new WeakMap()) // true
is(WeakSet, new WeakSet()) // true
is(String, '') // true
is(String, new String('')) // true
is(Number, 1) // true
is(Number, new Number(1)) // true
is(Boolean, true) // true
is(Boolean, new Boolean(true)) // true
```

## 判断前者日期是否晚于后者

#### isAfterDate

#### 接收两个日期类型的参数，判断前者的日期是否晚于后者的日期

```js
const isAfterDate = (dateA, dateB) => dateA > dateB

isAfterDate(new Date(2010, 10, 21), new Date(2010, 10, 20)) // true
```

## 检测两个单词是否相似

#### isAnagram

#### 用于检测两个单词是否相似

```js
const isAnagram = (str1, str2) => {
  const normalize = str =>
    str
      .toLowerCase()
      .replace(/[^a-z0-9]/gi, '')
      .split('')
      .sort()
      .join('')
  return normalize(str1) === normalize(str2)
}

isAnagram('iceman', 'cinema') // true
```

## 数组是否为类数组及是否可送迭

#### isArrayLike

#### 此段代码用于检测对象是否为类数组对象,是否可迭代。

```js
const isArrayLike = obj =>
  obj != null && typeof obj[Symbol.iterator] === 'function'

isArrayLike(document.querySelectorAll('.className')) // true
isArrayLike('abc') // true
isArrayLike(null) // false
```

## 当前环境是否为浏览器

#### getColonTimeFromDate

#### 用于判断程序运行环境是否在浏览器，这有助于避免在 node 环境运行前端模块时出错

```js
const isBrowser = () => ![typeof window, typeof document].includes('undefined')

isBrowser() // true (browser)
isBrowser() // false (Node)
```

## 当前页面活跃状态

#### isBrowserTabFocused

#### 用于判断当前页面是否处于活动状态（显示状态）

```js
const isBrowserTabFocused = () => !document.hidden
isBrowserTabFocused() // true
```

## 值是否为 null||undefined

#### isNil

#### 用于判断当前变量的值是否为 null 或 undefined 类型

```js
const isNil = val => val === undefined || val === null

isNil(null) // true
isNil(undefined) // true
```

## 是否为数字类型

#### isNumber

#### 用于检查当前的值是否为数字类型

```js
function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n)
}

isNumber('1') // false
isNumber(1) // true
```

## 是否为对象

#### isObject

#### 用于判断参数的值是否是对象，这里运用了 Object 构造函数创建一个对象包装器，如果是对象类型，将会原值返回

```js
const isObject = obj => obj === Object(obj)

isObject([1, 2, 3, 4]) // true
isObject([]) // true
isObject(['Hello!']) // true
isObject({ a: 1 }) // true
isObject({}) // true
isObject(true) // false
```

## 是否为 Object 构造的

#### isPlainObject

#### 此代码段检查参数的值是否是由 Object 构造函数创建的对象

```js
const isPlainObject = val =>
  !!val && typeof val === 'object' && val.constructor === Object

isPlainObject({ a: 1 }) // true
isPlainObject(new Map()) // false
```

## 是否是同一天

#### isSameDate

#### 用于判断给定的两个日期是否是同一天

```js
const isSameDate = (dateA, dateB) => dateA.toISOString() === dateB.toISOString()

isSameDate(new Date(2010, 10, 20), new Date(2010, 10, 20)) // true
```

## 是否为 JSON

#### isValidJSON

#### 用于判断给定的字符串是否是 JSON 字符串

```js
const isValidJSON = str => {
  try {
    JSON.parse(str)
    return true
  } catch (e) {
    return false
  }
}

isValidJSON('{"name":"Adam","age":20}') // true
isValidJSON('{"name":"Adam",age:"20"}') // false
isValidJSON(null) // true
```

