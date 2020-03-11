---
title: RequestAnimationFrame
date: 2020-03-11
categories: article
author: Kamchan
tags:
  - Javascript
  - RequestAnimationFrame
  - Animation
  - Css
---

## requestAnimationFrame

`window.requestAnimationFrame()` 告诉浏览器——你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行

:::warning
若你想在浏览器下次重绘之前继续更新下一帧动画，那么回调函数自身必须再次调用`window.requestAnimationFrame()`
:::

简单来说，可以把它理解为动画版的`setTimeout`，那为什么不用`setTimeout`呢，因为在浏览器中，`setTimeout`可能会因为种种原因导致不那么准确，而`requestAnimationFrame`有一个特点是，它会尽量保持回调函数执行每秒执行 60 次（60fps），电脑卡除外

## 使用方式

```js
let timer
function foo(now) {
  if (now > 1000) {
    // 取消下一次动画帧
    cancelAnimationFrame(timer)
    return
  }
  timer = requestAnimationFrame(foo)
}
requestAnimationFrame(foo)
```

回调函数会接受一个参数，这个参数的值是当前的时间，和`performance.now()`相同

可以看出来和`setTimeout`的使用方式基本相似，除了它的调用次数是有浏览器控制，而`setTimeout`是时间参数控制

## 实现效果

先看看要实现的效果

```js
new Animate({
  element: document.querySelector('.box'),
  duration: 2000
})
  .then({
    transform: ['translate(0px)', 'translate(500px)'],
    background: ['rgb(100, 149, 237)', 'rgb(119, 237, 137)']
  })
  .then({
    duration: 5000,
    transform: ['translate(500px,0px)', 'translate(0,500px)'],
    opacity: [1, 0]
  })
  .run()
```

![requestAnimationFrame](https://kamchan.oss-cn-shenzhen.aliyuncs.com/requestAnimationFrame.gif)

## 入口函数

既然有了`class`，那就用`class`来写

首先，它可以接受一个`options`对象作为参数，这个对象有 2 个值，`element`值表示需要进行动画的元素，`duration`表示动画持续时间

```js
class Animate {
  constructor(options) {
    const { element, duration } = options
    // 需要进行动画的元素
    this.element = element
    // 动画持续时间
    this.duration = duration
    // 用来储存动画的队列，有了它才能做到一个动画结束，另一个动画开始
    this.queue = []
  }
}
```

## 把动画添加到动画队列

示例中，使用.then 方法把动画添加进队列，所以需要添加一个 then 方法

```js
class Animate {
  // ...constructor
  then = options => {
    // duration 每一个动画可以有自己的持续时间，如果没传这个参数就用默认时间
    // keyframes 取其余的参数
    const { duration = this.duration, ...keyframes } = options
    // 把传入的参数转换为我们执行动画时需要的形式
    const animationObject = createKeyframes(keyframes, { duration })
    // 添加进队列
    this.queue.push(animationObject)
    // 链式调用需要return this
    return this
  }
}
```

这里有个非常重点的函数，就是`createKeyframes`，它直接关系到在`requestAnimationFrame`中，该如何去解析我们的动画

```js
.then({
  transform: ["translate(0px，0px)", "translate(500px,200px)"]
})
// ⬇️ 转换为
[{
  // 属性名
  propertyName: "transform",
  // 属性值的字符串去值拆分
  propertyValueStrings: ["translate(", "px)"],
  // 属性值的数字
  propertyValue: [[0,0], [500,200]]
}]
```

原理就是将数字和字符串拆分开，然后在`requestAnimationFrame`中计算数字，再和字符串组合上，赋值给元素的`style`，所以现在来讲核心的实现

## createKeyframes 的实现

先讲一下用到的方法

### Object.entries

`Object.entries`可以把对象转为数组形式

```js
Object.entries({ transform: ['translate(0px)', 'translate(100px)'] })[
  // ⬇️ 变为
  ['transform', ['translate(0px)', 'translate(100px)']]
]
```

### split 和 match

`split`方法可以把字符串根据正则拆分，`match`则可以匹配正则的元素

```js
"a1b2c3d".split(/\d/g);
// ⬇️ 拆分为
[ 'a', 'b', 'c', 'd' ]
"a1b2c3d".match(/\d/g)；
// ⬇️ 匹配
[ '1', '2', '3' ]
```

所以原理就是先使用`Object.entries`遍历对象，在将其中的值使用`split`和`match`方法转换出来，下面看方法的具体实现

```js
// 用来拆分和匹配数字的正则
const regExp = /-?\d*\.?\d+/g
const createKeyframes = (keyframe, options) =>
  // 遍历对象，解构出propertyName和values，values是值的数组，即[from,to]的形式
  Object.entries(keyframe).map(([propertyName, values]) => {
    // 属性值的字符串在from和to的值里都一样，所以直接去第一个来拆分
    // 比如像opacity的值是[1，0]，这个需要转成字符串
    const propertyValueStrings = String(values[0]).split(regExp)
    //如["translate(0px，0px)", "translate(500px,200px)"]变成[[0,0], [500,200]]
    const propertyValue = values.map(value =>
      String(value)
        .match(regExp)
        .map(Number)
    )
    // 返回转换的新对象，options是其他的值，比如duration
    return {
      propertyName,
      propertyValueStrings,
      propertyValue,
      ...options
    }
  })

// 转换试试
createKeyframes({
  transform: ['translate(500px,0px)', 'translate(0,500px)'],
  opacity: [1, 0]
})[
  // ⬇️ 转换为
  ({
    propertyName: 'transform',
    propertyValueStrings: ['translate(', 'px,', 'px)'],
    propertyValue: [
      [500, 0],
      [0, 500]
    ]
  },
  {
    propertyName: 'opacity',
    propertyValueStrings: ['', ''],
    propertyValue: [[1], [0]]
  })
]
```

现在，已经成功可以把参数转换成动画需要的格式，接下来让动画跑起来

## rAF 函数的实现

`rAF`就是`requestAnimationFrame`的缩写嘛，在这个函数里，我们需要根据持续的时间，来计算当前动画的值是多少

```js
const timeTicker = (current, now) => {
  if (!current.startTime) current.startTime = now
  current.stopTime = now - current.startTime
}

class Animate {
  // ...constructor
  // ...then
  rAF = now => {
    // 取出队列中的第一个动画
    const [animationObject] = this.queue
    // 这里使用some方法的原因是，如果同时执行transform和opacity动画，当一个结束了，另一个也应该结束了，这时候就需要把当前的动画对象从动画队列中推出，所以用some判断动画是否结束
    const finished = animationObject.some(current => {
      // 标记当前的时间和应该结束的时间
      // 因为是值引用，所以改了引用对象原对象也会改
      timeTicker(current, now)
      // 从当前执行的动画取出持续时间和
      const { duration, stopTime } = current
      // 计算动画执行的进度，这个值是一个比例
      const progress = duration > 0 ? Math.min(stopTime / duration, 1) : 1
      // 核心方法，将动画值计算后还原为style格式
      const assignStyle = resumeStyles(current, progress)
      Object.assign(this.element.style, assignStyle)
      return progress === 1
    })
    // 如果结束了，把当前的动画对象从动画队列中推出
    if (finished) this.queue.shift()
    // 如果队列中还有动画，继续执行
    if (this.queue.length) requestAnimationFrame(this.rAF)
  }
}
```

## 将值还原为 style 格式

`resumeStyles`函数在整个流程中也是非常重要的，没有这个函数，就无法将值赋值给元素

```js
const resumeStyles = (
  // 解构出属性名，用于拼接属性值的string数组，值再解构出from和to
  // 具体值的格式见上方的createKeyframes函数实现
  { propertyName, propertyValueStrings, propertyValue: [from, to] },
  // 进度，用来计算当前值
  progress
) => {
  // 对propertyValueStrings做reduce操作，计算出style格式
  const propertyValue = propertyValueStrings.reduce(
    (styles, current, index) => {
      // 计算当前动画的值，也就是开始位置 +（结束位置 - 开始位置）* 进度
      const getCurrentValue = (a, b) => a + (b - a) * progress;
      // 这里需要-1是关键，比如字符串为["translate(", "px,", "px)"]，但值为[0,500]
      // 所以当string的下标是1的时候，应该对应value的下标0
      const valueIndex = index - 1;
      const value = getCurrentValue(from[valueIndex], to[valueIndex]);
      // 拼接字符串
      return styles + value + current;
    }
  );
  return { [propertyName]: propertyValue };
};
```

## 完成后

```js
// 正则
const regExp = /-?\d*\.?\d+/g;
// 创建animationObject
const createKeyframes = (keyframe, options) =>
  Object.entries(keyframe).map(([propertyName, values]) => {
    const propertyValueStrings = String(values[0]).split(regExp);
    const propertyValue = values.map(value =>
      String(value)
        .match(regExp)
        .map(Number)
    );
    return {
      propertyName,
      propertyValueStrings,
      propertyValue,
      ...options
    };
  });
// 将值拼接还原style格式
const resumeStyles = (
  { propertyName, propertyValueStrings, propertyValue: [from, to] },
  progress
) => {
  const propertyValue = propertyValueStrings.reduce(
    (styles, current, index) => {
      const getCurrentValue = (a, b) => a + (b - a) * progress;
      const valueIndex = index - 1;
      const value = getCurrentValue(from[valueIndex], to[valueIndex]);
      return styles + value + current;
    }
  );
  return { [propertyName]: propertyValue };
};
// 标记时间
const timeTicker = (current, now) => {
  if (!current.startTime) current.startTime = now;
  current.stopTime = now - current.startTime;
};

class Animate {
  constructor(options) {
    const { element, duration } = options;
    this.element = element;
    this.duration = duration;
    this.queue = [];
  }
  // 动画执行函数
  rAF = now => {
    const [animationObject] = this.queue;
    const finished = animationObject.some(current => {
      timeTicker(current, now);
      const { duration, stopTime } = current;
      const progress = duration > 0 ? Math.min(stopTime / duration, 1) : 1;
      const assignStyle = resumeStyles(current, progress);
      Object.assign(this.element.style, assignStyle);
      return progress === 1;
    });
    if (finished) this.queue.shift();
    if (this.queue.length) requestAnimationFrame(this.rAF);
  };
	// 添加动画
  then = options => {
    const { duration = this.duration, ...keyframes } = options;
    const animationObject = createKeyframes(keyframes, { duration });
    this.queue.push(animationObject);
    return this;
  };
	// 开始执行
  run = () => requestAnimationFrame(this.rAF);
}
```

代码量不大，逻辑不算复杂，不过需要注意的是我只在`Chrome80`里试了，`Safari`都不行，因为不支持类里的箭头函数，如果想要通用还是需要`bind`或者`babel`
主要的核心点在于`createKeyframes`和`resumeStyles`这两个函数，如果能理解这2个函数是如何运行的，恭喜你，也有一个自己的动画轮子了

## 还差点什么

大家都知道，在`CSS`里的动画，会有`ease-out`，`ease-in-out`这样的选项，现在我们的动画就是个纯线性，看着也怪怪得

其实在我们这个轮子上添加这个很简单，只需要找到一个公式

```js
const easings = {
  linear: t => t,
  easeInQuad: t => t * t,
  easeOutQuad: t => t * (2 - t),
  easeInOutQuad: t => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeInCubic: t => t * t * t,
  easeOutCubic: t => --t * t * t + 1,
  easeInOutCubic: t =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  easeInQuart: t => t * t * t * t,
  easeOutQuart: t => 1 - --t * t * t * t,
  easeInOutQuart: t => (t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t),
  easeInQuint: t => t * t * t * t * t,
  easeOutQuint: t => 1 + --t * t * t * t * t,
  easeInOutQuint: t =>
    t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t
};
```

公式接受一个数字参数，计算出相应的数值，有了它，动画就不再是线性啦

把它添加到我们的轮子

```js
class Animate {
  constructor(options) {
    // 新增一个easing参数
    const { element, duration, easing = "linear" } = options;
    this.element = element;
    this.duration = duration;
    this.easing = easing;
  	// ..
  }
  rAF = now => {
    // ...
      const { duration, stopTime, easing } = current;
      // ...
    	// 解构出来并套入easings函数计算
      const assignStyle = resumeStyles(current, easings[easing](progress));
		// ...
  };
  then = options => {
    const {
      duration = this.duration,
      easing = this.easing,
      ...keyframes
    } = options;
    // 添加到animationObject
    const animationObject = createKeyframes(keyframes, { duration, easing });
    // ...
  };
	// .. run
}
```

当传入`easing`参数后，动画表现就不一样了，有兴趣的同学可以试试

## 完整代码

```js
// 正则
const regExp = /-?\d*\.?\d+/g
// 创建animationObject
const createKeyframes = (keyframe, options) =>
  Object.entries(keyframe).map(([propertyName, values]) => {
    const propertyValueStrings = String(values[0]).split(regExp)
    const propertyValue = values.map(value =>
      String(value)
        .match(regExp)
        .map(Number)
    )
    return {
      propertyName,
      propertyValueStrings,
      propertyValue,
      ...options
    }
  })
// 将值拼接还原style格式
const resumeStyles = (
  { propertyName, propertyValueStrings, propertyValue: [from, to] },
  progress
) => {
  const propertyValue = propertyValueStrings.reduce(
    (styles, current, index) => {
      const getCurrentValue = (a, b) => a + (b - a) * progress
      const valueIndex = index - 1
      const value = getCurrentValue(from[valueIndex], to[valueIndex])
      return styles + value + current
    }
  )
  return { [propertyName]: propertyValue }
}
// 标记时间
const timeTicker = (current, now) => {
  if (!current.startTime) current.startTime = now
  current.stopTime = now - current.startTime
}
const easings = {
  linear: t => t,
  easeInQuad: t => t * t,
  easeOutQuad: t => t * (2 - t),
  easeInOutQuad: t => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeInCubic: t => t * t * t,
  easeOutCubic: t => --t * t * t + 1,
  easeInOutCubic: t =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  easeInQuart: t => t * t * t * t,
  easeOutQuart: t => 1 - --t * t * t * t,
  easeInOutQuart: t => (t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t),
  easeInQuint: t => t * t * t * t * t,
  easeOutQuint: t => 1 + --t * t * t * t * t,
  easeInOutQuint: t =>
    t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t
}

class Animate {
  constructor(options) {
    const { element, duration, easing = 'linear' } = options
    this.element = element
    this.duration = duration
    this.easing = easing
    this.queue = []
  }
  // 动画执行函数
  rAF = now => {
    const [animationObject] = this.queue
    const finished = animationObject.some(current => {
      timeTicker(current, now)
      const { duration, stopTime, easing } = current
      const progress = duration > 0 ? Math.min(stopTime / duration, 1) : 1
      const assignStyle = resumeStyles(current, easings[easing](progress))
      Object.assign(this.element.style, assignStyle)
      return progress === 1
    })
    if (finished) this.queue.shift()
    if (this.queue.length) requestAnimationFrame(this.rAF)
  }
  // 添加动画
  then = options => {
    const {
      duration = this.duration,
      easing = this.easing,
      ...keyframes
    } = options
    const animationObject = createKeyframes(keyframes, { duration, easing })
    this.queue.push(animationObject)
    return this
  }
  // 开始执行
  run = () => requestAnimationFrame(this.rAF)
}

new Animate({
  element: document.querySelector('.box'),
  duration: 2000
})
  .then({
    transform: ['translate(0px)', 'translate(500px)'],
    background: ['rgb(100, 149, 237)', 'rgb(119, 237, 137)']
  })
  .then({
    duration: 5000,
    transform: ['translate(500px,0px)', 'translate(0,500px)'],
    opacity: [1, 0]
  })
  .run()
```

## 总结

里面的核心动画方式，都是从[animateplus](https://github.com/bendc/animateplus)这个库里总结出来的，不过这个轮子的实现方式和它还是不同，并且我们的只能单元素动画，它支持更多的功能和效果