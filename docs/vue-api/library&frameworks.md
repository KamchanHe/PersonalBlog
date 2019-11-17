---
title: 库和框架的区别
date: 2019-08-27
categories: article
author: Random
tags:
- vue
- webpack
---

框架与库之间最本质区别在于控制权：you call libs, frameworks call you（控制反转）

![library_framework](https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/library_framework.png)

**库**：库是更多是一个封装好的特定的集合，提供给开发者使用，而且是特定于某一方面的集合（方法和函数），库没有控制权，控制权在使用者手中，在库中查询需要的功能在自己的应用中使用，我们可以从封装的角度理解库；

**框架**：框架顾名思义就是一套架构，会基于自身的特点向用户提供一套相当于叫完整的解决方案，而且控制权的在框架本身，使用者要找框架所规定的某种规范进行开发。

:::tip
在实际中，像angular、backbone、vue就属于框架，而jQuery、react、underscore就是库，在前者中我们完全可以自由的使用后者，同时也可以没有前者的基础之上使用后者，都是很自由，控制权始终在我们的手中，但是使用框架时候就必须按照它的规范来进行模块化的开发；
:::

>     可能有人会问react也是库么？的确它就是一个库，为什么呢？
>>      React和react-router, react-redux结合起来才叫框架，本身只是充当一个前端渲染的库而已；
>>>     开头有说到框架是有一套解决方案的，react就是纯粹写UI组件的 没有什么异步处理机制、模块化、表单验证这些

## Library

:::tip
库，本质上是一些函数的集合。每次调用函数，实现一个特定的功能，接着把<font color="#c7254e">控制权</font>交给使用者
:::

- 代表：jQuery
- jQuery这个库的核心：DOM操作，即：封装DOM操作，简化DOM操作

## Framework

:::tip
框架，是一套完整的解决方案，使用框架的时候，需要把你的代码放到框架合适的地方，框架会在合适的时机调用你的代码
:::

- 框架规定了自己的编程方式，是一套完整的解决方案
- 使用框架的时候，由框架控制一切，我们只需要按照规则写代码

## 主要区别

- You call Library, Framework calls you
- 核心点：谁起到主导作用（控制反转）
  - 框架中控制整个流程的是框架
  - 使用库，由开发人员决定如何调用库中提供的方法（辅助）
- 好莱坞原则：Don't call us, we'll call you.
- 框架的侵入性很高（从头到尾）