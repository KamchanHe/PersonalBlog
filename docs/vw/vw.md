---
title: 在Vue项目中使用vw实现移动端适配
date: 2019-11-17
categories: article
author: Kamchan
tags:
- Javascript
- vw
- rem
- 自适应
- webpack
- vue
---

有关于移动端的适配布局一直以来都是众说纷纭，对应的解决方案也是有很多种。在[《使用Flexible实现手淘H5页面的终端适配》](https://github.com/amfe/article/issues/17)提出了Flexible的布局方案，随着<font color="#e7254e">viewport</font>单位越来越受到众多浏览器的支持，因此在[《再聊移动端页面的适配》](https://www.w3cplus.com/css/vw-for-layout.html)一文中提出了<font color="#e7254e">vw</font>来做移动端的适配问题。到目前为止不管是哪一种方案，都还存在一定的缺陷。言外之意，还没有哪一个方案是完美的。

事实上真的不完美？其实不然。最近为了新项目中能更完美的使用<font color="#e7254e">vw</font>来做移动端的适配。探讨出一种能解决不兼容<font color="#e7254e">viewport</font>单位的方案。今天整理一下，记录在这，方便自己以后查阅。

## 准备工作