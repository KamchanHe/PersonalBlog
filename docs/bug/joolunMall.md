---
title: 小程序开发用到的方法组件
date: 2021-07-15
categories: article
author: Kamchan
tags:
  - Javascript
  - Npm
  - 小程序
  - Utils
  - Bug
  - UniApp
---

## 弹幕

### css3 方法

#### 组件

[barrage 组件](https://kamchan.oss-cn-shenzhen.aliyuncs.com/miniprogram_barrage/barrage.zip)

#### 组件代码

```vue
<template>
  <view class="view">
    <view
      :style="{ animation: `first 10s linear forwards;top:${item.top}rpx;color:${item.color}` }"
      class="item"
      v-for="(item, index) in bulletChatData"
      :key="index"
    >
      <text class="label">{{ item.text }}</text>
    </view>
  </view>
</template>

<script>
var bulletChatList = [];
var id = 0;
var cycle = null; //计时器
var topArray = [30, 120, 210, 300]; //用来做随机top值
var usedTop = [];
export default {
  props: {
    messageList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      bulletChatData: [],
    };
  },
  mounted() {
    cycle = setInterval(() => {
      let arr = this.messageList;
      if (arr[id] == undefined) {
        id = 0;
        // 2.无限循环弹幕
        var obj = {};
        obj.text = arr[id].text;
        var num = Math.floor(Math.random() * topArray.length);
        obj.top = topArray[num]; //拿到随机值 Math.ceil向上取整
        // 被使用了，从原数组删掉并添加到已使用的数组里
        usedTop.push(topArray[num]);
        topArray.splice(num, 1);
        obj.color = this.getRandomColor();
        bulletChatList.push(obj);
        this.bulletChatData = bulletChatList;
        id++;
      } else {
        var obj = {};
        obj.text = arr[id].text;
        var num = Math.floor(Math.random() * topArray.length);
        obj.top = topArray[num]; //拿到随机值
        // 被使用了，从原数组删掉并添加到已使用的数组里
        usedTop.push(topArray[num]);
        topArray.splice(num, 1);
        obj.color = this.getRandomColor();
        bulletChatList.push(obj);
        this.bulletChatData = bulletChatList;
        id++;
      }
      if (usedTop.length >= 4) {
        // 从已使用的数组删掉并添加到原数组里
        topArray.push(usedTop.shift());
      }
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(cycle);
    ids = 0;
    bulletChatList = [];
  },
  methods: {
    getRandomColor() {
      let rgb = [];
      for (let i = 0; i < 3; ++i) {
        let color = Math.floor(Math.random() * 256).toString(16);
        color = color.length == 1 ? "0" + color : color;
        rgb.push(color);
      }
      return "#" + rgb.join("");
    },
  },
};
</script>

<style lang="scss" scoped>
.barrage-component {
  position: relative;
}
.item {
  position: absolute;
  white-space: nowrap;
  /* 防止向下换行*/
  animation-timing-function: linear;
  animation-fill-mode: none;

  display: flex;
  align-items: center;
  flex-wrap: nowrap;
}
.label {
  font-size: 30rpx;
}

.view {
  z-index: 3;
  height: 20%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
</style>
<style lang="scss">
@keyframes first {
  from {
    transform: translate3d(750rpx, 0, 0);
  }
  to {
    transform: translate3d(calc(-100% + -750rpx), 0, 0);
    visibility: hidden;
  }
}
</style>
```

### 小程序官方组件

#### 文档

[Barrage for MiniProgram](https://developers.weixin.qq.com/miniprogram/dev/extended/component-plus/barrage.html)

#### 使用

- 把组件放到根目录下的<font color='#e7254e'>src/wxcomponents</font>

![BarrageForMiniProgram](https://kamchan.oss-cn-shenzhen.aliyuncs.com/miniprogram_barrage/BarrageForMiniProgram.png)

- 然后在<font color='#e7254e'>根目录下的 pages.json 文件中</font>引入

![use](https://kamchan.oss-cn-shenzhen.aliyuncs.com/miniprogram_barrage/use.png)

#### 使用代码

```vue
<template>
  <view class="barrage-box">
    <barrage class="barrage"></barrage>
  </view>
</template>

<script>
// randomData的方法下面写有
import randomData from "@/utils/randomData.js";
export default {
  name: "WishWall",
  methods: {
    /**
     * 获取弹幕数据
     * @param {void}
     * @return {void}
     */
    handleGetWishWallAllList() {
      // 这里改为你自己请求数据的接口函数
      this.$u.api.getWishWallAllList().then((res) => {
        // 以下改为你自己处理数据
        const { data = [] } = res;
        data.forEach((item) => {
          let { context } = item;
          try {
            context = JSON.parse(context);
          } catch (error) {
            context = [];
          }
          context.forEach((el) => {
            const value = Object.values(el);
            if (value && value[0]) {
              item.text = item.username ? item.username + "：" + value[0] : value[0];
            }
          });
        });
        // 处理完数据保存并调用
        this.wishWallAllList = data;
        this.addBarrage(data);
      });
    },
    /**
     *
     * 调用小程序弹幕组件
     * @param {array} barrageList 弹幕数据[{content:'弹幕内容',avatar:'头像',username:'用户名',...}]
     * @return {void}
     */
    addBarrage(barrageList) {
      // 获取展示弹幕的dom元素
      const barrageComp = this.selectComponent(".barrage");
      this.barrage = barrageComp.getBarrageInstance({
        font: "bold 16px sans-serif",
        duration: 10,
        lineHeight: 2,
        mode: "separate", // 弹幕重叠 overlap  不重叠 separate
        padding: [10, 0, 10, 0], // 弹幕区四周留白
        tunnelShow: false, // 是否显示弹道
      });
      // 开启弹幕
      this.barrage.open();
      const msgs = barrageList; // 后端返回的数据
      const data = randomData(msgs, msgs.length); // 生成弹幕格式数据
      this.barrage.addData(data); // 添加数据到弹幕实例里
      // 不定时添加数据就会没弹幕了
      this.timer = setInterval(() => {
        const data = randomData(msgs, msgs.length);
        this.barrage.addData(data);
      }, 3000); // 定时器添加数据
    },
  },
};
</script>
```

#### randomData.js

```js
// 获取 max-min内的随机数
const getRandom = (max = 10, min = 0) => {
  return Math.floor(Math.random() * (max - min) + min);
};

// 指定颜色
const color = ["rgba(214, 100, 30, 0.8)", "rgba(8, 155, 138, 0.8)", "rgba(130, 82, 233, 0.8)", "rgba(249, 73, 97, 0.8)"];

/**
 * 生成指定格式数据
 * @param {object} contents 弹幕单项数据
 * @param {number} num 数量
 * @return {void}
 */
const randomData = (contents, num = 3) => {
  const data = [];
  for (let i = 0; i < num; i++) {
    // const msgId = getRandom(contents.length); // 随机
    const msgId = i; // 顺序
    // const colorId = getRandom(color.length); // 指定颜色中随机
    const target = contents[msgId];
    data.push({
      color: getRandomColor(), // 随机颜色
      // color: color[colorId], // 指定颜色中随机
      content: target.text, // 弹幕内容
      image: {
        head: { src: target.avatar, width: 30, height: 30 }, // 弹幕头部添加图片
        // tail: {src, width, height}, // 弹幕尾部添加图片
        gap: 4, // 图片与文本间隔
      },
    });
  }
  return data;
};

/**
 * 获取随机颜色
 * @param {void}
 * @return {void}
 */
const getRandomColor = function() {
  let rgb = [];
  for (let i = 0; i < 3; ++i) {
    let color = Math.floor(Math.random() * 256).toString(16);
    color = color.length == 1 ? "0" + color : color;
    rgb.push(color);
  }
  return "#" + rgb.join("");
};

export default randomData;
```

### 根据官方组件 基于 canvas 改进 添加背景色

:::tip
目前只支持纯文本
如需展示头像
需要自己在核心代码里改进
:::

#### 核心代码 barrage.js

[barrage.js](https://kamchan.oss-cn-shenzhen.aliyuncs.com/miniprogram_barrage/barrage.js)

```js
// 页面描述：弹幕类，参考自微信拓展工具：https://developers.weixin.qq.com/miniprogram/dev/extended/component-plus/barrage.html

// 获取字节长度，中文算2个字节
function getStrLen(str) {
  return str.replace(/[^\x00-\xff]/g, "aa").length;
}

// 截取指定字节长度的子串
function substring(str, n) {
  if (!str) return "";

  const len = getStrLen(str);
  if (n >= len) return str;

  let l = 0,
    result = "";
  for (let i = 0; i < str.length; i++) {
    const ch = str.charAt(i);
    l = /[^\x00-\xff]/i.test(ch) ? l + 2 : l + 1;
    result += ch;
    if (l >= n) break;
  }
  return result;
}

function compareVersion(v1, v2) {
  v1 = v1.split(".");
  v2 = v2.split(".");
  const len = Math.max(v1.length, v2.length);

  while (v1.length < len) {
    v1.push("0");
  }
  while (v2.length < len) {
    v2.push("0");
  }

  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i]);
    const num2 = parseInt(v2[i]);

    if (num1 > num2) {
      return 1;
    } else if (num1 < num2) {
      return -1;
    }
  }
  return 0;
}

// Barrage(控制中心)
class Barrage {
  constructor(selector, opt = {}) {
    this._promise = new Promise((resolve, reject) => {
      const defaultBarrageOpt = {
        width: 300,
        height: 150,
        canvasWidth: 300, // ratio * width
        canvasHeight: 150, // ratio * height
        font: "10px sans-serif",
        duration: 5, // 弹幕屏幕停留时长
        lineHeight: 1.2,
        padding: [10, 0, 10, 0],
        tunnelHeight: 0,
        tunnelNum: 0,
        tunnelMaxNum: 10, // 隧道最大缓冲长度
        maxLength: 40, // 最大字节长度，汉字算双字节
        safeArea: 40, // 发送时的安全间隔
        tunnels: [],
        idleTunnels: [],
        enableTunnels: [],
        alpha: 1, // 全局透明度
        mode: "separate", // 弹幕重叠 overlap  不重叠 separate
        range: [0, 1], // 弹幕显示的垂直范围，支持两个值。[0,1]表示弹幕整个随机分布，
        fps: 60, // 刷新率
        tunnelShow: false, // 显示轨道线
      };
      opt = Object.assign({}, defaultBarrageOpt, opt);
      for (const key in opt) {
        this[key] = opt[key];
      }
      const systemInfo = wx.getSystemInfoSync();
      this.SDKVersion = systemInfo.SDKVersion;
      this.ratio = systemInfo.pixelRatio;
      this.useWebLayerCanvas = compareVersion(this.SDKVersion, "2.9.0") >= 0 ? true : false;
      this.selector = selector;

      const query = wx.createSelectorQuery();
      query.select(selector).boundingClientRect();
      if (this.useWebLayerCanvas) {
        query.select(selector).node();
        query.exec((res) => {
          this.canvas = res[1].node;
          this.init(res[0]);
          this.canvas ? resolve() : reject();
        });
      } else {
        query.select(selector).context();
        query.exec((res) => {
          this.ctx = res[1].context;
          this.init(res[0]);
          this.ctx ? resolve() : reject();
        });
      }
    });
  }

  resize(opt = {}) {
    this._promise.then(() => {
      const query = wx.createSelectorQuery();
      query.select(this.selector).boundingClientRect();
      query.exec((res) => {
        this.close();
        for (const key in opt) {
          this[key] = opt[key];
        }
        this.init(res[0]);
        this.open();
      });
    });
  }

  init(opt = {}) {
    this.width = opt.width;
    this.height = opt.height;
    this.fontSize = this.getFontSize(this.font);

    if (this.useWebLayerCanvas) {
      const ratio = this.ratio; // 设备像素比
      this.canvas.width = this.canvasWidth = this.width * ratio;
      this.canvas.height = this.canvasHeight = this.height * ratio;
      this.ctx = this.canvas.getContext("2d");
      this.ctx.scale(ratio, ratio);

      this.ctx.textBaseline = "middle";
      this.ctx.globalAlpha = this.alpha;
      this.ctx.font = this.font;
    }
    // canvas 非同层下无法保存全局状态

    // reset
    this.idleTunnels = [];
    this.enableTunnels = [];
    this.tunnels = [];

    this.availableHeight = this.height - this.padding[0] - this.padding[2];
    this.tunnelHeight = this.fontSize * this.lineHeight + 20;
    this.tunnelNum = Math.floor(this.availableHeight / this.tunnelHeight);
    for (let i = 0; i < this.tunnelNum; i++) {
      this.idleTunnels.push(i); // 空闲的隧道id集合
      this.enableTunnels.push(i); // 可用的隧道id集合
      this.tunnels.push(
        new Tunnel(this, {
          // 隧道集合
          width: this.width,
          height: this.tunnelHeight,
          safeArea: this.safeArea,
          maxNum: this.tunnelMaxNum,
          tunnelId: i,
        })
      );
    }
    // 筛选符合范围的隧道
    this.setRange();
    this._isActive = false;
  }

  // 设置显示范围 range: [0,1]
  setRange(range) {
    this._promise.then(() => {
      range = range || this.range;
      const top = range[0] * this.tunnelNum;
      const bottom = range[1] * this.tunnelNum;

      // 释放符合要求的隧道
      // 找到目前空闲的隧道
      const idleTunnels = [];
      const enableTunnels = [];
      this.tunnels.forEach((tunnel, tunnelId) => {
        if (tunnelId >= top && tunnelId < bottom) {
          tunnel.enable();
          enableTunnels.push(tunnelId);
          this.idleTunnels.indexOf(tunnelId) >= 0 && idleTunnels.push(tunnelId);
        } else {
          tunnel.disable();
        }
      });
      this.idleTunnels = idleTunnels;
      this.enableTunnels = enableTunnels;
      this.range = range;
    });
  }

  setFont(font) {
    this._promise.then(() => {
      if (typeof font !== "string") return;

      this.font = font;
      this.fontSize = this.getFontSize(this.font);
      this.ctx.font = font;
    });
  }

  setAlpha(alpha) {
    this._promise.then(() => {
      if (typeof alpha !== "number") return;

      this.alpha = alpha;
      this.ctx.globalAlpha = alpha;
    });
  }

  setDuration(duration) {
    this._promise.then(() => {
      if (typeof duration !== "number") return;

      this.clear();
      this.duration = duration;
    });
  }

  // 先只支持 px
  getFontSize(font) {
    const reg = /(\d+)(px)/i;
    const match = font.match(reg);
    return (match && match[1]) || 10;
  }

  // 开启弹幕
  open() {
    this._promise.then(() => {
      if (this._isActive) return;
      this._isActive = true;
      this.play();
    });
  }

  // 关闭弹幕，清除所有数据
  close() {
    this._promise.then(() => {
      this._isActive = false;
      this.pause();
      this.clear();
    });
  }

  // 开启弹幕滚动
  play() {
    this._promise.then(() => {
      if (this.useWebLayerCanvas) {
        this._rAFId = this.canvas.requestAnimationFrame(() => {
          this.animate();
          this.play();
        });
      } else {
        this._timer = setInterval(() => {
          this.animate();
        }, 16);
      }
    });
  }

  // 停止弹幕滚动
  pause() {
    this._promise.then(() => {
      if (typeof this._rAFId === "number") {
        this.canvas.cancelAnimationFrame(this._rAFId);
      }
      if (typeof this._timer === "number") {
        clearInterval(this._timer);
      }
    });
  }

  // 清空屏幕和缓冲的数据
  clear() {
    this._promise.then(() => {
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.tunnels.forEach((tunnel) => tunnel.clear());
    });
  }

  // 添加一批弹幕，轨道满时会被丢弃
  addData(data = []) {
    this._promise.then(() => {
      if (!this._isActive) return;
      data.forEach((item) => this.addBullet2Tunnel(item));
    });
  }

  // 发送一条弹幕
  // 为保证发送成功，选取一条可用隧道，替换待发送队列队头元素
  send(opt = {}) {
    this._promise.then(() => {
      const tunnel = this.getEnableTunnel();
      if (tunnel === null) return;

      opt.tunnelId = tunnel.tunnelId;
      const bullet = this.registerBullet(opt);
      tunnel.nextQueue[0] = bullet;
    });
  }

  // 添加至轨道 {content, color}
  addBullet2Tunnel(opt = {}) {
    const tunnel = this.getIdleTunnel();
    if (tunnel === null) return;

    opt.tunnelId = tunnel.tunnelId;
    const bullet = this.registerBullet(opt);
    tunnel.addBullet(bullet);
  }

  registerBullet(opt = {}) {
    opt.tunnelId = opt.tunnelId || 0;
    opt.content = substring(opt.content, this.maxLength);
    const textWidth = this.getTextWidth(opt.content);
    const distance = this.mode === "overlap" ? this.width + textWidth : this.width;
    opt.textWidth = textWidth;
    opt.speed = distance / (this.duration * this.fps);
    opt.fontSize = this.fontSize;
    opt.x = this.width;
    opt.y = this.tunnelHeight * (opt.tunnelId + 0.5) + this.padding[0];
    return new Bullet(this, opt);
  }

  // 每帧执行的操作
  animate() {
    // 清空画面后重绘
    this.ctx.clearRect(0, 0, this.width, this.height);

    if (!this.useWebLayerCanvas) {
      this.ctx.setTextBaseline("middle");
      this.ctx.globalAlpha = this.alpha;
      this.ctx.font = this.font;
    }

    this.tunnelShow && this.drawTunnel();
    this.tunnels.forEach((tunnel) => tunnel.animate());

    if (!this.useWebLayerCanvas) this.ctx.draw(false);
  }

  showTunnel() {
    this.tunnelShow = true;
  }

  hideTunnel() {
    this.tunnelShow = false;
  }

  removeIdleTunnel(tunnelId) {
    const idx = this.idleTunnels.indexOf(tunnelId);
    idx >= 0 && this.idleTunnels.splice(idx, 1);
  }

  addIdleTunnel(tunnelId) {
    const idx = this.idleTunnels.indexOf(tunnelId);
    idx < 0 && this.idleTunnels.push(tunnelId);
  }

  // 从可用的隧道中随机挑选一个
  getEnableTunnel() {
    if (this.enableTunnels.length === 0) return null;
    const index = this.getRandom(this.enableTunnels.length);
    return this.tunnels[this.enableTunnels[index]];
  }

  // 从还有余量的隧道中随机挑选一个
  getIdleTunnel() {
    if (this.idleTunnels.length === 0) return null;
    const index = this.getRandom(this.idleTunnels.length);
    return this.tunnels[this.idleTunnels[index]];
  }

  getRandom(max = 10, min = 0) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  getTextWidth(content) {
    this.ctx.font = this.font;
    return Math.ceil(this.ctx.measureText(content).width);
  }

  drawTunnel() {
    const ctx = this.ctx;
    const tunnelColor = "#CCB24D";
    for (let i = 0; i <= this.tunnelNum; i++) {
      const y = this.padding[0] + i * this.tunnelHeight;
      ctx.beginPath();
      ctx.strokeStyle = tunnelColor;
      ctx.setLineDash([5, 10]);
      ctx.moveTo(0, y);
      ctx.lineTo(this.width, y);
      ctx.stroke();
      if (i < this.tunnelNum) {
        ctx.fillStyle = tunnelColor;
        ctx.fillText(`弹道${i + 1}`, 10, this.tunnelHeight / 2 + y);
      }
    }
  }
}

// tunnel（轨道）
class Tunnel {
  constructor(barrage, opt = {}) {
    const defaultTunnelOpt = {
      activeQueue: [], // 正在屏幕中列表
      nextQueue: [], // 待播放列表
      maxNum: 10,
      freeNum: 10, // 剩余可添加量
      height: 0,
      width: 0,
      disabled: false,
      tunnelId: 0,
      safeArea: 4,
      sending: false, // 弹幕正在发送
    };
    opt = Object.assign({}, defaultTunnelOpt, opt);
    for (const key in opt) {
      this[key] = opt[key];
    }
    this.freeNum = this.maxNum;
    this.barrage = barrage; // 控制中心
    this.ctx = barrage.ctx;
  }

  disable() {
    this.disabled = true;
  }

  enable() {
    this.disabled = false;
  }

  clear() {
    this.activeQueue = [];
    this.nextQueue = [];
    this.sending = false;
    this.freeNum = this.maxNum;
  }

  addBullet(bullet) {
    if (this.disabled) return;
    if (this.freeNum === 0) return;
    this.nextQueue.push(bullet);
    this.freeNum--;
    this.freeNum === 0 && this.barrage.removeIdleTunnel(this.tunnelId);
  }

  animate() {
    if (this.disabled) return;
    // 无正在发送弹幕，添加一条
    const nextQueue = this.nextQueue;
    const activeQueue = this.activeQueue;
    if (!this.sending && nextQueue.length > 0) {
      const bullet = nextQueue.shift();
      activeQueue.push(bullet);
      this.freeNum++;
      this.sending = true;
      this.barrage.addIdleTunnel(this.tunnelId);
    }

    if (activeQueue.length > 0) {
      activeQueue.forEach((bullet) => bullet.move());
      const head = activeQueue[0];
      const tail = activeQueue[activeQueue.length - 1];
      // 队首移出屏幕
      if (head.x + head.textWidth < 0) {
        activeQueue.shift();
      }
      // 队尾离开超过安全区
      if (tail.x + tail.textWidth + this.safeArea < this.width) {
        this.sending = false;
      }
    }
  }
}

// bullet（每条弹幕）
class Bullet {
  constructor(barrage, opt = {}) {
    const defaultBulletOpt = {
      fillStyle: "#000000", // 默认黑色
      font: "12px sans-serif",
      textColor: "#fff", // 文字颜色
      backgroundColor: "", // 背景颜色
      borderRadiusTopLeft: 0,
      borderRadiusTopRight: 0,
      borderRadiusBottomLeft: 0,
      borderRadiusBottomRight: 0,
      fontSize: 10, // 全局字体大小
      content: "",
      textWidth: 0,
      speed: 0, // 根据屏幕停留时长计算
      x: 0,
      y: 0,
      tunnelId: 0,
      // 弹幕图片结构
      // {
      //   image, // 图片资源
      //   dWidth, // 绘制宽度
      //   dHeight, // 绘制高度
      //   position // 显示位置，弹幕开头(head)、结尾(tail)
      //   gap // 与弹幕文字的距离，默认4
      // }
      images: [],
      // status: 0 //0:待播放 1: 未完全进入屏幕 2: 完全进入屏幕 3: 完全退出屏幕
    };
    opt = Object.assign({}, defaultBulletOpt, opt);
    for (const key in opt) {
      this[key] = opt[key];
    }
    this.barrage = barrage;
    this.ctx = barrage.ctx;
  }

  // 绘制圆角
  drawRoundRect() {
    const ctx = this.ctx;
    let x = this.x,
      y = this.y,
      h = 30,
      w = this.textWidth + 28,
      bg = this.color;
    ctx.beginPath();
    ctx.fillStyle = bg;
    //左上角
    ctx.arc(x + this.borderRadiusTopLeft, y + this.borderRadiusTopLeft, this.borderRadiusTopLeft, Math.PI, (Math.PI * 3) / 2);
    ctx.lineTo(x + w - this.borderRadiusTopLeft, y);
    //右上角
    ctx.arc(x + w - this.borderRadiusTopRight, y + this.borderRadiusTopRight, this.borderRadiusTopRight, (Math.PI * 3) / 2, 0);
    ctx.lineTo(x + w, y + h - this.borderRadiusTopRight);
    //右下角
    ctx.arc(x + w - this.borderRadiusBottomRight, y + h - this.borderRadiusBottomRight, this.borderRadiusBottomRight, 0, Math.PI / 2);
    ctx.lineTo(x + this.borderRadiusBottomRight, y + h);
    //左下角
    ctx.arc(x + this.borderRadiusBottomLeft, y + h - this.borderRadiusBottomLeft, this.borderRadiusBottomLeft, Math.PI / 2, Math.PI);
    ctx.lineTo(x, y + this.borderRadiusBottomLeft);
    ctx.fill();
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = this.textColor;
    ctx.fillText(this.content, this.x + w / 2, this.y + 15);
  }

  move() {
    this.images.forEach((item) => {
      const { image, dWidth = this.fontSize, dHeight = this.fontSize, position = "head", gap = 4 } = item;
      const x = position === "tail" ? this.x + this.textWidth + gap : this.x - gap - dWidth;
      const y = this.y - 0.5 * dHeight;
      this.ctx.drawImage(image, x, y, dWidth, dHeight);
    });
    this.x = this.x - this.speed;
    this.drawRoundRect();
  }
}

export default Barrage;
```

#### 处理数据 randomData.js

[randomData.js](https://kamchan.oss-cn-shenzhen.aliyuncs.com/miniprogram_barrage/mockData.js)

```js
const getRandom = (max = 10, min = 0) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const color = ["rgba(214, 100, 30, 0.8)", "rgba(8, 155, 138, 0.8)", "rgba(130, 82, 233, 0.8)", "rgba(249, 73, 97, 0.8)"];

const randomData = (contents, num = 3) => {
  const data = [];
  for (let i = 0; i < num; i++) {
    // const msgId = getRandom(contents.length);
    const msgId = i;
    const colorId = getRandom(color.length);
    const target = contents[msgId];
    data.push({
      color: color[colorId], //
      content: target.content, // 弹幕内容
      backgroundColor: color[colorId],
      borderRadiusTopLeft: 16,
      borderRadiusTopRight: 16,
      borderRadiusBottomLeft: 2,
      borderRadiusBottomRight: 16,
      //   images: [
      // {
      //   image:target.avatar, // 图片资源
      //   dWidth:30, // 绘制宽度
      //   dHeight:30, // 绘制高度
      //   position:head, // 显示位置，弹幕开头(head)、结尾(tail)
      //   gap:4 // 与弹幕文字的距离，默认4
      // },
      //   ],
    });
  }
  return data;
};

export default randomData;
```

#### 使用

```vue
<template>
  <view class="“barrage-box”">
    <canvas id="barrage" type="2d" style="width:100%;height: 100%;"></canvas>
  </view>
</template>

<script>
// 引入上面的核心代码  barrage.js
import Barrage from "barrage.js";
// 引入上面的数据处理 randomData.js
import randomData from "randomData.js";
export default {
  methods: {
    /**
     * 弹幕数据
     * @param {array} barrageList 弹幕数据[{content:'弹幕内容',avatar:'头像',username:'用户名',...}]
     * @return {void}
     */
    openBarrage(barrageList) {
      const barrage = new Barrage("#barrage", {
        font: "bold 12px sans-serif",
        duration: 5, // 时长
        lineHeight: 2, // 行高
        safeGap: 30, // 安全距离
      });
      barrage.open();
      const msgs = barrageList; // 后端返回的数据
      const data = randomData(msgs, msgs.length); // 生成弹幕格式数据
      barrage.addData(data);
      this.timer = setInterval(() => {
        const data = randomData(msgs, msgs.length);
        barrage.addData(data);
      }, 3000); // 定时器添加数据
    },
  },
};
</script>
```

## 海报

### QS-SharePoster

[QS-SharePoster](https://github.com/HuLuoQian/QS-SharePoster)

#### 代码

```vue
<template>
  <view class="create-poster-popup">
    <!-- DOM展示海报样式 -->
    <view v-if="isDOM" class="poster" ref="poster">
      <!-- 这里可以自己隐藏canvas 用div做一个预览画面作为展示 或者直接展示canvas -->
      <!-- canvas hide-canvas是隐藏canvas -->
      <canvas class="hide-canvas" canvas-id="canvasId" :style="{ width: (poster.width || 10) + 'px', height: (poster.height || 10) + 'px' }"></canvas>
    </view>
    <!-- 生成的图片展示 -->
    <view v-else class="canvas-box">
      <u-image :width="750" :height="1278" :src="canvasImageUrl"></u-image>
    </view>
    <view v-if="isDOM" class="btn">
      <u-button @click="htmlToCanvas" type="primary">生成海报</u-button>
    </view>
    <view v-else class="btn">
      <u-button @click="savePoster" type="primary">保存图片</u-button>
    </view>
  </view>
</template>

<script>
// QS-SharePoster 生成canvas海报的方法
import { getSharePoster } from "@/utils/QS-SharePoster/QS-SharePoster";
export default {
  data() {
    return {
      isDOM: true, // 是否是DOM元素 false则显示生成后的图片
      qrcode: "", // 二维码
      canvasImageUrl: "", // 生成后的图片地址
      poster: {}, // canvas动态设置后的宽度、高度、背景色
    };
  },
  methods: {
    /**
     * 点击生成海报
     * @param {void}
     * @return {void}
     */
    async htmlToCanvas() {
      uni.showLoading({
        title: "生成中,请稍后~",
        mask: true,
      });
      let _this = this;
      const d = await getSharePoster({
        _this: _this, //若在组件中使用 必传
        posterCanvasId: "canvasId", //canvasId
        background: {
          width: 1125,
          height: 2007,
          backgroundColor: "#ffffff", //画布背景颜色
        },
        bgScale: 1, // 缩放
        setCanvasWH({ bgObj }) {
          //一般必传， 动态设置canvas宽高
          _this.poster = bgObj;
        },
        setCanvasToTempFilePath: {
          fileType: "png",
          quality: 1,
          destWidth: 1125,
          destHeight: 2007,
        },
        drawArray: ({
          //绘制序列
          bgObj, //背景图对象
          type, //自定义标识
          bgScale, //背景缩放
          setBgObj, //动态设置画布(宽高),若使用该方法不建议背景图方式绘制, 建议使用background自定义画布绘制, 因为这个方法绘制修改背景图的宽高
          getBgObj, //获取动态设置的画布宽高
        }) => {
          let price = "商品价格";
          return [
            {
              type: "roundFillRect", // 绘制类型, 详见上方 绘制类型大纲
              backgroundColor: "#f1f1f1",
              r: 36,
              dx: 250.5,
              dy: 45,
              width: 624,
              height: 72,
            },
            {
              type: "text",
              text: "推荐一个好物给你，请查收",
              textAlign: "center",
              textBaseline: "top",
              dx: 562.5,
              dy: 60,
              size: 42,
            },
            {
              type: "image",
              url: "商品图片",
              dx: 45,
              dy: 135,
              dWidth: 1035,
              dHeight: 1035,
            },
            {
              type: "text",
              text: price,
              textAlign: "left",
              textBaseline: "top",
              dx: 45,
              dy: 1185,
              size: 66,
              color: this.$red,
              fontWeight: "blod",
            },
            {
              type: "text",
              text: "价格具有实效性",
              textAlign: "left",
              textBaseline: "top",
              dx: 45,
              dy: 1275,
              size: 36,
              color: "#aaaaaa",
            },
            {
              type: "text",
              text: "商品名称",
              textAlign: "left",
              textBaseline: "top",
              dx: 45,
              dy: 1365,
              size: 45,
              fontWeight: "blod",
              lineFeed: {
                maxWidth: 1035,
                lineNum: 1,
              },
            },
            {
              type: "image",
              url: _this.qrcode,
              dWidth: 435,
              dHeight: 435,
              dx: 345,
              dy: 1455,
            },
            {
              type: "text",
              text: "长按或者扫描二维码了解商品详情",
              textAlign: "center",
              textBaseline: "top",
              dx: 562.5,
              dy: 1905,
              size: 36,
              color: "#aaaaaa",
            },
          ];
        },
      });
      this.canvasImageUrl = d.poster.tempFilePath; // 更新图片地址
      this.isDOM = false; // 显示海报图片
      uni.hideLoading();
    },
    /**
     * 保存海报
     * @param {void}
     * @return {void}
     */
    savePoster() {
      uni.saveImageToPhotosAlbum({
        filePath: this.canvasImageUrl,
        success: (res) => {
          console.log("res", res);
          this.$u.toast("保存成功");
        },
        fail: (err) => {
          console.log("err", err);
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.create-poster-popup {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .poster {
    flex: 1;
    padding: 30rpx;
    .nav {
      display: flex;
      justify-content: center;
      align-items: center;
      padding-bottom: 20rpx;
      .text {
        padding: 5rpx 40rpx;
        border-radius: 20rpx;
        background-color: #f1f1f1;
        font-size: 28rpx;
      }
    }
    .info {
      padding-top: 30rpx;
      .price {
        color: $red;
        font-size: 48rpx;
        font-weight: bold;
      }
      .tip {
        font-size: 24rpx;
        color: #aaaaaa;
      }
      .name {
        padding-top: 10rpx;
        font-size: 30rpx;
        font-weight: bold;
      }
    }
    .qrcode {
      padding-top: 30rpx;
      display: flex;
      justify-content: center;
    }
  }
  .canvas-box {
    padding: 30rpx 0;
  }
  .btn {
    padding: 0 30rpx 30rpx 30rpx;
  }
  .hide-canvas {
    position: fixed;
    top: -99999upx;
    left: -99999upx;
    z-index: -99999;
  }
}
</style>
```

### Painter

[Painter](https://github.com/Kujiale-Mobile/Painter)
[海报生成工具](https://lingxiaoyi.github.io/painter-custom-poster/)

#### 代码

```vue
<template>
  <view class="create-poster-popup">
    <!-- DOM展示海报样式 -->
    <view v-if="isDOM" class="poster" ref="poster">
      <view class="nav">
        <view class="text">推荐一个好物给你，请查收</view>
      </view>
      <view class="image">
        <u-image :width="690" :height="690" :src="'商品图片'"></u-image>
      </view>
      <view class="info">
        <view class="price">
          <text class="text-price">商品价格</text>
        </view>
        <view class="tip">
          <text>价格具有时效性</text>
        </view>
        <view class="name u-line-1">
          <text>商品名称</text>
        </view>
        <view class="qrcode">
          <u-image :width="300" :height="300" :src="'二维码'"></u-image>
          <text>长按或者扫描二维码了解商品详情</text>
        </view>
      </view>
      <!-- canvas -->
      <painter
        customStyle="position: absolute; left: -9999rpx;"
        v-if="action"
        :scaleRatio="scaleRatio"
        :palette="paintPallette"
        @imgOK="onImgOk"
        @imgErr="onImgErr"
      />
    </view>
    <!-- 生成的图片展示 -->
    <view v-else class="canvas-box">
      <u-image :width="750" :height="1278" :src="canvasImageUrl"></u-image>
    </view>
    <view v-if="isDOM" class="btn">
      <u-button :loading="action" @click="htmlToCanvas" type="primary">生成海报</u-button>
    </view>
    <view v-else class="btn">
      <u-button @click="savePoster" type="primary">保存图片</u-button>
    </view>
  </view>
</template>

<script>
// 海报json 可通过工具生成 也可自己手动输入
import Card from "./card";
export default {
  data() {
    return {
      isDOM: true, // 是否是DOM元素 false则显示生成后的图片
      qrcode: "", // 二维码
      canvasImageUrl: "", // 生成后的图片地址
      paintPallette: null, // 模版
      action: false, // 是否显示canvas
      scaleRatio: 1, // dpr
    };
  },
  methods: {
    onImgOk(e) {
      this.canvasImageUrl = e.detail.path;
      this.isDOM = false;
      this.action = false;
      uni.hideLoading();
    },
    onImgErr(e) {
      console.log("onImgErr", e);
      this.$u.toast(`生成失败:${e}`);
      uni.hideLoading();
    },
    /**
     * 点击生成海报
     * @param {void}
     * @return {void}
     */
    async htmlToCanvas() {
      uni.showLoading({
        title: "生成中,请稍后~",
        mask: true,
      });
      const dpr = uni.getSystemInfoSync().pixelRatio;
      this.scaleRatio = dpr;
      let avatar = "头像";
      let price = "价格";
      let image = "商品图片";
      let color = "价格字体颜色";
      let name = "商品名称";
      let qrcode = this.qrcode;
      this.paintPallette = new Card().palette(avatar, image, price, color, name, qrcode);
      this.action = true;
    },
    /**
     * 保存海报
     * @param {void}
     * @return {void}
     */
    savePoster() {
      uni.saveImageToPhotosAlbum({
        filePath: this.canvasImageUrl,
        success: (res) => {
          console.log("res", res);
          this.$u.toast("保存成功");
        },
        fail: (err) => {
          console.log("err", err);
        },
      });
    },
  },
};
</script>
```

#### card.js

```js
export default class LastMayday {
  palette(avatar, image, price, color, name, qrcode) {
    return {
      width: "750rpx",
      height: "1338rpx",
      background: "#ffffff",
      views: [
        {
          type: "image",
          url: avatar,
          css: {
            width: "60rpx",
            height: "60rpx",
            top: "30rpx",
            left: "30rpx",
            rotate: "0",
            borderRadius: "60rpx",
            borderWidth: "",
            borderColor: "#ffffff",
            shadow: "",
            mode: "scaleToFill",
          },
        },
        {
          type: "rect",
          css: {
            background: "#f1f1f1",
            width: "416rpx",
            height: "48rpx",
            top: "30rpx",
            left: "167rpx",
            rotate: "0",
            borderRadius: "24rpx",
            shadow: "",
            color: "#f1f1f1",
          },
        },
        {
          type: "text",
          text: "推荐一个好物给你，请查收",
          css: {
            color: "#000000",
            background: "rgba(0,0,0,0)",
            width: "416rpx",
            height: "32rpx",
            top: "40rpx",
            left: "167rpx",
            rotate: "0",
            borderRadius: "",
            borderWidth: "",
            borderColor: "#ffffff",
            shadow: "",
            padding: "0rpx",
            fontSize: "28rpx",
            fontWeight: "normal",
            maxLines: "1",
            lineHeight: "32rpx",
            textStyle: "fill",
            textDecoration: "none",
            fontFamily: "",
            textAlign: "center",
          },
        },
        {
          type: "image",
          url: image,
          css: {
            width: "690rpx",
            height: "690rpx",
            top: "90rpx",
            left: "30rpx",
            rotate: "0",
            borderRadius: "",
            borderWidth: "",
            borderColor: "#ffffff",
            shadow: "",
            mode: "scaleToFill",
          },
        },
        {
          type: "text",
          text: price,
          css: {
            color: color,
            background: "rgba(0,0,0,0)",
            width: "750rpx",
            height: "50rpx",
            top: "790rpx",
            left: "30rpx",
            rotate: "0",
            borderRadius: "",
            borderWidth: "",
            borderColor: "#ffffff",
            shadow: "",
            padding: "0rpx",
            fontSize: "44rpx",
            fontWeight: "bold",
            maxLines: "1",
            lineHeight: "50rpx",
            textStyle: "fill",
            textDecoration: "none",
            fontFamily: "",
            textAlign: "left",
          },
        },
        {
          type: "text",
          text: "价格具有时效性",
          css: {
            color: "#aaaaaa",
            background: "rgba(0,0,0,0)",
            width: "750rpx",
            height: "26.67rpx",
            top: "850rpx",
            left: "30rpx",
            rotate: "0",
            borderRadius: "",
            borderWidth: "",
            borderColor: "#ffffff",
            shadow: "",
            padding: "0rpx",
            fontSize: "24rpx",
            fontWeight: "normal",
            maxLines: "1",
            lineHeight: "26.67rpx",
            textStyle: "fill",
            textDecoration: "none",
            fontFamily: "",
            textAlign: "left",
          },
        },
        {
          type: "text",
          text: name,
          css: {
            color: "black",
            background: "rgba(0,0,0,0)",
            width: "690rpx",
            height: "34rpx",
            top: "910rpx",
            left: "30rpx",
            rotate: "0",
            borderRadius: "",
            borderWidth: "",
            borderColor: "#ffffff",
            shadow: "",
            padding: "0rpx",
            fontSize: "30rpx",
            fontWeight: "bold",
            maxLines: "1",
            lineHeight: "34rpx",
            textStyle: "fill",
            textDecoration: "none",
            fontFamily: "",
            textAlign: "left",
          },
        },
        {
          type: "image",
          url: qrcode,
          css: {
            width: "290rpx",
            height: "290rpx",
            top: "970rpx",
            left: "230rpx",
            rotate: "0",
            borderRadius: "",
            borderWidth: "",
            borderColor: "#ffffff",
            shadow: "",
            mode: "scaleToFill",
          },
        },
        {
          type: "text",
          text: "长按或者扫描二维码了解商品详情",
          css: {
            color: "#aaaaaa",
            background: "rgba(0,0,0,0)",
            width: "750rpx",
            height: "26.67rpx",
            top: "1280rpx",
            left: "30rpx",
            rotate: "0",
            borderRadius: "",
            borderWidth: "",
            borderColor: "#ffffff",
            shadow: "",
            padding: "0rpx",
            fontSize: "24rpx",
            fontWeight: "normal",
            maxLines: "1",
            lineHeight: "26.67rpx",
            textStyle: "fill",
            textDecoration: "none",
            fontFamily: "",
            textAlign: "center",
          },
        },
      ],
    };
  }
}
```
