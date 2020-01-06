---
title: 内网穿透
date: 2020-01-03
categories: article
author: Kamchan
tags:
- Linux
- 阿里云
- SSH
- Frp
---

## 阿里云轻量级服务器面板放行端口

### 放行 6000、7000、7500端口

![放行端口](https://kamchan.oss-cn-shenzhen.aliyuncs.com/frp/fxdk.png)

## 服务器安装Frp

### 控制台连接阿里云服务器
```
# ssh 用户名@服务器外网IP

ssh root@xxx.xxx.xxx.xxx
```

### 回到最外层
```
cd /
```

### 进入home创建frp文件夹
```
cd /home
mkdir frp
cd frp
```

### 安装和解压
```
wget https://github.com/fatedier/frp/releases/download/v0.30.0/frp_0.30.0_linux_amd64.tar.gz
tar -xzvf frp_0.30.0_linux_amd64.tar.gz
```

### 在公网服务器上删除客户端相关的文件，只保留一下两个文件：

```
frps  frps.ini
```

### 在内网机器上删除服务端相关的文件，只保留以下两个文件：

```
frpc   frpc.ini
```

## 服务器配置

### 修改公网服务器上的服务端配置文件 frps.ini

#### 编辑frps.ini文件
按i开始编辑
编辑完成按ESC结束编辑
输入:wq退出
```
vim frps.ini
```

#### 服务端配置说明
```
配置文件如下：

[common]

bind_port = 7000 #客户端和服务端连接的端口，这个端口号我们之后在配置客户端的时候要用到。

dashboard_port = 7500 #服务器端仪表板的端口，可以查看服务器状态。

token = 123456 #登录令牌口令，这个也是配置客户端要用到的。

dashboard_user = admin #表示打开仪表板页面登录的用户名。

dashboard_pwd = admin #表示打开仪表板页面登录的密码。

vhost_http_port = 80 #反向代理HTTP主机时使用。

vhost_https_port = 10443 #反向代理HTTPS主机时使用。
```

#### 服务端成功过的配置
```
[common]
bind_port = 7000
dashboard_port = 7500
token = 123456
dashboard_user = admin
dashboard_pwd = admin
vhost_http_port = 80
vhost_https_port = 443   
```

### 搞完这些，你就可以运行frp服务器了。

#### 运行服务器文件

```
./frps -c frps.ini
```

#### 运行后控制台打印

![server](https://kamchan.oss-cn-shenzhen.aliyuncs.com/frp/server.png)

#### 域名:7500访问面板

![登录面板](https://kamchan.oss-cn-shenzhen.aliyuncs.com/frp/dashboard.png)

## 客户端安装frp

### [官网下载](https://github.com/fatedier/frp/blob/master/README_zh.md) 随便找个地方解压 文件只保留 frpc frpc.ini

#### 我的Mac下载的版本 [frp_0.31.0_darwin_amd64.tar.gz](https://github.com/fatedier/frp/releases/download/v0.31.0/frp_0.31.0_darwin_amd64.tar.gz)

## 客户端配置

### 客户端配置说明

```
[common] 

server_addr = x.x.x.x #你的服务器地址

server_port = 7000 

token = 123456 #你的令牌口令

[web] #客户用户名

type = http #连接类型：http，tcp，udp 

local_ip = 127.0.0.1    #本地地址，自己填 

 local_port = 80  #本地地址端口，自己填 

custom_domains = test.yourdomain.com #自定义子域名，访问用的。
```

### 客户端成功过的配置

```
[common] 
server_addr = 112.74.46.214
server_port = 7000 
token = 123456
[web]
type = http
local_ip = 127.0.0.1
local_port = 8080
custom_domains = www.kamchan.top
```

### 客户端运行

```
./frpc -c frpc.ini
```

### 客户端控制台打印

![client](https://kamchan.oss-cn-shenzhen.aliyuncs.com/frp/client.png)

### 客户端连上服务端后控制台打印

![connect](https://kamchan.oss-cn-shenzhen.aliyuncs.com/frp/connect.png)

## 本地快速开启服务器

### 全局安装anywhere
```
npm i anywhere -g
```

### 开启服务器

#### 需和本地配置文件 frpc.ini里的local_port相同
```
anywhere 8080
```

![anywhere](https://kamchan.oss-cn-shenzhen.aliyuncs.com/frp/anywhere.png)


#### 域名直接访问本地服务器

![href](https://kamchan.oss-cn-shenzhen.aliyuncs.com/frp/href.png)

## Vue项目的话 可能会遇到Invalid Host header

### 解决方法

```js
// vue.config.js文件中
module.exports = {
  devServer: {
    disableHostCheck: true
  }
}
```





