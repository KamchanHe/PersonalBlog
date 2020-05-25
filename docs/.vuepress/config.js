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
    repo: 'https://github.com/KamchanHe', //GitHub默认配置
    // type:'blog',//博客大头模式
    // friendLink: [
    //   {
    //     title: 'vuepress-theme-reco',
    //     desc: 'A simple and beautiful vuepress Blog & Doc theme.',
    //     avatar:
    //       'https://vuepress-theme-reco.recoluan.com/icon_vuepress_reco.png',
    //     link: 'https://vuepress-theme-reco.recoluan.com'
    //   },
    //   {
    //     title: '午后南杂',
    //     desc: 'Enjoy when you can, and endure when you must.',
    //     email: 'recoluan@qq.com',
    //     link: 'https://www.recoluan.com'
    //   }
    // ],
    sidebar: 'auto',
    sidebarDepth: 2, // e'b将同时提取markdown中h2 和 h3 标题，显示在侧边栏上。
    // 博客配置
    blogConfig: {
      // category: {
      //   location: 2, // 在导航栏菜单中所占的位置，默认2
      //   text: 'Category' // 默认文案 “分类”
      // },
      // tag: {
      //   location: 3, // 在导航栏菜单中所占的位置，默认3
      //   text: 'Tag' // 默认文案 “标签”
      // }
    },
    lastUpdated: 'Last Updated',
    record: '粤ICP备19023908号-1',
    recordLink: 'http://www.beian.miit.gov.cn/',
    startYear: '2019',
    author: 'Kamchan',
    logo: 'https://kamchan.oss-cn-shenzhen.aliyuncs.com/logo.png',
    // vssueConfig: {
    //   platform: 'github',
    //   owner: 'Kamchan',
    //   repo: 'Kamchan House',
    //   clientId: 'fb3a3861cfb310fce0e2',
    //   clientSecret: 'be991c53264a7e8a3818b95a8be4f30aad64f73d'
    // },
    valineConfig: {
      //留言版
      appId: 'NE1XRs9MbGtGdY9iDX98mCCw-gzGzoHsz', // your appId
      appKey: 'BhP1EPqoCEbD2NKYfXwoIpkG' // your appKey
    },
    // keyPage: {
    //       keys: ['123456'],
    //       color: '#42b983', // 登录页动画球的颜色
    //       lineColor: '#42b983' // 登录页动画线的颜色
    //     },
    nav: [
      { text: '首页', link: '/', icon: 'reco-home' }, // 内部链接 以docs为根目录
      {
        text: 'wheels',
        icon: 'reco-api',
        items: [
          { text: 'Vue小型项目状态管理', link: '/wheels/store.md' },
          { text: '内网穿透', link: '/wheels/penetration.md' },
          { text: '移动端自适应初始化', link: '/wheels/reset.md' },
          { text: '数字递增动画', link: '/wheels/counter.md' },
          { text: 'Utils-常用方法', link: '/wheels/utils.md' },
          { text: 'RequestAnimationFrame', link: '/wheels/requestAnimationFrame.md' },
          { text: 'JS生成CSV文件', link: '/wheels/jscsv.md' },
          { text: '常用插件', link: '/wheels/plugins.md' },
          { text: 'iOS设备开发参数', link: '/wheels/ios.md' },
          { text: 'Lodash.js', link: '/wheels/lodash.md' },
          { text: 'Immutable.js', link: '/wheels/Immutable.md' },
          { text: 'Vue EventBus', link: '/wheels/eventBus.md' },
          { text: '手写各种源码', link: '/wheels/handwritten.md' },
          { text: 'Axios封装', link: '/wheels/axios.md' },
          { text: '服务端token', link: '/wheels/jwt_token.md' },
          { text: 'Vue-BetterScroll-Scroll', link: '/wheels/scroll.md' },
          { text: 'Vue-BetterScroll-Slier', link: '/wheels/slider.md' },
          { text: '服务端+客户端 socket', link: '/wheels/socket.md' },
          { text: 'Vue-progress', link: '/wheels/progress.md' },
          { text: '自封装VueScroll', link: '/wheels/vueScroll.md' },
          { text: '翻牌倒计时', link: '/wheels/countdown.md' },
          { text: '常用框架', link: '/wheels/framework.md' }
        ]
      },
      {
        text: '开发',
        icon: 'reco-blog',
        items: [
          { text: 'Vue的api', link: '/vue-api/introduce' },
          { text: 'Vue进阶教程', link: '/vue-info/components' },
          { text: 'webpack', link: '/webpack/module' },
          { text: 'flexible移动端适配', link: '/flexible/flexible' },
          { text: 'vw实现移动端适配', link: '/vw/vw' },
          { text: '移动端适配方案', link: '/rem/rem' },
          { text: '移动端1px解决方案', link: '/tips/1px' },
          { text: '纯CSS按钮点击特效', link: '/tips/scatteringButton' },
          { text: 'vue实现页面生成海报', link: '/tips/poster' },
          { text: 'canvas饼状图', link: '/tips/canvasPie' },
          { text: 'canvas画板', link: '/tips/canvasBoard' },
          { text: 'css实现进度圆环', link: '/tips/cssRing' },
          { text: 'svg实现进度圆环', link: '/tips/svgRing' },
          { text: 'canvas实现进度圆环', link: '/tips/canvasRing' },
          { text: 'svg实现贝塞尔曲线动画', link: '/tips/svgBezier' }
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
      { text: 'Plugin', link: '/plugin/plugin', icon: 'reco-gitlab' },
      {
        text: 'Technology',
        icon: 'reco-huawei',
        items: [
          { text: 'iOS上用python爬小说/图片', link: '/technology/01' },
          { text: '0元获得100万TB大小的云盘', link: '/technology/02' },
          { text: '国内直连谷歌云盘', link: '/technology/03' },
          { text: '任意转存文件到自己的共享盘', link: '/technology/04' }
        ]
      },
      {
        text: 'FTF',
        icon: 'reco-sf',
        link: '/ftf/ftf.md'
      },
      {
        text: 'Personal',
        icon: 'reco-lock',
        link: '/lockPage/01.md'
      },
      { text: 'Project', link: '/project/home', icon: 'reco-lock' },
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
        ['/bug/lodash', 'Vue3.0上遇到的Lodash使用问题'],
        ['/bug/quarklend', '日日币H5遇到的问题']
      ],
      '/project/': [
        ['/project/home', '项目展示'],
        ['/project/mqsy', '美祺溯源中台(企业)']
      ],
      '/flexible/': [
        ['/flexible/flexible', 'Flexible实现淘宝H5页面的终端适配']
      ],
      '/vw/': [['/vw/vw', 'Vue项目中使用vw实现移动端适配']],
      '/rem/': [['/rem/rem', '移动端适配方案']],
      '/wheels/': [
        ['/wheels/store.md', 'Vue小型项目状态管理'],
        ['/wheels/penetration.md', '内网穿透'],
        ['/wheels/counter.md', '数字递增动画'],
        ['/wheels/utils.md', 'Utils'],
        ['/wheels/requestAnimationFrame.md', 'RequestAnimationFrame'],
        ['/wheels/jscsv.md', 'JS生成CSV文件'],
        ['/wheels/plugins.md', '常用插件'],
        ['/wheels/ios.md', 'iOS设备开发参数'],
        ['/wheels/lodash.md', 'Lodash.js'],
        ['/wheels/Immutable.md', 'Immutable.js'],
        ['/wheels/eventBus.md', 'Vue EventBus'],
        ['/wheels/handwritten.md', '手写各种源码'],
        ['/wheels/axios.md', 'Axios封装'],
        ['/wheels/reset.md', '移动端自适应初始化'],
        ['/wheels/jwt_token.md', '服务端Token'],
        ['/wheels/scroll.md', 'Vue-scroll'],
        ['/wheels/slider.md', 'Vue-slider'],
        ['/wheels/socket.md', '服务端+客户端 socket'],
        ['/wheels/progress.md', 'Vue-progress'],
        ['/wheels/vueScroll.md', '自封装Vue-Scroll'],
        ['/wheels/countdown.md', '翻牌倒计时'],
        ['/wheels/framework.md', '常用框架']
      ],
      '/tools/': [['/tools/sms-code', '接码平台']],
      '/technology/': [
        ['/technology/01.md', 'iOS用python爬小说/图片'],
        ['/technology/02.md', '0元获得100万TB大小的云盘'],
        ['/technology/03.md', '国内直连谷歌云盘'],
        ['/technology/04.md', '任意转存文件到自己的共享盘']
      ],
      '/lockPage/': [['/lockPage/01.md', '构建一个小型的证券知识图谱']],
      '/tips/': [
        ['/tips/1px.md', '移动端1px解决方案'],
        ['/tips/scatteringButton.md', '纯CSS按钮点击特效'],
        ['/tips/poster.md', 'vue实现页面生成海报'],
        ['/tips/canvasPie.md', 'canvas饼状图'],
        ['/tips/canvasBoard.md', 'canvas画板'],
        ['/tips/cssRing.md', 'css实现进度圆环'],
        ['/tips/svgRing.md', 'svg实现进度圆环'],
        ['/tips/canvasRing.md', 'canvas实现进度圆环'],
        ['/tips/svgBezier.md', 'svg实现贝塞尔曲线动画']
      ]
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
    ['@vuepress-reco/vuepress-plugin-loading-page'],
    ['flowchart']
  ]
}
