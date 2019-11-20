---
title: 防抖&节流
date: 2019-11-20
categories: article
author: Kamchan
tags:
- Javascript
- DeBounce
- Throttle
---

## Debounce

```js
function deBounce (fn, time) {
	let timer = null;
	return function (...arguments){
		let _this = this;
		clearTimeout(timer);
		timer = setTimeout(function(){
			fn.apply(_this,arguments);
			timer = null;
		}, time);
	}
};
```

## Throttle

```js
function throttle (fn, time){
	let timer = null;
	return function (...arguments){
		let _this = this;
		if (!timer) {
			timer = setTimeout(function(){
				fn.apply(_this,arguments);
				timer = null;
			}, time)
		}
	}
};
```
