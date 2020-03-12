---
title: 纯CSS按钮点击特效
date: 2020-03-12
categories: article
author: Kamchan
tags:
  - CSS
  - HTML
---

## 效果

![scatteringButton](https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/tips/scatteringButton.gif)

## 代码

### HTML

```html
<button>Click</button>
```

### CSS

```css
button {
  display: inline-block;
  padding: 1em 2em;
  background-color: #ff0081;
  color: #fff;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  position: relative;
  box-shadow: 0 2px 25px rgba(233, 30, 99, 0.5);
  outline: 0;
  transition: transform ease-in 0.1s, background-color ease-in 0.1s,
    box-shadow ease-in 0.25s;
}
button::before {
  position: absolute;
  content: '';
  left: -2em;
  right: -2em;
  top: -2em;
  bottom: -2em;
  pointer-events: none;
  transition: ease-in-out 0.5s;
  background-repeat: no-repeat;
  background-image: radial-gradient(circle, #ff0081 20%, transparent 20%),
    radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(
      circle,
      #ff0081 20%,
      transparent 20%
    ), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(
      circle,
      #ff0081 20%,
      transparent 20%
    ), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(
      circle,
      #ff0081 20%,
      transparent 20%
    ), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(
      circle,
      #ff0081 20%,
      transparent 20%
    ), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(
      circle,
      #ff0081 20%,
      transparent 20%
    ), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(
      circle,
      #ff0081 20%,
      transparent 20%
    ), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(
      circle,
      #ff0081 20%,
      transparent 20%
    ), radial-gradient(circle, #ff0081 20%, transparent 20%);
  background-size: 10% 10%, 20% 20%, 15% 15%, 20% 20%, 18% 18%, 10% 10%, 15% 15%,
    10% 10%, 18% 18%, 15% 15%, 20% 20%, 18% 18%, 20% 20%, 15% 15%, 10% 10%, 20%
      20%;
  background-position: 18% 40%, 20% 31%, 30% 30%, 40% 30%, 50% 30%, 57% 30%,
    65% 30%, 80% 32%, 15% 60%, 83% 60%, 18% 70%, 25% 70%, 41% 70%, 50% 70%,
    64% 70%, 80% 71%;
  animation: bubbles ease-in-out 0.75s forwards;
}

button:active {
  transform: scale(0.95);
  background-color: #f3037c;
  box-shadow: 0 2px 25px rgba(233, 30, 99, 0.5);
}
button:active::before {
  animation: none;
  background-size: 0;
}
@keyframes bubbles {
  0% {
    background-position: 18% 40%, 20% 31%, 30% 30%, 40% 30%, 50% 30%, 57% 30%,
      65% 30%, 80% 32%, 15% 60%, 83% 60%, 18% 70%, 25% 70%, 41% 70%, 50% 70%,
      64% 70%, 80% 71%;
  }
  50% {
    background-position: 10% 44%, 0 20%, 15% 5%, 30% 0%, 42% 0%, 62% -2%, 75% 0%,
      95% -2%, 0% 80%, 95% 55%, 7% 100%, 24% 100%, 41% 100%, 55% 95%, 68% 96%, 95%
        100%;
  }
  100% {
    background-position: 5% 44%, -5% 20%, 7% 5%, 23% 0%, 37% 0, 58% -2%, 80% 0%,
      100% -2%, -5% 80%, 100% 55%, 2% 100%, 23% 100%, 42% 100%, 60% 95%, 70% 96%,
      100% 100%;
    background-size: 0 0;
  }
}
```
