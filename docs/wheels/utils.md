---
title: Utils-常用方法
date: 2019-11-28
categories: article
author: Kamchan
tags:
  - Javascript
---

## utils.js

### 检查手机号

```js
checkPhone(tel) {
  return /^(?:(?:\+|00)86)?1\d{10}$/.test(tel);
},
```

### 检查邮箱

```js
checkEmail(email) {
  return /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(
    email
  );
},
```

### 图片拼接域名

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

### 是否是空对象

```js
isEmptyObj(obj) {
  for (let el in obj) {
    return false;
  }
  return true;
},
```

### 微信内置浏览器的支付

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

### img 转 base64

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

### base64 转 blob

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

### 处理下载

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

### 比较两个对象是否相等

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

### 时间格式化

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

### 判断浏览器类型

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

### 微信小程序支付

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

### 微信小程序上传图片

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

### 微信小程序选择图片

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

### 微信小程序保存图片到手机相册

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

## Vue项目启动时自动获取本机 IP 地址

### getIp.js

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

### 引入

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
