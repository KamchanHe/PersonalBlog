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
- title: 
  details:
---

## 完善了框架列表和挑选自己比较喜欢的
## 增加 [接码平台](/tools/sms-code.html#国内)、[新项目问题](/bug/mqsyzt.html)、[Wheels](/wheels/store.html)
## 添加 [Vue项目启动时自动获取本机 IP 地址](/wheels/utils.html#vue项目启动时自动获取本机-ip-地址)

<script type="text/javascript">
  export default{
    mounted(){
      document.getElementsByTagName('span')[10].style.cursor = 'pointer';
      document.getElementsByTagName('span')[10].children[1].target = 'blank';
      document.getElementsByTagName('span')[10].children[1].href='http://www.beian.miit.gov.cn'
    }
  }
</script>
