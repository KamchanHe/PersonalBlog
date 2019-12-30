---
title: 美祺溯源中台系统
date: 2019-12-26
categories: article
author: Kamchan
tags:
  - Javascript
  - 后台
  - ElementUI
  - Vue
---

## Vue2.0 使用 scss

### 问题

#### vue-cli 生成的项目，main.js 引入 scss 时报错

### 原因

新版本的 vue-cli 已经帮我们把 sass-loader 配置好了，放在了 util.js 里面。
原来我们需要在 webpack.base.config.js 中去配置

### 解决方法

#### webpack.base.config.js

```js
{
    test: /\.scss$/,
    use: [
        {
            loader: 'style-loader' // creates style nodes from JS strings
        },
        {
            loader: 'css-loader' // translates CSS into CommonJS
        },
        {
            loader: 'sass-loader' // compiles Sass to CSS
        }
    ]
}
```

现在不需要这样配置。如果这样配置会报错，因为配置重复了。
所以，只需要安装相应的 loader，比如使用 sass 需要安装 node-sass、sass-loader。

## 地图数据

### 引入 echart.js 和 china.js

#### [map 文件](https://kamchan.oss-cn-shenzhen.aliyuncs.com/echart/map.zip)

#### map.vue

```html
<template>
  <div class="map_container">
    <div class="map_echart">
      <div id="map_box"></div>
      <div id="map_select">
        <ul class="flex flex-align-end flex-content-between">
          <li v-for="item in visualMap" :key="item">{{ item }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
  import echarts from 'echarts' // echart插件
  import '@/map/js/china' // 中国地图插件
  export default {
    name: 'mapData',
    data() {
      return {
        total: 3000, // echart示例的数量范围
        visualMap: [], // echart示例 处理后的显示数组数据
        option: {
          // echart地图的配置
          tooltip: {
            formatter: function(params, ticket, callback) {
              return (
                params.seriesName + '<br />' + params.name + '：' + params.value
              )
            }
          },
          visualMap: [
            {
              show: true, //是否显示
              type: 'piecewise', // 定义为连续型 viusalMap piecewise为分隔 continuous为连续
              orient: 'vertical', //图例排列方向 horizontal vertical
              pieces: [
                //自定义『分段式视觉映射组件（visualMapPiecewise）』的每一段的范围，以及每一段的文字，以及每一段的特别的样式
                { min: 0, max: 0 } // 不指定 max，表示 max 为无限大（Infinity）。
              ],
              minOpen: true, //界面上会额外多出一个『< min』的选块
              maxOpen: true, //界面上会额外多出一个『> max』的选块。
              splitNumber: 2, //对于连续型数据，自动平均切分成几段。默认为5段
              selectedMode: 'multiple', //选择模式，可以是：'multiple'（多选）。'single'（单选）。
              itemSymbol: 'circle', //默认的图形。可选值为： 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow'
              range: [0, 0], //指定手柄对应数值的位置。range 应在 min max 范围内
              calculable: false, //是否显示拖拽用的手柄（手柄能拖拽调整选中范围）
              realtime: true, //拖拽时，是否实时更新
              inverse: false, //是否反转 visualMap 组件
              precision: 0, //数据展示的小数精度，默认为0，无小数点
              itemWidth: 80, //图形的宽度，即长条的宽度。
              itemHeight: 6, //图形的高度，即长条的高度。
              align: 'bottom', //指定组件中手柄和文字的摆放位置.可选值为：'auto' 自动决定。'left' 手柄和label在右。'right' 手柄和label在左。'top' 手柄和label在下。'bottom' 手柄和label在上。
              text: ['', '无数据'], //两端的文本
              textGap: 10, //两端文字主体之间的距离，单位为px
              // dimension: 0, //指定用数据的『哪个维度』，映射到视觉元素上。『数据』即 series.data。 可以把 series.data 理解成一个二维数组,其中每个列是一个维度,默认取 data 中最后一个维度
              // seriesIndex: 0, //指定取哪个系列的数据，即哪个系列的 series.data,默认取所有系列
              hoverLink: true, //鼠标悬浮到 visualMap 组件上时，鼠标位置对应的数值 在 图表中对应的图形元素，会高亮
              inRange: {
                //定义 在选中范围中 的视觉元素
                color: ['#394D61'],
                symbolSize: [30, 30],
                opacity: 1
              },
              outOfRange: {
                //定义 在选中范围外 的视觉元素。
                symbolSize: [30, 30]
              },
              zlevel: 0, //所属图形的Canvas分层，zlevel 大的 Canvas 会放在 zlevel 小的 Canvas 的上面
              backgroundColor: 'transparent', //标题背景色
              borderColor: '#ccc', //边框颜色
              borderWidth: 0, //边框线宽
              // min: 0,
              // max: 2716,
              left: 30,
              bottom: 0,
              textStyle: {
                color: 'white',
                width: '10px'
              }
            },
            {
              show: true, //是否显示
              type: 'piecewise', // 定义为连续型 viusalMap piecewise为分隔 continuous为连续
              orient: 'horizontal', //图例排列方向 horizontal vertical
              pieces: [
                { min: 1, max: 679 },
                { min: 679, max: 1358 },
                { min: 1358, max: 2037 },
                { min: 2037, max: 2716 }
              ],
              minOpen: true, //界面上会额外多出一个『< min』的选块
              maxOpen: true, //界面上会额外多出一个『> max』的选块。
              splitNumber: 2, //对于连续型数据，自动平均切分成几段。默认为5段
              selectedMode: 'multiple', //选择模式，可以是：'multiple'（多选）。'single'（单选）。
              itemSymbol: 'diamond', //默认的图形。可选值为： 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow'
              // range: [1, 2716], //指定手柄对应数值的位置。range 应在 min max 范围内
              calculable: false, //是否显示拖拽用的手柄（手柄能拖拽调整选中范围）
              realtime: true, //拖拽时，是否实时更新
              inverse: false, //是否反转 visualMap 组件
              precision: 0, //数据展示的小数精度，默认为0，无小数点
              itemWidth: 80, //图形的宽度，即长条的宽度。
              itemHeight: 6, //图形的高度，即长条的高度。
              align: 'auto', //指定组件中手柄和文字的摆放位置.可选值为：'auto' 自动决定。'left' 手柄和label在右。'right' 手柄和label在左。'top' 手柄和label在下。'bottom' 手柄和label在上。
              text: ['', ''], //两端的文本
              textGap: 10, //两端文字主体之间的距离，单位为px
              // dimension: 0, //指定用数据的『哪个维度』，映射到视觉元素上。『数据』即 series.data。 可以把 series.data 理解成一个二维数组,其中每个列是一个维度,默认取 data 中最后一个维度
              // seriesIndex: 0, //指定取哪个系列的数据，即哪个系列的 series.data,默认取所有系列
              hoverLink: true, //鼠标悬浮到 visualMap 组件上时，鼠标位置对应的数值 在 图表中对应的图形元素，会高亮
              showLabel: false,
              itemGap: 0,
              inRange: {
                //定义 在选中范围中 的视觉元素
                color: ['#318DFF', '#55F6FF'],
                symbolSize: [30, 30],
                opacity: 1
              },
              outOfRange: {
                //定义 在选中范围外 的视觉元素。
                color: ['#394D61'],
                symbolSize: [30, 30]
              },
              zlevel: 0, //所属图形的Canvas分层，zlevel 大的 Canvas 会放在 zlevel 小的 Canvas 的上面
              backgroundColor: 'transparent', //标题背景色
              borderColor: '#ccc', //边框颜色
              borderWidth: 0, //边框线宽
              // min: 0,
              // max: 2716,
              left: 160,
              bottom: 20,
              textStyle: {
                color: 'white'
              }
            }
          ],
          geo: {
            map: 'china',
            roam: false,
            zoom: 1.23,
            left: 500,
            label: {
              normal: {
                show: false,
                fontSize: '10',
                color: 'rgba(0,0,0,0.7)'
              }
            },
            itemStyle: {
              normal: {
                borderColor: 'rgba(0, 0, 0, 0.2)'
              },
              emphasis: {
                areaColor: '#F3B329',
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowBlur: 20,
                borderWidth: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          },
          series: [
            {
              name: '信息量',
              type: 'map',
              geoIndex: 0,
              data: []
            }
          ]
        },
        dataList: [], // echart地图的省份的数据
        selectList: [], // 商品选择下拉框的列表数据
        page: 1, // 页数
        pageSize: 30, // 每页请求的数量
        keyword: '' // 搜索关键字
      }
    },
    methods: {
      // 更新地图视图
      upDateCanvas() {
        let myChart = echarts.init(document.getElementById('map_box'))
        // 根据total最大值计算分栏的各个min-max
        this.option.visualMap[1].pieces = [
          { min: 1, max: Number((this.total / 4) * 1) },
          {
            min: Number((this.total / 4) * 1),
            max: Number((this.total / 4) * 2)
          },
          {
            min: Number((this.total / 4) * 2),
            max: Number((this.total / 4) * 3)
          },
          {
            min: Number((this.total / 4) * 3),
            max: Number((this.total / 4) * 4)
          }
        ]
        // 根据total最大值计算分栏显示的数值
        this.visualMap = [
          Number((this.total / 4) * 0),
          Number((this.total / 4) * 1),
          Number((this.total / 4) * 2),
          Number((this.total / 4) * 3),
          Number((this.total / 4) * 4)
        ]
        myChart.setOption(this.option) // 更新echart
      },
      // 获取省份对应的数据
      getDataList() {
        return new Promise((res, rej) => {
          this.dataList = [
            { name: '南海诸岛省', value: 0 },
            { name: '北京', value: 0 },
            { name: '天津', value: 0 },
            { name: '上海', value: 0 },
            { name: '重庆', value: 0 },
            { name: '河北', value: 0 },
            { name: '河南', value: 0 },
            { name: '云南', value: 0 },
            { name: '辽宁', value: 0 },
            { name: '黑龙江', value: 0 },
            { name: '湖南', value: 0 },
            { name: '安徽', value: 0 },
            { name: '山东', value: 0 },
            { name: '新疆', value: 0 },
            { name: '江苏', value: 0 },
            { name: '浙江', value: 0 },
            { name: '江西', value: 0 },
            { name: '湖北', value: 0 },
            { name: '广西', value: 0 },
            { name: '甘肃', value: 0 },
            { name: '山西', value: 0 },
            { name: '内蒙古', value: 0 },
            { name: '陕西', value: 0 },
            { name: '吉林', value: 0 },
            { name: '福建', value: 0 },
            { name: '贵州', value: 0 },
            { name: '广东', value: 0 },
            { name: '青海', value: 0 },
            { name: '西藏', value: 0 },
            { name: '四川', value: 0 },
            { name: '宁夏', value: 0 },
            { name: '海南', value: 0 },
            { name: '台湾', value: 0 },
            { name: '香港', value: 0 },
            { name: '澳门', value: 0 }
          ]
          this.option.series[0].data = this.dataList
          res()
        })
      }
    },
    mounted() {
      // 先获取一次静态的全0数据
      this.getDataList().then(() => {
        this.upDateCanvas() // 渲染0数据的echart试图
      })
    }
  }
</script>
<style lang="scss" scoped>
  .map_echart {
    position: relative;
    min-width: 1200px;
    height: 450px;
    #map_box {
      width: 100%;
      height: 100%;
    }
    #map_select {
      position: absolute;
      color: white;
      width: 400px;
      height: 30px;
      bottom: -15px;
      left: 125px;
      ul {
        li {
          flex-basis: 80px;
          list-style: none;
          position: relative;
          text-align: center;
          &::after {
            content: '';
            position: absolute;
            top: -15px;
            left: 40px;
            width: 1px;
            height: 12px;
            background: rgba(255, 255, 255, 1);
          }
        }
      }
    }
  }
</style>
```

## map 地图上线后遇到 china.js 报错问题

### 解决

```html
<script>
// import '@/map/js/china' // 中国地图插件
// 改为
import datas from "@/assets/map/json/china.json"; // 中国地图插件
  export default {
    // 添加注册函数
    created() {
      echarts.registerMap('china', datas)
    }
  }
</script>
```

## 线形图数据

### 引入 echart.js

#### chart.vue

##### LineMarker.vue

```html
<template>
  <div :id="id" :class="className" :style="{ height: height, width: width }" />
</template>

<script>
  import echarts from 'echarts'

  export default {
    props: {
      className: {
        type: String,
        default: 'chart'
      },
      id: {
        type: String,
        default: 'chart'
      },
      width: {
        type: String,
        default: '100%'
      },
      height: {
        type: String,
        default: '400px'
      }
    },
    data() {
      return {
        chart: null,
        // 尝试过作为props的参数 实现不了更新
        traceLogData: {
          xData: [0],
          yData: [0]
        }
      }
    },
    mounted() {
      this.initChart()
    },
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      this.chart.dispose()
      this.chart = null
    },
    methods: {
      initChart() {
        this.chart = echarts.init(document.getElementById(this.id))

        this.chart.setOption({
          backgroundColor: 'transparent',
          title: {
            top: 20,
            //   text: '商品数据',
            textStyle: {
              fontWeight: 'normal',
              fontSize: 16,
              color: '#F1F1F3'
            },
            left: '1%'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              lineStyle: {
                color: '#57617B'
              }
            }
          },
          legend: {
            top: 20,
            icon: 'rect',
            itemWidth: 14,
            itemHeight: 5,
            itemGap: 13,
            data: ['浏览量PV'],
            right: '4%',
            textStyle: {
              fontSize: 12,
              color: '#fff'
            }
          },
          grid: {
            top: 70,
            left: '1%',
            right: '2%',
            bottom: '2%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              boundaryGap: false,
              axisLine: {
                lineStyle: {
                  color: '#7F909D'
                }
              },
              data: this.traceLogData.xData
            }
          ],
          yAxis: [
            {
              type: 'value',
              //   name: '(%)',
              axisTick: {
                show: false
              },
              axisLine: {
                lineStyle: {
                  color: '#7F909D'
                }
              },
              axisLabel: {
                margin: 10,
                textStyle: {
                  fontSize: 14
                }
              },
              splitLine: {
                lineStyle: {
                  color: '#57617B'
                }
              }
            }
          ],
          series: [
            {
              name: '浏览量PV',
              type: 'line',
              smooth: true,
              symbol: 'circle',
              symbolSize: 8,
              showSymbol: true,
              lineStyle: {
                normal: {
                  width: 2
                }
              },
              areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(
                    0,
                    0,
                    0,
                    1,
                    [
                      {
                        offset: 0,
                        color: 'rgba(0, 136, 212, 0.3)'
                      },
                      {
                        offset: 0.8,
                        color: 'rgba(0, 136, 212, 0)'
                      }
                    ],
                    false
                  ),
                  shadowColor: 'rgba(0, 0, 0, 0.1)',
                  shadowBlur: 10
                }
              },
              itemStyle: {
                normal: {
                  color: '#55F6FF',
                  borderColor: 'rgba(0,136,212,0.2)'
                }
              },
              data: this.traceLogData.yData
            }
          ],
          dataZoom: [
            {
              type: 'inside',
              start: 0,
              end: 50,
              xAxisIndex: [0]
            }
          ]
        })
      }
    },
    watch: {
      traceLogData: function(val) {
        // console.log('watch',this.id,val)
        this.initChart()
      }
    }
  }
</script>
```

##### chart.vue

```html
<template>
  <div class="chart">
    <LineMarker className="数据显示" id="myChart" ref="traceLog"></LineMarker>
  </div>
</template>
<script>
  import LineMarker from './LineMarker' // echar封装组件
  export default {
    components: {
      LineMarker
    }
  }
</script>
```

## ElementUI Dialog 的使用

### Dialog.vue

```html
<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="670px"
    center
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <!-- 主要布局内容 -->
  </el-dialog>
</template>

<script>
  export default {
    name: 'Dialog',
    props: {
      // 传入的属性
    },
    data() {
      return {
        dialogVisible: false
      }
    },
    methods: {
      show() {
        this.dialogVisible = true
      },
      hide() {
        this.dialogVisible = false
      },
      handleClose() {
        // 关闭前的业务逻辑
        this.hide()
      }
    }
  }
</script>
```

### app.vue

```html
<template>
  <div class="app_box">
    <dialog ref="dialog"></dialog>
  </div>
</template>
<script>
  import Dialog from './Dialog.vue'
  export default {
    components: {
      Dialog
    },
    mounted() {
      this.$refs.dialog.show()
    }
  }
</script>
```

## MessageBox 的复杂使用

### confirm_mixin.js

```js
export default {
  methods: {
    confirmBox({
      component = null,
      componentName = '',
      confirmData = {},
      confirmValidate = () => {},
      ...rest
    }) {
      const h = this.$createElement
      return new Promise((resolve, reject) => {
        this.$msgbox({
          message: h(component, {
            props: { confirmData }
          }),
          beforeClose: (action, instance, done) => {
            const cptInstance = instance.$children.find(child => {
              return child.$options.name === componentName
            })
            confirmValidate(action, cptInstance, done)
          },
          ...rest
        })
          .then(resolve)
          .catch(reject)
      })
    }
  }
}
```

### basicEdit.vue

```html
<template>
  <div class="basic-form">
    <el-form
      ref="basicForm"
      :model="userData"
      :rules="rules"
      :hide-required-asterisk="true"
    >
      <el-form-item label="登录名" prop="userName">
        <el-input disabled v-model="userData.userName" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="userData.password" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: 'BasicEdit',
    data() {
      return {
        userData: {
          userName: this.$parent.data,
          password: ''
        },
        rules: {
          userName: {
            required: true,
            message: '请输入登录名',
            trigger: 'blur'
            // pattern: /^1(3|4|5|6|7|8|9)\d{9}$/ 正则判断
          },
          password: { required: true, message: '请输入密码', trigger: 'blur' }
        }
      }
    },
    methods: {
      validate(cb) {
        return this.$refs.basicForm.validate(cb)
      },
      clearValidate() {
        this.$refs.basicForm.resetFields()
        this.$refs.basicForm.clearValidate()
      }
    },
    mounted() {}
  }
</script>
<style lang="scss" scoped>
  /deep/.el-form-item__label {
    color: #7f909d;
  }
  /deep/.el-input__inner {
    background: #334455;
    border-color: rgba(232, 232, 232, 0.2);
    color: white;
  }
</style>
<style lang="scss">
  .UserInfo_basic {
    width: 520px;
  }
  .UserInfo_basic_cancel {
    float: left;
    background: rgba(0, 0, 0, 0);
    color: white;
    &:hover {
      background: rgba(0, 0, 0, 0.1);
      color: white;
    }
  }
  .UserInfo_basic_confirm {
    float: left;
  }
</style>
```

### index.vue 使用

```html
<script>
  import ConfirmMixin from '../../components/confirm_mixin' // MessageBox插件方法
  import BasicEdit from '../../components/basicEdit' // 基本信息修改弹窗
  export default {
    mixins: [ConfirmMixin],
    mounted() {
      this.confirmBox({
        title: '', // 弹窗左上角显示的标题
        data: '', // 传递给组件的参数
        customClass: 'UserInfo_basic', // 组件的自定义类名 用以修改样式
        showCancelButton: true, // 是否显示取消按钮
        showConfirmButton: true, // 是否显示确认按钮
        cancelButtonText: '取消', // 取消按钮的文本
        confirmButtonText: '保存', // 确认按钮的文本
        cancelButtonClass: 'UserInfo_basic_cancel', // 取消按钮的类名
        confirmButtonClass: 'UserInfo_basic_confirm', // 确认按钮的类名
        component: BasicEdit, // 挂载给messageBox的组件
        componentName: 'BasicEdit', // 组件名称
        // 点击确认按钮的方法 action=>按钮('confirm' || 'cancel') cpt=>组件实例 done=>执行关闭弹窗
        confirmValidate: (action, cpt, done) => {
          if (action === 'cancel') {
            cpt.clearValidate() // 组件实例上的清空表单的方法
            return done() // 关闭弹窗
          }
          // 组件实例上的验证表单的方法
          cpt.validate(valid => {
            // 如验证规则不通过 则返回
            if (!valid) return
            console.log('{userData}: ', { ...cpt.userData })
          })
        }
      }).catch(() => {})
    }
  }
</script>
```

## 权限管理

![目录结构](https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/permission.png)

[源码](https://kamchan.oss-cn-shenzhen.aliyuncs.com/permission.zip)

### App.vue

#### 用在权限控制导航栏的页面即可

```html
<template>
  <div id="app">
    <div id="nav">
      <ul>
        <li
          @click="navTo(item.path)"
          v-for="(item,index) in ruleList"
          :key="index"
        >
          {{item.name}}
        </li>
      </ul>
    </div>
    <router-view />
  </div>
</template>

<script>
  export default {
    data() {
      return {
        ruleList: []
      }
    },
    mounted() {
      setTimeout(() => {
        let list = this.$store.state.routers || []
        this.ruleList = list.filter(v => {
          // 对路由中meta带hidden的路由隐藏 不显示出来
          if (v && v.meta && v.meta.hidden === true) {
            return false
          }
          return true
        })
      })
    },
    methods: {
      navTo(path) {
        this.$router.push(path)
      }
    }
  }
</script>

<style lang="scss">
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  #nav {
    padding: 30px;
    height: 50px;

    ul {
      li {
        list-style: none;
        width: 100px;
        height: 30px;
        border: 1px solid #ccc;
        line-height: 30px;
        border-radius: 20px;
        cursor: pointer;
        float: left;
      }
    }
  }
</style>
```

### main.js

```js
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

import '@/permission' // 权限控制

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
```

### permission.js

```js
import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/auth' // get token from cookie

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/home'] // no redirect whitelist 白名单

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // determine whether the user has logged in
  const hasToken = getToken() || true // 获取token 用的时候要把后面的true去掉

  if (hasToken) {
    // if (to.path === '/login') {
    if (to.path === '/') {
      // 因为没接后台 用的时候 这个应该为登录页面 如果有token 则默认去主页面
      // if is logged in, redirect to the home page
      // next({ path: '/' })
      next({ path: '/home' })
      NProgress.done()
    } else {
      const hasGetUserRoles = store.getters.roles //
      if (hasGetUserRoles.length == 0) {
        // console.log('没有权限时判断的!')
        store
          .dispatch('login')
          .then(res => {
            // 拉取用户信息和权限
            const roles = store.getters.roles //获取经过赛选的本地权限
            store.dispatch('GenerateRoutes', { roles }).then(() => {
              // 生成可访问的路由表
              router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
              router.options.routes = store.getters.routers
              next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
            })
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        //当有用户权限的时候，说明所有可访问路由已生成 如访问没权限的全面会自动进入404页面
        next()
      }
    }
  } else {
    /* 没有 token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      // next(`/login?redirect=${to.path}`)
      next('/home')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
```

### router.js

```js
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

export const constantRoutes = [
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/Home')
  },
  {
    path: '*',
    name: '404',
    component: () => import('@/views/404'),
    meta: {
      hidden: true
    }
  }
]

const createRouter = () =>
  new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

const router = createRouter()

export const asyncRouterMap = [
  {
    path: '/test1',
    name: 'test1',
    component: () => import('@/views/test1'),
    meta: { title: 'test1', role: ['test1'] }
  },
  {
    path: '/test2',
    name: 'test2',
    component: () => import('@/views/test2'),
    meta: { title: 'test2', role: ['test2'] }
  },
  {
    path: '/test3',
    name: 'test3',
    component: () => import('@/views/test3'),
    meta: { title: 'test3', role: ['test3'] }
  },
  {
    path: '/test4',
    name: 'test4',
    component: () => import('@/views/test4'),
    meta: { title: 'test4', role: ['test4'] }
  },
  {
    path: '/test5',
    name: 'test5',
    component: () => import('@/views/test5'),
    meta: { title: 'test5', role: ['test5'] }
  }
]

export default router
```

### store.js

```js
import Vue from 'vue'
import Vuex from 'vuex'
import { resetRouter, constantRoutes, asyncRouterMap } from '@/router'
import { getToken, setToken, removeToken } from '@/auth'
import { authCheckList, filterAsyncRoutes } from '@/utils' //查找本地页面权限

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: getToken(),
    roles: [], //获取的用户权限
    addRouters: [], //添加的权限
    routers: [] //判断权限后所有展示页面
  },
  getters: {
    token: state => state.token,
    roles: state => state.roles,
    addRouters: state => state.addRouters,
    routers: state => state.routers
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_ROUTES: (state, roles) => {
      state.roles = roles
    },
    SET_addRouters: (state, addRouters) => {
      state.addRouters = addRouters
      state.routers = constantRoutes.concat(addRouters)
    },
    SET_routers: (state, routers) => {
      state.routers = routers
    }
  },
  actions: {
    async login({ commit }, data = {}) {
      try {
        return new Promise((resolve, reject) => {
          let data = {
            token: '*********',
            rulelist: [
              {
                id: 1,
                name: 'test1',
                url: '#',
                sort: 1,
                is_super: 0,
                parent_id: 0
              },
              {
                id: 2,
                name: 'test2',
                url: '#',
                sort: 2,
                is_super: 0,
                parent_id: 0
              },
              {
                id: 3,
                name: 'test3',
                url: '#',
                sort: 3,
                is_super: 0,
                parent_id: 0
              },
              {
                id: 4,
                name: 'test4',
                url: '#',
                sort: 4,
                is_super: 0,
                parent_id: 0
              },
              {
                id: 5,
                name: 'test5',
                url: '#',
                sort: 5,
                is_super: 0,
                parent_id: 0
              }
            ]
          }
          let userAuthList = authCheckList(data.rulelist) //后去用户权限
          commit('SET_TOKEN', data.token)
          commit('SET_ROUTES', userAuthList)
          setToken(data.token)
          resolve(data)
        })
      } catch (error) {
        reject(error)
      }
    },
    logout({ commit, state }) {
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', '')
        commit('SET_ROUTES', [])
        commit('SET_addRouters', [])
        commit('SET_routers', [])
        removeToken()
        resetRouter()
        resolve()
      })
    },
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { roles } = data
        // console.log(data)
        let accessedRoutes
        if (roles.includes('admin')) {
          accessedRoutes = asyncRouterMap
        } else {
          accessedRoutes = filterAsyncRoutes(asyncRouterMap, roles)
        }
        commit('SET_addRouters', accessedRoutes)
        resolve(accessedRoutes)
      })
    }
  },
  modules: {}
})
```

### auth.js

```js
import Cookies from 'js-cookie'

const TokenKey = 'token_id'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
```

### utils.js

```js
//根据获取到的用户权限查找本地页面权限
export const rolesList = [
  //权限
  {
    id: 1,
    name: 'test1',
    auth: 'test1'
  },
  {
    id: 2,
    name: 'test2',
    auth: 'test2'
  },
  {
    id: 3,
    name: 'test3',
    auth: 'test3'
  },
  {
    id: 4,
    name: 'test4',
    auth: 'test4'
  },
  {
    id: 5,
    name: 'test5',
    auth: 'test5'
  }
]

export const authCheckList = userAuth => {
  let roleList = []
  if (userAuth.length > 0) {
    for (let item of userAuth) {
      rolesList.map(role => {
        if (item.id == role.id) {
          roleList.push(role.auth)
        }
      })
    }
  }
  return roleList
}
function isAddRoute(pers, route) {
  //查找路由是否拥有此权限
  return pers.some(per => {
    if (route.meta && route.meta.role) {
      if (per == route.meta.role[0]) {
        return true
      }
    }
  })
}
export function filterAsyncRoutes(routes, pers) {
  //过滤权限路由
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (isAddRoute(pers, tmp)) {
      // 目前仅控制一级路由，子路由以后控制
      // if (tmp.children) {
      //   tmp.children = filterAsyncRoutes(tmp.children, roles)
      // }
      // console.log(tmp)
      res.push(tmp)
    }
  })
  return res
}
```
