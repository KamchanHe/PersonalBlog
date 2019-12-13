---
title: iOS设备开发参数
date: 2019-12-13
categories: article
author: Kamchan
tags:
- Javascript
- iOS
---

## 尺寸规范

<div class='ios'>
  <div class='item'>
    <h4>尺寸规范</h4>
    <h6>机器型号：XS Max、iPhone 11 Pro Max</h6>
    <h6>尺寸：6.5</h6>
    <h6>分辨率：1242×2688</h6>
    <h6>开发参数：414×896pt</h6>
    <h6>状态栏：132px</h6>
    <h6>导航栏：132px</h6>
    <h6>标签栏：147px</h6>
  </div>
    <div class='item'>
    <h4>尺寸规范</h4>
    <h6>机器型号：X、XS、iPhone 11 Pro</h6>
    <h6>尺寸：5.8</h6>
    <h6>分辨率：1125×2436</h6>
    <h6>开发参数：375×812pt</h6>
    <h6>状态栏：132px</h6>
    <h6>导航栏：132px</h6>
    <h6>标签栏：147px</h6>
  </div>
    <div class='item'>
    <h4>尺寸规范</h4>
    <h6>机器型号：6+、6s+、7+、8+</h6>
    <h6>尺寸：5.5</h6>
    <h6>分辨率：1242×2208</h6>
    <h6>开发参数：414×736pt</h6>
    <h6>状态栏：60px</h6>
    <h6>导航栏：132px</h6>
    <h6>标签栏：146px</h6>
  </div>
    <div class='item'>
    <h4>尺寸规范</h4>
    <h6>机器型号：XR、iPhone 11</h6>
    <h6>尺寸：6.1</h6>
    <h6>分辨率：828×1792</h6>
    <h6>开发参数：414×896pt</h6>
    <h6>状态栏：88px</h6>
    <h6>导航栏：88px</h6>
    <h6>标签栏：98px</h6>
  </div>
    <div class='item'>
    <h4>尺寸规范</h4>
    <h6>机器型号：6、6s、7、8</h6>
    <h6>尺寸：4.7</h6>
    <h6>分辨率：750×1334</h6>
    <h6>开发参数：375×667pt</h6>
    <h6>状态栏：40px</h6>
    <h6>导航栏：88px</h6>
    <h6>标签栏：98px</h6>
  </div>
</div>

## 媒体查询

```css
/* 兼容iphone6plus、iphone7plus、iphone8plus*/
@media (device-height:736px) and (-webkit-min-device-pixel-ratio:2){}

/*iphoneX、iphoneXs、iphone11 Pro*/
/*即: 设备屏幕可见宽度为375px， 可见高度为812px及设备像素比为3*/

nd (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {}

/*iphone Xs Max、iPhone 11 Pro Max*/
@media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio:3) {}

/*iphone XR、iPhone 11*/
@media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio:2) {}
```

<style scoped>
.ios {
  display: flex;
  flex-wrap: wrap;
}
.item{
  flex-basis: 298px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 20px;
  margin-right:30px;
  margin-top: 30px;
}
</style>