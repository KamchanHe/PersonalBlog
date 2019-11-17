---
title: picGo && Github 搭建个人图床
date: 2019-08-24
categories: article
author: Kamchan
tags:
- picGo
- Github
---

# picGo && Github 搭建个人图床

## 1、创建github博客图片仓库

![create](https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/create.png)

    这里我的仓库名为picGos。


## 2、创建github token



![setting](https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/setting.png)

    进入Settings->Developer settings:

    进入Personal access tokens

    点击Generrate new token

![setting](https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/token.png)

    会让你验证密码，输入即可。

    token描述随意，记得勾选下面repo选项，然后确定生成。

![setting](https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/tokenSetting.png)

    最后会生成一个token

    复制下来，注意这个链接仅会显示一次。
    复制下来，注意这个链接仅会显示一次。
    复制下来，注意这个链接仅会显示一次。

## 3、安装PicGo并进行配置

安装PicGo就不细说了，上github下载安装包，下一步到底就ok。

现在来说说如何配置Github图床：

![setting](https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/picGoSetting.png)

最后的自定义域名：<font color="red">https://raw.githubusercontent.com/[仓库名]/master。</font>

如我的域名为：<font color="red">https://raw.githubusercontent.com/KamchanHe/picGo/master</font>

然后就可以欢快的上传图片了。有三种方式上传

- 快捷键上传
- gui界面选择文件（支持多文件）上传
- 支持剪贴板上传（点击gui或者直接用快捷键上传），这个功能真心赞。
