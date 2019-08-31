---
title: MVVM的介绍
date: 2019-08-27
categories: article
author: Random
tags:
- vue
- webpack
---

- MVVM，一种更好的UI模式解决方案

## MVC

- M: Model 数据模型（专门用来操作数据，数据的CRUD）
- V：View 视图（对于前端来说，就是页面）
- C：Controller 控制器（是视图和数据模型沟通的桥梁，用于处理业务逻辑）

## MVVM组成

- MVVM ===> M / V / VM
- M：model数据模型
- V：view视图
- VM：ViewModel 视图模型

## 优势对比

- MVC模式，将应用程序划分为三大部分，实现了职责分离
- 在前端中经常要通过 JS代码 来进行一些逻辑操作，最终还要把这些逻辑操作的结果现在页面中。也就是需要频繁的操作DOM
- MVVM通过<font color="#c7254e">数据双向绑定</font>让数据自动地双向同步
  - V（修改数据） -> M
  - M（修改数据） -> V
  - 数据是核心
- Vue这种MVVM模式的框架，不推荐开发人员手动操作DOM

## Vue中的MVVM

:::tip
虽然没有完全遵循 MVVM 模型，Vue 的设计无疑受到了它的启发。因此在文档中经常会使用 vm (ViewModel 的简称) 这个变量名表示 Vue 实例
:::

## 学习Vue要转化思想

- 不要在想着怎么操作DOM，而是想着如何操作数据！！！

