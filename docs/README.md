---
home: true
actionText: Just Do It →
heroImage: https://kamchan.oss-cn-shenzhen.aliyuncs.com/logo.png
heroImageStyle: {
  maxHeight: '300px',
  display: block,
  margin: '3rem auto 1.5rem'
}
actionLink: /vue-info/components
features:
- title: Vue前端工程化
  details: 掌握Vue组件间的多种通信方式及数据同步 渲染函数及jsx高阶应用 vue-cli3、vuex、vue-router进阶之JWT认证
- title: Vue组件化开发
  details: 组件设计思路，组件编写工作流搭建 从0编写复杂组件之异步级联组件 单元测试编写及组件的发布
- title: Vue源码实现
  details: Vue权限菜单及按钮权限 Vue-router、Vuex源码实现 Vue原理剖析
- title: Vue优化和服务器布署
  details: Vue优化预渲染、骨架屏、Nuxt.js服务端渲染 使用typescript构建vue应用 Docker + nginx实现vue的布署和持续集成
- title: Fundebug
  details: 推荐大家使用Fundebug，一款很好用的BUG监控工具~ [官网](https://www.fundebug.com/)
- title: 常用正则大全
  details: 搜集了目前常用的正则公示，即拿即用。
- title: Webpack
  details: webpack是一个'模块管理工具'。随着js能做的事情越来越多，浏览器、服务器，js似乎无处不在，这时，使日渐增多的js代码变得合理有序就显得尤为必要，也应运而生了很多模块化工具。从服务器端到浏览器端，从原生的没有模块系统的`<script>`到基于Commonjs和AMD规范的实现到ES6 modules,为了模块化和更好的模块化。
- title: picGo图床
  details: 所谓图床工具，就是自动把本地图片转换成链接的一款工具，PicGo 算得上一款比较优秀的图床工具。它是一款用 Electron-vue 开发的软件，可以支持微博，七牛云，腾讯云COS，又拍云，GitHub，阿里云OSS，SM.MS，imgur 等8种常用图床，功能强大，简单易用
- title: zsh
  details: macOS 目前使用的 Bash 3.2 版本基于 GPLv2 协议，但新版 Bash 已经转移到了 GPLv3 协议。GPLv3 协议对 Apple 这样的大公司有着更严格的限制。而相比 Bash 来说，Zsh 也拥有许多更强大的功能：更智能的自动补全、命令选项提示、更丰富的主题，等等。
- title: Flexible
  details: 曾几何时为了兼容IE低版本浏览器而头痛，以为到Mobile时代可以跟这些麻烦说拜拜。可没想到到了移动时代，为了处理各终端的适配而乱了手脚。那么趁此Amfe阿里无线前端团队双11技术连载之际,告诉大家使用Flexible实现手淘H5页面的终端适配
- title: Vue用vw实现移动端适配
  details: 有关于移动端的适配布局一直以来都是众说纷纭，对应的解决方案也是有很多种。随着viewport单位越来越受到众多浏览器的支持，在此提出了vw来做移动端的适配问题。
- title: SetApp
  details: SetApp 是完全打破了传统的 Mac 软件销售思路，以全新的「包月订阅制」来为用户提供正版 APP 的使用授权。你只需每月花费两顿饭钱 (年付 $8.99 美刀/月) 来订阅，即可无限制地使用 SetApp 里面收录的全部付费软件，并且可以一直保持更新！非常超值。
---
<script type="text/javascript">
  export default{
    mounted(){
      document.getElementsByTagName('span')[6].style.cursor = 'pointer';
      document.getElementsByTagName('span')[6].children[1].target = 'blank';
      document.getElementsByTagName('span')[6].children[1].href='http://www.beian.miit.gov.cn'
    }
  }
</script>
