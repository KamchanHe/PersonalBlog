---
title: 优普道资质网开发遇到的问题
date: 2020-06-18
categories: article
author: Kamchan
tags:
  - Javascript
  - Fis3
  - Bug
  - Echarts
  - Jquery
---

## 在 window 微信浏览器和 IE 下报错

### 原因

window 微信浏览器还是基于 IE 内核的，项目中使用了 ES6、ES7 语法，导致出现兼容性问题，js 报错阻碍了之后的代码运行

### 解决办法

FIS3 配置中引入 babel，把 ES6 转为 ES5

### fis-conf.js

```js
...
// es6转es5
fis.match(/^\/static\/asset\/js\/[a-zA-Z]*\.js$/i, {
  parser: fis.plugin('babel'),
  rExt: 'js',
})
// es6转es5
fis.match(/^\/static\/asset\/js\/common\/teacherSwiper.js$/i, {
  parser: fis.plugin('babel'),
  rExt: 'js',
})
```

## 特殊轮播图

![teacherSwiper](https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/bug/ypdQualification/teacherSwiper.gif)

### 原因

要实现这种非常规轮播图，中间显示人物和介绍，左右两边要保留前后的人物，但是不能显示文字

### 解决办法

手写轮播图，给每一张图片写死定位

### 代码

```html
<div class="teacher-box-info flex flex-align-end flex-content-between">
  <div class="swiper-wrapper"></div>
  <div class="swiper-control swiper-no-swiping">
    <ul>
      <!-- <li class="active"></li> -->
    </ul>
  </div>
</div>
```

```less
```

```js
var json = [
  {
    width: 800,
    height: 366,
    top: '0px',
    left: '200px',
    opacity: 100,
    zIndex: 4,
  },
  {
    width: 550,
    height: 246,
    top: '120px',
    left: '1000px',
    opacity: 50,
    zIndex: 3,
  },
  {
    width: 550,
    height: 246,
    top: '120px',
    left: '0px',
    opacity: 50,
    zIndex: 3,
  },
]

window.teacherIndex = 0
function setTeacherIndex() {
  let activeObj = json.findIndex((v) => v.zIndex == 4)
  window.teacherIndex = activeObj
  $('.swiper-control li')
    .eq(activeObj)
    .addClass('active')
    .siblings()
    .removeClass('active')
}

function move() {
  var liArr = $('.teacher-box-info-item')
  for (var i = 0; i < liArr.length; i++) {
    if (i == liArr.length - 1) {
      animation(liArr[i], json[i], setTeacherIndex)
    } else {
      animation(liArr[i], json[i])
    }
  }
}

function next(time) {
  for (let index = 0; index < time; index++) {
    var first = json.shift()
    json.push(first)
  }
  move()
}

function prev(time) {
  for (let index = 0; index < time; index++) {
    var last = json.pop()
    json.unshift(last)
  }
  move()
}

function hoverStop() {
  $('.teacher-box-info').hover(
    () => {
      clearInterval(window.autoPlay)
      window.autoPlay = null
    },
    () => {
      auto()
    }
  )
}

function auto() {
  clearInterval(window.autoPlay)
  window.autoPlay = null
  window.autoPlay = setInterval(() => {
    var first = json.pop()
    json.unshift(first)
    move()
  }, 3000)
}

function whichSwipe() {
  var startX = 0,
    endX = 0

  $('.teacher-box-info').mousedown(function(e) {
    startX = e.clientX
  })

  $('.teacher-box-info').mouseup(function(e) {
    endX = e.clientX
    if (endX - startX > 0) {
      var first = json.shift()
      json.push(first)
      move()
    } else if (endX - startX < 0) {
      var last = json.pop()
      json.unshift(last)
      move()
    }
  })
}

function animation(obj, json, fn) {
  clearInterval(obj.timer)
  let canFn = true
  obj.timer = setInterval(function() {
    if (fn && canFn) {
      fn()
      canFn = false
    }
    var flag = true
    for (var key in json) {
      var target = parseInt(json[key])
      if (key == 'opacity') {
        var leader = getStyle(obj, key) * 100
      } else {
        var leader = parseInt(getStyle(obj, key))
      }
      var speed = (target - leader) / 10
      speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed)
      leader = leader + speed
      if (key == 'opacity') {
        obj.style.opacity = leader / 100
        obj.style.filter = 'alpha(opacity=' + leader + ')'
      } else if (key == 'zIndex') {
        obj.style.zIndex = target
      } else {
        obj.style[key] = leader + 'px'
      }
      if (target != leader) {
        flag = false
      }
    }

    if (flag) {
      clearInterval(obj.timer)
      canFn = true
    }
  }, 20)
}

function getStyle(obj, attr) {
  if (window.getComputedStyle) {
    return window.getComputedStyle(obj, null)[attr]
  } else {
    return obj.currentStyle[attr]
  }
}

function getTeacherBanner() {
  $.ajax({
    url: '获取数据的url',
  }).then((res) => {
    let renderText = ''
    res.data.forEach((item) => {
      $('.teacher-box-info .swiper-control ul').append('<li></li>')
      renderText += `
          <div class="teacher-box-info-item flex flex-align-center flex-content-between">
            <img src="${item.head_text}" alt="" />
            <div class="jieshao">
              这里放入显示的文字
            </div>
          </div>
        `
    })
    let lastItem = json.splice(json.length - 1, 1)
    for (let index = 0; index < res.data.length - 3; index++) {
      json.push({
        width: 800,
        height: 366,
        top: '0px',
        left: '200px',
        opacity: 0,
        zIndex: -1,
      })
    }
    json.push(...lastItem)

    $('.teacher-box-info .swiper-wrapper').html(renderText)
    move()
    whichSwipe()
    auto()
    hoverStop()

    $('.swiper-control li').each((index, item) => {
      $(item).click(function() {
        if (window.teacherSwiperTimer) return
        window.teacherSwiperTimer = setTimeout(() => {
          let nowIndex = window.teacherIndex
          if (nowIndex == index) return
          if (nowIndex > index) {
            let num = Math.abs(nowIndex - index)
            next(num)
          } else {
            let num = Math.abs(nowIndex - index)
            prev(num)
          }
          clearTimeout(window.clearTimer)
          window.clearTimer = setTimeout(() => {
            window.teacherSwiperTimer = null
          }, 1000)
        }, 0)
      })
    })
  })
}
```

## 滚动到对应位置开始圆环动画

![circle](https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/bug/ypdQualification/circle.gif)

### 实现办法

使用 svg 来实现圆环，结合[jquery.counterup.min.js](https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/bug/ypdQualification/jquery.counterup.min.js)和[jquery.waypoints.min.js](https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/bug/ypdQualification/jquery.waypoints.min.js)实现数字滚动和指定位置开始动画

```html
<div class="partner-box-number-item">
  <div class="partner-box-number-item-top">
    <div>
      <div class="number-ring">
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
          <defs>
            <linearGradient id="one" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stop-color="#0066FF" />
              <stop offset="100%" stop-color="#0066FF" />
            </linearGradient>
          </defs>
          <circle
            fill="none"
            stroke="#ececec"
            stroke-width="5"
            stroke-dasharray="408.41"
            stroke-dashoffset="0"
          />
          <circle
            class="circle"
            fill="none"
            stroke="url(#one)"
            stroke-width="5"
            stroke-dasharray="408.41"
            stroke-dashoffset="408.41"
            stroke-linecap="round"
          />
        </svg>
      </div>
      <p>
        <font class="counter">12</font>
      </p>
    </div>
  </div>
  <div class="partner-box-number-item-bottom">
    <p>年专业服务经验</p>
  </div>
</div>
```

```less
&-item {
  flex: 1;

  &-top {
    width: 140px;
    height: 140px;
    border-radius: 50%;
    margin: 0 auto;
    border-radius: 50%;

    > div {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #f1f1f5;
      border-radius: 50%;
      position: relative;

      p {
        font-size: 50px;
        font-family: Bahnschrift;
        font-weight: 400;
        color: #0066ff;
        line-height: 140px;
        text-align: center;
        position: relative;
        display: inline-block;

        span {
          position: absolute;
          width: 30px;
          height: 30px;
          line-height: 30px;
          top: 45px;
          right: -23px;
          font-weight: 400;
          color: #0066ff;
          font-family: Bahnschrift;
          font-size: 26px;
        }
      }

      .number-ring {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;

        svg {
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);

          circle {
            cx: 70px;
            cy: 70px;
            r: 65px;
            // transition: all 2s linear;
            transition: all 2s;
          }
        }
      }
    }
  }

  &-bottom {
    font-size: 16px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: rgba(102, 102, 102, 1);
    line-height: 22px;
    margin-top: 20px;
    text-align: center;
  }
}
```

```js
function numAnime() {
  // 数字滚动效果
  $('.partner-box-number-item-top').each(function(index, item) {
    $('.counter').countUp({
      time: 2000,
      delay: 1,
    })
  })
  $('font.counter').waypoint(circleRun, { offset: '100%', triggerOnce: true })
}

function circleRun() {
  let circles = $('.circle')
  circles.each((index, item) => {
    $(item).attr('stroke-dashoffset', 0)
  })
}
```

## 地图

### 问题

备案审核问题，地图显示不完整，要求整改

#### 修改前

![map-before](https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/bug/ypdQualification/map-before.png)

#### 修改后

![map-after](https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/bug/ypdQualification/map-after.png)

### 方法

替换 china.json

开始用的 echarts 官方 GitHub 的[china.json](https://github.com/apache/incubator-echarts/blob/master/map/json/china.json)

之后改为用阿里的 dataV 的[china.json](https://geo.datav.aliyun.com/areas_v2/bound/100000_full.json)

#### 替换遇到的问题

- 省份名称不一样，导致数据渲染不同步出错
- json 文件里的数据不一样，键名不一样，值不一样
- 需要在数据里加入`"cp": [经纬度]`
- 需要在自己的 js 文件里对需要处理做交互的省份名进行同步更改

```
修正数据 经纬度
1.新疆: [86.61 , 40.79]
2.西藏:[89.13 , 30.66]
3.黑龙江:[128.34 , 47.05]
4.吉林:[126.32 , 43.38]
5.辽宁:[123.42 , 41.29]
6.内蒙古:[112.17 , 42.81]
7.北京:[116.40 , 40.40 ]
8.宁夏:[106.27 , 36.76]
9.山西:[111.95,37.65]
10.河北:[115.21 , 38.44]
11.天津:[117.04 , 39.52]
12.青海:[97.07 , 35.62]
13.甘肃:[103.82 , 36.05]
14.山东:[118.01 , 36.37]
15.陕西:[108.94 , 34.46]
16.河南:[113.46 , 34.25]
17.安徽:[117.28 , 31.86]
18.江苏:[120.26 , 32.54]
19.上海:[121.46 , 31.28]
20.四川:[103.36 , 30.65]
21.湖北:[112.29 , 30.98]
22.浙江:[120.15 , 29.28]
23.重庆:[107.51 , 29.63]
24.湖南:[112.08 , 27.79]
25.江西:[115.89 , 27.97]
26.贵州:[106.91 , 26.67]
27.福建:[118.31 , 26.07]
28.云南:[101.71 , 24.84]
29.台湾:[121.01 , 23.54]
30.广西:[108.67 , 23.68]
31.广东:[113.98 , 22.82]
32.海南:[110.03 , 19.33]
33.澳门:[113.54 , 22.19]
34.香港:[114.17 , 22.32]
```

[修改后的 china.json](https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/bug/ypdQualification/map/json/chinaFull.json)

### 代码

```html
<div class="map-box">
  <div id="map_box"></div>
</div>
```

```less
&-box {
  width: 1200px;
  height: 100%;
  position: relative;

  #map_box {
    height: 850px;
    width: 1200px;
  }
}
```

```js
function initMap() {
  let img = __inline('../image/groupProfile/icon-point-blue.png')
  let img2 = __inline('../image/groupProfile/icon-point-red.png')

  let activeArea = [
    '上海市',
    '贵州省',
    '福建省',
    '陕西省',
    '广西壮族自治区',
    '河南省',
    '天津市',
    '浙江省',
    '山西省',
    '北京市',
    '四川省',
    '内蒙古自治区',
    '吉林省',
    '青海省',
    '海南省',
    '黑龙江省',
    '江西省',
    '江苏省',
    '甘肃省',
    '广东省',
    '重庆市',
  ]

  var dataList = [
    { name: '南海诸岛', fixPhone: '', tel: '' },
    { name: '北京市', fixPhone: '', tel: '139 1160 2260' },
    { name: '天津市', fixPhone: '', tel: '137 5202 9990' },
    { name: '上海市', fixPhone: '', tel: '186 0175 9693' },
    { name: '重庆市', fixPhone: '', tel: '188 8327 7229' },
    { name: '河北省', fixPhone: '', tel: '' },
    { name: '河南省', fixPhone: '', tel: '133 4382 0555' },
    { name: '云南省', fixPhone: '', tel: '' },
    { name: '辽宁省', fixPhone: '', tel: '' },
    { name: '黑龙江省', fixPhone: '', tel: '130 5901 9793' },
    { name: '湖南省', fixPhone: '', tel: '' },
    { name: '安徽省', fixPhone: '', tel: '' },
    { name: '山东省', fixPhone: '', tel: '' },
    { name: '新疆维吾尔自治区', fixPhone: '', tel: '' },
    { name: '江苏省', fixPhone: '', tel: '400-8394777' },
    { name: '浙江省', fixPhone: '', tel: '133 9657 1877' },
    { name: '江西省', fixPhone: '', tel: '158 7902 1407' },
    { name: '湖北省', fixPhone: '', tel: '' },
    { name: '广西壮族自治区', fixPhone: '', tel: '185 7896 8886' },
    { name: '甘肃省', fixPhone: '', tel: '139 1912 1555' },
    { name: '山西省', fixPhone: '', tel: '188 3418 3222' },
    { name: '内蒙古自治区', fixPhone: '', tel: '180 0480 0439' },
    { name: '陕西省', fixPhone: '', tel: '132 0173 9696' },
    { name: '吉林省', fixPhone: '', tel: '138 4404 7546' },
    { name: '福建省', fixPhone: '', tel: '180 6072 8000' },
    { name: '贵州省', fixPhone: '', tel: '185 8500 1333' },
    { name: '广东省', fixPhone: '400-6036669', tel: '' },
    { name: '青海省', fixPhone: '', tel: '131 0976 1046' },
    { name: '西藏自治区', fixPhone: '', tel: '' },
    { name: '四川省', fixPhone: '', tel: '147 2606 2979' },
    { name: '宁夏回族自治区', fixPhone: '', tel: '' },
    { name: '海南省', fixPhone: '', tel: '188 7604 8807' },
    { name: '台湾省', fixPhone: '', tel: '' },
    { name: '香港', fixPhone: '', tel: '' },
    { name: '澳门', fixPhone: '', tel: '' },
  ]

  const option = {
    geo: {
      show: true,
      map: 'china',
      roam: false,
      zoom: 1.2,
      selectedMode: 'single',
      label: {
        show: true,
        color: '#666666',
        fontSize: 10,
        rich: {
          img: {
            backgroundColor: {
              image: img,
            },
          },
        },
        formatter: function(params) {
          let res = ''
          if (activeArea.indexOf(params.name) >= 0) {
            res += params.name + '{img|}'
          } else {
            res += params.name
          }
          return res
        },
      },
      regions: [
        // {
        //   name: '南海诸岛',
        //   value: 0,
        //   itemStyle: {
        //     normal: {
        //       opacity: 0,
        //       label: {
        //         show: false,
        //       },
        //     },
        //   },
        // },
      ],
      itemStyle: {
        areaColor: '#fff',
        borderWidth: 2,
        borderColor: '#BFC2D0',
      },
      emphasis: {
        label: {
          color: '#666666',
          rich: {
            img: {
              backgroundColor: {
                image: img2,
              },
              width: 12,
              height: 15,
            },
          },
          formatter: function(params) {
            let res = ''
            if (activeArea.indexOf(params.name) >= 0) {
              res += params.name + '{img}'
            } else {
              res += params.name
            }
            return res
          },
        },
        itemStyle: {
          areaColor: '#D5E3FD',
          borderWidth: 2,
          borderColor: '#5A93FF',
        },
      },
    },
    tooltip: {
      trigger: 'item',
      alwaysShowContent: false,
      triggerOn: 'mousemove',
      enterable: false,
      backgroundColor: 'rgba(0,0,0,.6)',
      textStyle: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'Source Han Sans CN',
        fontWeight: 400,
      },
      padding: 25,
      formatter: function(params) {
        if (!params.data) return
        var res = ''
        let length = params['data'].name.length
        let space =
          length <= 2
            ? '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
            : '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
        let type =
          params['data'].fixPhone && params['data'].tel
            ? 'all'
            : params['data'].fixPhone && !params['data'].tel
            ? 'fixPhone'
            : !params['data'].fixPhone && params['data'].tel
            ? 'tel'
            : 'none'
        switch (type) {
          case 'all':
            res +=
              params['data'].name +
              '（固话）' +
              params['data'].fixPhone +
              '</br>'
            res += space + '（手机）' + params['data'].tel + '</br>'
            break
          case 'fixPhone':
            res +=
              params['data'].name +
              '（固话）' +
              params['data'].fixPhone +
              '</br>'
            break
          case 'tel':
            res +=
              params['data'].name + '（手机）' + params['data'].tel + '</br>'
            break
          default:
            break
        }
        return res
      },
    },
    series: [
      {
        type: 'map',
        map: 'china',
        geoIndex: 0,
        data: dataList,
      },
    ],
  }
  let canvas = document.getElementById('map_box')
  let myChart = echarts.init(canvas)
  myChart.setOption(option)
}
```
