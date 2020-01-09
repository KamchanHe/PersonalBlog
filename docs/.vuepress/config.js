const path = require('path')
module.exports = {
  theme: 'reco',
  title: 'Kamchan House',
  base: '/',
  description: "Kamchan's Personal Blog",
  port: 8004,
  markdown: {
    lineNumbers: true
  },
  head: [
    [
      'link',
      {
        rel: 'shortcut icon',
        type: 'image/x-icon',
        href:
          'https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/favicon.ico'
      }
    ],
    [
      'meta',
      {
        name: 'viewport',
        content: 'width=device-width,initial-scale=1,user-scalable=no'
      }
    ]
  ],
  themeConfig: {
    huawei: true,
    repo: 'https://github.com/KamchanHe/KamchanHe.github.io', //GitHub默认配置
    // type:'blog',//博客大头模式
    sidebarDepth: 2, // e'b将同时提取markdown中h2 和 h3 标题，显示在侧边栏上。
    // 最后更新时间
    lastUpdated: 'Last Updated',
    record: '粤ICP备19023908号-1',
    startYear: '2019',
    author: 'Kamchan',
    logo: 'https://kamchan.oss-cn-shenzhen.aliyuncs.com/logo.png',
    // valineConfig: { //留言版
    //   appId: 'mX1T7Ghg0ouHlK8wQv1dCPbj-gzGzoHsz',// your appId
    //   appKey: 'gyK6CKRbwGB8MdxF7LsHAQnF', // your appKey
    // },
    // plugins: ['@vuepress/last-updated'],
    // keyPage: {
    //       keys: ['123456'],
    //       color: '#42b983', // 登录页动画球的颜色
    //       lineColor: '#42b983' // 登录页动画线的颜色
    //     },
    nav: [
      { text: '首页', link: '/', icon: 'reco-home' }, // 内部链接 以docs为根目录
      { text: 'wheels', link: '/wheels/store.md', icon: 'reco-api' },
      {
        text: '开发',
        icon: 'reco-document',
        items: [
          { text: 'Vue的api', link: '/vue-api/introduce' },
          { text: 'Vue进阶教程', link: '/vue-info/components' },
          { text: 'webpack', link: '/webpack/module' },
          { text: 'flexible移动端适配', link: '/flexible/flexible' },
          { text: 'vw实现移动端适配', link: '/vw/vw' },
          { text: '移动端适配方案', link: '/rem/rem' }
        ]
      },
      {
        text: 'Tools',
        icon: 'reco-other',
        items: [
          { text: '图床', link: '/picGo/picGo&&Github' },
          { text: 'zsh', link: '/zsh/zsh' },
          { text: '正则大全', link: '/regular/regular' },
          { text: '接码平台', link: '/tools/sms-code' }
        ]
      },
      { text: "Plugin", link: "/plugin/plugin", icon: "reco-gitlab" },
      // { text: "Project", link: "/project/home", icon: "reco-gitlab" },
      { text: 'BUG', link: '/bug/wxLudan', icon: 'reco-document' },
      { text: 'TimeLine', link: '/timeline/', icon: 'reco-date' }
      // 下拉列表
      // {
      //   text: 'GitHub',
      //   icon: 'reco-github',
      //   items: [
      //     { text: 'GitHub地址', link: 'https://github.com/OBKoro1' },
      //     {
      //       text: '算法仓库',
      //       link: 'https://github.com/OBKoro1/Brush_algorithm'
      //     }
      //   ]
      // }
    ],
    sidebar: {
      '/vue-info/': [
        ['/vue-info/components', 'Vue组件间通信方式'],
        ['/vue-info/jsx', 'render函数之JSX应用'],
        ['/vue-info/jwt', 'JWT认证'],
        ['/vue-info/cascader', '级联组件编写'],
        ['/vue-info/unit', 'Vue单元测试'],
        ['/vue-info/auth', 'Vue权限菜单及按钮权限'],
        ['/vue-info/vue-router', 'Mini Vue-Router && Mini Vuex'],
        ['/vue-info/source', 'Vue原理剖析'],
        ['/vue-info/ssr', 'Vue优化'],
        ['/vue-info/vue+ts', 'Vue + TS 开发应用']
      ],
      '/picGo/': [
        ['/picGo/picGo&&Github', 'picGo && Github 搭建个人图床'],
        ['/picGo/core', '快速上手picGo-Core']
      ],
      '/vue-api/': [
        ['/vue-api/introduce', 'Vue -渐进式JavaScript框架'],
        ['/vue-api/library&frameworks', '库和框架的区别'],
        ['/vue-api/mvvm', 'MVVM的介绍'],
        ['/vue-api/start', '起步'],
        ['/vue-api/twoWayDataBinding', '双向数据绑定'],
        ['/vue-api/instruction', '指令'],
        ['/vue-api/style-class', '样式处理'],
        ['/vue-api/fillter', '过滤器 fillter'],
        ['/vue-api/keyModifier', '按键修饰符'],
        ['/vue-api/watch', '监视数据变化 - watch'],
        ['/vue-api/computed', '计算属性'],
        ['/vue-api/lifeCycle', '生命周期'],
        ['/vue-api/directive', '自定义指令'],
        ['/vue-api/component', '组件定义'],
        ['/vue-api/communication', '组件通信'],
        ['/vue-api/single', 'vue单文件组件']
      ],
      '/zsh/': [['/zsh/zsh', 'Shell——Oh My Zsh 配置指南']],
      '/webpack/': [
        ['/webpack/module', '前端模块化'],
        ['/webpack/introduce', 'webpack概述'],
        ['/webpack/install', 'webpack的基本使用'],
        ['/webpack/publishing', 'Webpack 发布项目'],
        ['/webpack/vue-cli3', 'vue-cli3 配置webpack']
      ],
      '/regular/': [['/regular/regular', '常用正则表达式']],
      '/plugin/': [['/plugin/plugin', '插件库']],
      '/bug/': [
        ['/bug/wxLudan', '鲁蛋小程序开发遇到的问题'],
        ['/bug/ypdWxH5', '优普道H5开发遇到的问题'],
        ['/bug/mqsyzt', '美祺溯源中台开发遇到的问题'],
        ['/bug/lodash', 'Vue3.0上遇到的Lodash使用问题']
      ],
      '/project/': [
        ['/project/home', '项目展示'],
        ['/project/mqsy', '美祺溯源中台']
      ],
      '/flexible/': [
        ['/flexible/flexible', 'Flexible实现淘宝H5页面的终端适配']
      ],
      '/vw/': [['/vw/vw', 'Vue项目中使用vw实现移动端适配']],
      '/rem/': [['/rem/rem', '移动端适配方案']],
      '/wheels/': [
        ['/wheels/store.md', 'Vue小型项目状态管理'],
        ['/wheels/penetration.md', '内网穿透'],
        ['/wheels/utils.md', 'Utils'],
        ['/wheels/plugins.md', '常用插件'],
        ['/wheels/ios.md', 'iOS设备开发参数'],
        ['/wheels/lodash.md', 'Lodash.js'],
        ['/wheels/Immutable.md', 'Immutable.js'],
        ['/wheels/eventBus.md', 'Vue EventBus'],
        ['/wheels/debounce&throttle.md', '防抖 & 节流'],
        ['/wheels/axios.md', 'axios请求封装'],
        ['/wheels/ajax.md', '做项目用过的axios封装'],
        ['/wheels/jwt_token.md', '服务端Token'],
        ['/wheels/scroll.md', 'Vue-scroll'],
        ['/wheels/slider.md', 'Vue-slider'],
        ['/wheels/socket.md', '服务端+客户端 socket'],
        ['/wheels/progress.md', 'Vue-progress'],
        ['/wheels/vueScroll.md', '自封装Vue-Scroll'],
        ['/wheels/countdown.md', '翻牌倒计时'],
        ['/wheels/framework.md', '常用框架']
      ],
      '/tools/': [['/tools/sms-code', '接码平台']]
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@pubilc': path.join(__dirname, 'pubilc')
      }
    }
  },
  plugins: [
    ['@vuepress-reco/extract-code'],
    [
      '@vuepress-reco/vuepress-plugin-kan-ban-niang',
      {
        theme: ['koharu'],
        clean: true
      }
    ],
    [
      '@vuepress-reco/vuepress-plugin-loading-page'
    ]
  ]
}
