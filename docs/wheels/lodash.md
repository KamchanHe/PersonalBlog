---
title: Lodash.js
date: 2019-12-03
categories: article
author: Kamchan
tags:
- Javascript
- Npm
- Lodash
- Utils
---

## Lodash.js相关

[Lodash.js](https://www.lodashjs.com/)

:::tip Lodash.js
是一个一致性、模块化、高性能的 JavaScript 实用工具库
:::

### 下载

- [核心版](https://raw.githubusercontent.com/lodash/lodash/4.17.11-npm/core.js)
- [完整版](https://raw.githubusercontent.com/lodash/lodash/4.17.11-npm/lodash.min.js)
- [CND](https://www.jsdelivr.com/package/npm/lodash)

### 安装

#### 浏览器环境：

```html
<script src="lodash.js"></script>
```

#### 通过 npm：

```
$ npm i --save lodash
```

#### Node.js：

```js
// Load the full build.
var _ = require('lodash');
// Load the core build.
var _ = require('lodash/core');
// Load the FP build for immutable auto-curried iteratee-first data-last methods.
var fp = require('lodash/fp');
 
// Load method categories.
var array = require('lodash/array');
var object = require('lodash/fp/object');
 
// Cherry-pick methods for smaller browserify/rollup/webpack bundles.
var at = require('lodash/at');
var curryN = require('lodash/fp/curryN');
```

:::warning 注意：
如需在 Node.js < 6 的 REPL 环境中使用 Lodash，请安装 [n_](https://www.npmjs.com/package/n_)。
:::

### 补充工具

[futil-js](https://github.com/smartprocure/futil-js)是一套用来补足 lodash 的实用工具集。

## Lodash.js API

### `_.chain(value)`

#### 作用

创建一个lodash包装实例，包装value以启用显式链模式。要解除链必须使用 _#value 方法。

#### 参数

<font color='#c7254e'>value (*)</font>: 要包装的值。

#### 返回

<font color='#c7254e'>(Object)</font>: 返回 lodash 包装的实例。

#### 例子

```js
var users = [
  { 'user': 'barney',  'age': 36 },
  { 'user': 'fred',    'age': 40 },
  { 'user': 'pebbles', 'age': 1 }
];
 
var youngest = _
  .chain(users)
  .sortBy('age')
  .map(function(o) {
    return o.user + ' is ' + o.age;
  })
  .head()
  .value();
// => 'pebbles is 1'
```

### `_.chunk(array, [size=1])`

#### 作用

将数组（array）拆分成多个 size 长度的区块，并将这些区块组成一个新数组。 如果array 无法被分割成全部等长的区块，那么最后剩余的元素将组成一个区块。

#### 参数

<font color='#c7254e'>array (Array)</font>: 需要处理的数组

<font color='#c7254e'>[size=1] (number)</font>: 每个数组区块的长度

#### 返回

<font color='#c7254e'>(Array)</font>: 返回一个包含拆分区块的新数组（相当于一个二维数组）。

#### 例子

```js
_.chunk(['a', 'b', 'c', 'd'], 2);
// => [['a', 'b'], ['c', 'd']]
 
_.chunk(['a', 'b', 'c', 'd'], 3);
// => [['a', 'b', 'c'], ['d']]
```

### `_.concat(array, [values])`

#### 作用

创建一个新数组，将array与任何数组 或 值连接在一起。

#### 参数

<font color='#c7254e'>array (Array)</font>: 被连接的数组。

<font color='#c7254e'>[values] (...*)</font>: 连接的值。

#### 返回

<font color='#c7254e'>(Array)</font>: 返回连接后的新数组。

#### 例子

```js
var array = [1];
var other = _.concat(array, 2, [3], [[4]]);
 
console.log(other);
// => [1, 2, 3, [4]]
 
console.log(array);
// => [1]
```

### `_.difference(array, [values])`

#### 作用

创建一个具有唯一array值的数组，每个值不包含在其他给定的数组中。（即创建一个新数组，这个数组中的值，为第一个数字（array 参数）排除了给定数组中的值。）该方法使用 [SameValueZero](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)做相等比较。结果值的顺序是由第一个数组中的顺序确定。

#### 参数

<font color='#c7254e'>array (Array)</font>: 要检查的数组。

<font color='#c7254e'>[values] (...Array)</font>: 排除的值。

#### 返回

<font color='#c7254e'>(Array)</font>: 返回一个过滤值后的新数组。

#### 例子

```js
_.difference([3, 2, 1], [4, 2]);
// => [3, 1]
```

### `_.drop(array, [n=1])`

#### 作用

创建一个切片数组，去除array前面的n个元素。（n默认值为1。）

#### 参数

<font color='#c7254e'>array (Array)</font>: 要查询的数组。

<font color='#c7254e'>[n=1] (number)</font>: 要去除的元素个数。

#### 返回

<font color='#c7254e'>(Array)</font>: 返回array剩余切片。

#### 例子

```js
_.drop([1, 2, 3]);
// => [2, 3]
 
_.drop([1, 2, 3], 2);
// => [3]
 
_.drop([1, 2, 3], 5);
// => []
 
_.drop([1, 2, 3], 0);
// => [1, 2, 3]
```

### `_.dropRight(array, [n=1])`

#### 作用

创建一个切片数组，去除array尾部的n个元素。（n默认值为1。）

#### 参数

<font color='#c7254e'>array (Array)</font>: 要查询的数组。

<font color='#c7254e'>[n=1] (number)</font>: 要去除的元素个数。

#### 返回

<font color='#c7254e'>(Array)</font>: 返回array剩余切片。

#### 例子

```js
_.dropRight([1, 2, 3]);
// => [1, 2]
 
_.dropRight([1, 2, 3], 2);
// => [1]
 
_.dropRight([1, 2, 3], 5);
// => []
 
_.dropRight([1, 2, 3], 0);
// => [1, 2, 3]
```

### `_.fill(array, value, [start=0], [end=array.length])`

#### 作用

使用 value 值来填充（替换） array，从start位置开始, 到end位置结束（但不包含end位置）。这个方法会改变 array（不是创建新数组）。

#### 参数

<font color='#c7254e'>array (Array)</font>: 要填充改变的数组。

<font color='#c7254e'>value (*)</font>: 填充给 array 的值。

<font color='#c7254e'>[start=0] (number)</font>: 开始位置（默认0）。

<font color='#c7254e'>[end=array.length] (number)</font>: 结束位置（默认array.length）。

#### 返回

<font color='#c7254e'>(Array)</font>: 返回 array。

#### 例子

```js
var array = [1, 2, 3];
 
_.fill(array, 'a');
console.log(array);
// => ['a', 'a', 'a']
 
_.fill(Array(3), 2);
// => [2, 2, 2]
 
_.fill([4, 6, 8, 10], '*', 1, 3);
// => [4, '*', '*', 10]
```

### `_.findIndex(array, [predicate=_.identity], [fromIndex=0])`

#### 作用

该方法类似 _.find，区别是该方法返回第一个通过 predicate 判断为真值的元素的索引值（index），而不是元素本身。

#### 参数

<font color='#c7254e'>array (Array)</font>: 要搜索的数组。

<font color='#c7254e'>[predicate=_.identity] (Array|Function|Object|string)</font>: 这个函数会在每一次迭代调用。

<font color='#c7254e'>[fromIndex=0] (number)</font>: The index to search from.

#### 返回

<font color='#c7254e'>(number)</font>: 返回找到元素的 索引值（index），否则返回 -1。

#### 例子

```js
var users = [
  { 'user': 'barney',  'active': false },
  { 'user': 'fred',    'active': false },
  { 'user': 'pebbles', 'active': true }
];
 
_.findIndex(users, function(o) { return o.user == 'barney'; });
// => 0
 
// The `_.matches` iteratee shorthand.
_.findIndex(users, { 'user': 'fred', 'active': false });
// => 1
 
// The `_.matchesProperty` iteratee shorthand.
_.findIndex(users, ['active', false]);
// => 0
 
// The `_.property` iteratee shorthand.
_.findIndex(users, 'active');
// => 2
```

### `_.fromPairs(pairs)`

#### 作用

这个方法返回一个由键值对pairs构成的对象。

#### 参数

<font color='#c7254e'>pairs (Array)</font>: 键值对pairs

#### 返回

返回一个新对象。

#### 例子

```js
_.fromPairs([['fred', 30], ['barney', 40]]);
// => { 'fred': 30, 'barney': 40 }
```

### `_.head(array)`

#### 作用

获取数组 array 的第一个元素。

#### 参数

<font color='#c7254e'>array (Array)</font>: 要查询的数组。

#### 返回

<font color='#c7254e'>(*)</font>: 返回数组 array的第一个元素。

#### 例子

```js
_.head([1, 2, 3]);
// => 1
 
_.head([]);
// => undefined
```

### `_.indexOf(array, value, [fromIndex=0])`

#### 作用

使用 SameValueZero 等值比较，返回首次 value 在数组array中被找到的 索引值， 如果 fromIndex 为负值，将从数组array尾端索引进行匹配。

#### 参数

<font color='#c7254e'>array (Array)</font>: 需要查找的数组。

<font color='#c7254e'>value (*)</font>: 需要查找的值。

<font color='#c7254e'>[fromIndex=0] (number)</font>: 开始查询的位置。

#### 返回

<font color='#c7254e'>(number)</font>: 返回 值value在数组中的索引位置, 没有找到为返回-1。

#### 例子

```js
_.indexOf([1, 2, 1, 2], 2);
// => 1
 
// Search from the `fromIndex`.
_.indexOf([1, 2, 1, 2], 2, 2);
// => 3
```

### `_.join(array, [separator=','])`

#### 作用

将 array 中的所有元素转换为由 separator 分隔的字符串。

#### 参数

<font color='#c7254e'>array (Array)</font>: 要转换的数组。

<font color='#c7254e'>[separator=','] (string)</font>: 分隔元素。

#### 返回

<font color='#c7254e'>(string)</font>: 返回连接字符串。

#### 例子

```js
_.join(['a', 'b', 'c'], '~');
// => 'a~b~c'
```

### `_.remove(array, [predicate=_.identity])`

#### 作用

除数组中predicate（断言）返回为真值的所有元素，并返回移除元素组成的数组。predicate（断言） 会传入3个参数： (value, index, array)。

#### 参数

<font color='#c7254e'>array (Array)</font>: 要修改的数组。

<font color='#c7254e'>[predicate=_.identity] (Array|Function|Object|string)</font>: 每次迭代调用的函数。

#### 返回

<font color='#c7254e'>(Array)</font>: 返回移除元素组成的新数组。

#### 例子

```js
var array = [1, 2, 3, 4];
var evens = _.remove(array, function(n) {
  return n % 2 == 0;
});
 
console.log(array);
// => [1, 3]
 
console.log(evens);
// => [2, 4]
```

### `_.uniq(array)`

#### 作用

创建一个去重后的array数组副本。使用了 SameValueZero 做等值比较。只有第一次出现的元素才会被保留。

#### 参数

<font color='#c7254e'>array (Array)</font>: 要检查的数组。

#### 返回

<font color='#c7254e'>(Array)</font>: 返回新的去重后的数组。

#### 例子

```js
_.uniq([2, 1, 2]);
// => [2, 1]
```

### `_.unzip(array)`

#### 作用

这个方法类似于 _.zip，除了它接收分组元素的数组，并且创建一个数组，分组元素到打包前的结构。（返回数组的第一个元素包含所有的输入数组的第一元素，第一个元素包含了所有的输入数组的第二元素，依此类推。）

#### 参数

<font color='#c7254e'>array (Array)</font>: 要处理的分组元素数组。

#### 返回

<font color='#c7254e'>(Array)</font>: 返回重组元素的新数组。

#### 例子

```js
var zipped = _.zip(['fred', 'barney'], [30, 40], [true, false]);
// => [['fred', 30, true], ['barney', 40, false]]
 
_.unzip(zipped);
// => [['fred', 'barney'], [30, 40], [true, false]]
```

### `_.every(collection, [predicate=_.identity])`

#### 作用

这个方法类似于 _.zip，除了它接收分组元素的数组，并且创建一个数组，分组元素到打包前的结构。（返回数组的第一个元素包含所有的输入数组的第一元素，第一个元素包含了所有的输入数组的第二元素，依此类推。）,这个方法对于对于 空集合返回 true，因为空集合的 任何元素都是 true 。

#### 参数

<font color='#c7254e'>collection (Array|Object)</font>: 一个用来迭代的集合。

<font color='#c7254e'>[predicate=_.identity] (Array|Function|Object|string)</font>: 每次迭代调用的函数。

#### 返回

<font color='#c7254e'>(boolean)</font>: 如果所有元素经 predicate（断言函数） 检查后都都返回真值，那么就返回true，否则返回 false 。

#### 例子

```js
_.every([true, 1, null, 'yes'], Boolean);
// => false
 
var users = [
  { 'user': 'barney', 'age': 36, 'active': false },
  { 'user': 'fred',   'age': 40, 'active': false }
];
 
// The `_.matches` iteratee shorthand.
_.every(users, { 'user': 'barney', 'active': false });
// => false
 
// The `_.matchesProperty` iteratee shorthand.
_.every(users, ['active', false]);
// => true
 
// The `_.property` iteratee shorthand.
_.every(users, 'active');
// => false
```

### `_.filter(collection, [predicate=_.identity])`

#### 作用

遍历 collection（集合）元素，返回 predicate（断言函数）返回真值 的所有元素的数组。 predicate（断言函数）调用三个参数：(value, index|key, collection)。

#### 参数

<font color='#c7254e'>collection (Array|Object)</font>: 一个用来迭代的集合。

<font color='#c7254e'>[predicate=_.identity] (Array|Function|Object|string)</font>: 每次迭代调用的函数。

#### 返回

<font color='#c7254e'>(Array)</font>: 返回一个新的过滤后的数组。

#### 例子

```js
var users = [
  { 'user': 'barney', 'age': 36, 'active': true },
  { 'user': 'fred',   'age': 40, 'active': false }
];
 
_.filter(users, function(o) { return !o.active; });
// => objects for ['fred']
 
// The `_.matches` iteratee shorthand.
_.filter(users, { 'age': 36, 'active': true });
// => objects for ['barney']
 
// The `_.matchesProperty` iteratee shorthand.
_.filter(users, ['active', false]);
// => objects for ['fred']
 
// The `_.property` iteratee shorthand.
_.filter(users, 'active');
// => objects for ['barney']
```

### `_.find(collection, [predicate=_.identity], [fromIndex=0])`

#### 作用

遍历 collection（集合）元素，返回 predicate（断言函数）第一个返回真值的第一个元素。predicate（断言函数）调用3个参数： (value, index|key, collection)。

#### 参数

<font color='#c7254e'>collection (Array|Object)</font>: 一个用来迭代的集合。

<font color='#c7254e'>[predicate=_.identity] (Array|Function|Object|string)</font>: 每次迭代调用的函数。

<font color='#c7254e'>[fromIndex=0] (number)</font>: 开始搜索的索引位置。

#### 返回

<font color='#c7254e'>(*)</font>: 返回匹配元素，否则返回 undefined。

#### 例子

```js
var users = [
  { 'user': 'barney',  'age': 36, 'active': true },
  { 'user': 'fred',    'age': 40, 'active': false },
  { 'user': 'pebbles', 'age': 1,  'active': true }
];
 
_.find(users, function(o) { return o.age < 40; });
// => object for 'barney'
 
// The `_.matches` iteratee shorthand.
_.find(users, { 'age': 1, 'active': true });
// => object for 'pebbles'
 
// The `_.matchesProperty` iteratee shorthand.
_.find(users, ['active', false]);
// => object for 'fred'
 
// The `_.property` iteratee shorthand.
_.find(users, 'active');
// => object for 'barney'
```

### `_.orderBy(collection, [iteratees=[_.identity]], [orders])`

#### 作用

此方法类似于 _.sortBy，除了它允许指定 iteratee（迭代函数）结果如何排序。 如果没指定 orders（排序），所有值以升序排序。 否则，指定为"desc" 降序，或者指定为 "asc" 升序，排序对应值。

#### 参数

<font color='#c7254e'>collection (Array|Object)</font>: 用来迭代的集合。

<font color='#c7254e'>[iteratees=_.identity] (Array|Function|Object|string)</font>: 排序的迭代函数。

<font color='#c7254e'>[orders] (string[]): iteratees</font>: 迭代函数的排序顺序。

#### 返回

<font color='#c7254e'>(Array)</font>: 排序排序后的新数组。

#### 例子

```js
var users = [
  { 'user': 'fred',   'age': 48 },
  { 'user': 'barney', 'age': 34 },
  { 'user': 'fred',   'age': 40 },
  { 'user': 'barney', 'age': 36 }
];
 
// 以 `user` 升序排序 再  `age` 以降序排序。
_.orderBy(users, ['user', 'age'], ['asc', 'desc']);
// => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 40]]
```

### `_.partition(collection, [predicate=_.identity])`

#### 作用

创建一个分成两组的元素数组，第一组包含predicate（断言函数）返回为 truthy（真值）的元素，第二组包含predicate（断言函数）返回为 falsey（假值）的元素。predicate 调用1个参数：(value)。

#### 参数

<font color='#c7254e'>collection (Array|Object)</font>: 用来迭代的集合。

<font color='#c7254e'>[predicate=_.identity] (Array|Function|Object|string)</font>: 每次迭代调用的函数。

#### 返回

<font color='#c7254e'>(Array)</font>: 返回元素分组后的数组。

#### 例子

```js
var users = [
  { 'user': 'barney',  'age': 36, 'active': false },
  { 'user': 'fred',    'age': 40, 'active': true },
  { 'user': 'pebbles', 'age': 1,  'active': false }
];
 
_.partition(users, function(o) { return o.active; });
// => objects for [['fred'], ['barney', 'pebbles']]
 
// The `_.matches` iteratee shorthand.
_.partition(users, { 'age': 1, 'active': false });
// => objects for [['pebbles'], ['barney', 'fred']]
 
// The `_.matchesProperty` iteratee shorthand.
_.partition(users, ['active', false]);
// => objects for [['barney', 'pebbles'], ['fred']]
 
// The `_.property` iteratee shorthand.
_.partition(users, 'active');
// => objects for [['fred'], ['barney', 'pebbles']]
```

### `_.sample(collection)`

#### 作用

从collection（集合）中获得一个随机元素。

#### 参数

<font color='#c7254e'>collection (Array|Object)</font>: 要取样的集合。

#### 返回

<font color='#c7254e'>(*)</font>: 返回随机元素。

#### 例子

```js
_.sample([1, 2, 3, 4]);
// => 2
```

### `_.sampleSize(collection, [n=1])`

#### 作用

从collection（集合）中获得 n 个随机元素。

#### 参数

<font color='#c7254e'>collection (Array|Object)</font>: 要取样的集合。

<font color='#c7254e'>[n=1] (number)</font>: 取样的元素个数。

#### 返回

<font color='#c7254e'>(Array)</font>: 返回随机元素。

#### 例子

```js
_.sampleSize([1, 2, 3], 2);
// => [3, 1]
 
_.sampleSize([1, 2, 3], 4);
// => [2, 3, 1]
```

### `_.shuffle(collection)`

#### 作用

创建一个被打乱值的集合。 使用 Fisher-Yates shuffle 版本。

#### 参数

<font color='#c7254e'>collection (Array|Object)</font>: 要打乱的集合。

#### 返回

<font color='#c7254e'>(Array)</font>: 返回打乱的新数组。

#### 例子

```js
_.shuffle([1, 2, 3, 4]);
// => [4, 1, 3, 2]
```

### `_.size(collection)`

#### 作用

返回collection（集合）的长度，如果集合是类数组或字符串，返回其 length ；如果集合是对象，返回其可枚举属性的个数。

#### 参数

<font color='#c7254e'>collection (Array|Object)</font>: 要检查的集合

#### 返回

<font color='#c7254e'>(number)</font>: 返回集合的长度。

#### 例子

```js
_.size([1, 2, 3]);
// => 3
 
_.size({ 'a': 1, 'b': 2 });
// => 2
 
_.size('pebbles');
// => 7
```

### `_.sortBy(collection, [iteratees=[_.identity]])`

#### 作用

创建一个元素数组。 以 iteratee 处理的结果升序排序。 这个方法执行稳定排序，也就是说相同元素会保持原始排序。 iteratees 调用1个参数： (value)。

#### 参数

<font color='#c7254e'>collection (Array|Object)</font>用来迭代的集合。

<font color='#c7254e'>[iteratees=[_.identity]] (...(Array|Array[]|Function|Function[]|Object|Object[]|string|string[]))</font>这个函数决定排序。

#### 返回

<font color='#c7254e'>(Array)</font>: 返回排序后的数组。

#### 例子

```js
var users = [
  { 'user': 'fred',   'age': 48 },
  { 'user': 'barney', 'age': 36 },
  { 'user': 'fred',   'age': 40 },
  { 'user': 'barney', 'age': 34 }
];
 
_.sortBy(users, function(o) { return o.user; });
// => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 40]]
 
_.sortBy(users, ['user', 'age']);
// => objects for [['barney', 34], ['barney', 36], ['fred', 40], ['fred', 48]]
 
_.sortBy(users, 'user', function(o) {
  return Math.floor(o.age / 10);
});
// => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 40]]
```

### `_.now()`

#### 作用

获得 Unix 纪元 (1 January 1970 00:00:00 UTC) 直到现在的毫秒数。

#### 参数

无

#### 返回

<font color='#c7254e'>(number)</font>: 返回时间戳。

#### 例子

```js
_.defer(function(stamp) {
  console.log(_.now() - stamp);
}, _.now());
// => 记录延迟函数调用的毫秒数
```

### `_.debounce(func, [wait=0], [options={}])`

#### 作用

创建一个 debounced（防抖动）函数，该函数会从上一次被调用后，延迟 wait 毫秒后调用 func 方法。 debounced（防抖动）函数提供一个 cancel 方法取消延迟的函数调用以及 flush 方法立即调用。 可以提供一个 options（选项） 对象决定如何调用 func 方法，options.leading 与|或 options.trailing 决定延迟前后如何触发（是 先调用后等待 还是 先等待后调用）。 func 调用时会传入最后一次提供给 debounced（防抖动）函数 的参数。 后续调用的 debounced（防抖动）函数返回是最后一次 func 调用的结果。

如果 leading 和 trailing 选项为 true, 则 func 允许 trailing 方式调用的条件为: 在 wait 期间多次调用防抖方法。

如果 wait 为 0 并且 leading 为 false, func调用将被推迟到下一个点，类似setTimeout为0的超时

#### 参数

<font color='#c7254e'>func (Function)</font>: 要防抖动的函数。

<font color='#c7254e'>[wait=0] (number)</font>: 需要延迟的毫秒数。

<font color='#c7254e'>[options={}] (Object)</font>: 选项对象。

<font color='#c7254e'>[options.leading=false] (boolean)</font>: 指定在延迟开始前调用。

<font color='#c7254e'>[options.maxWait] (number)</font>: 设置 func 允许被延迟的最大值

<font color='#c7254e'>[options.trailing=true] (boolean)</font>: 指定在延迟结束后调用。

#### 返回

<font color='#c7254e'>(Function)</font>: 返回新的 debounced（防抖动）函数。

#### 例子

```js
// 避免窗口在变动时出现昂贵的计算开销。
jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 
// 当点击时 `sendMail` 随后就被调用。
jQuery(element).on('click', _.debounce(sendMail, 300, {
  'leading': true,
  'trailing': false
}));
 
// 确保 `batchLog` 调用1次之后，1秒内会被触发。
var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
var source = new EventSource('/stream');
jQuery(source).on('message', debounced);
 
// 取消一个 trailing 的防抖动调用
jQuery(window).on('popstate', debounced.cancel);
```

### `_.throttle(func, [wait=0], [options={}])`

#### 作用

创建一个节流函数，在 wait 秒内最多执行 func 一次的函数。 该函数提供一个 cancel 方法取消延迟的函数调用以及 flush 方法立即调用。 可以提供一个 options 对象决定如何调用 func 方法， options.leading 与|或 options.trailing 决定 wait 前后如何触发。 func 会传入最后一次传入的参数给这个函数。 随后调用的函数返回是最后一次 func 调用的结果。

如果 leading 和 trailing 都设定为 true 则 func 允许 trailing 方式调用的条件为: 在 wait 期间多次调用。

如果 wait 为 0 并且 leading 为 false, func调用将被推迟到下一个点，类似setTimeout为0的超时。

#### 参数

<font color='#c7254e'>func (Function)</font>: 要节流的函数。

<font color='#c7254e'>[wait=0] (number)</font>: 需要节流的毫秒。

<font color='#c7254e'>[options={}] (Object)</font>: 选项对象。

<font color='#c7254e'>[options.leading=false] (boolean)</font>: 指定调用在节流开始前。

<font color='#c7254e'>[options.maxWait] (number)</font>: 设置 func 允许被延迟的最大值

<font color='#c7254e'>[options.trailing=true] (boolean)</font>: 指定在延迟结束后调用。

#### 返回

<font color='#c7254e'>(Function)</font>: 返回新的 debounced（防抖动）函数。

#### 例子

```js
// 避免窗口在变动时出现昂贵的计算开销。
jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 
// 当点击时 `sendMail` 随后就被调用。
jQuery(element).on('click', _.debounce(sendMail, 300, {
  'leading': true,
  'trailing': false
}));
 
// 确保 `batchLog` 调用1次之后，1秒内会被触发。
var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
var source = new EventSource('/stream');
jQuery(source).on('message', debounced);
 
// 取消一个 trailing 的防抖动调用
jQuery(window).on('popstate', debounced.cancel);
```

### `_.clone(value)`

#### 作用

创建一个 value 的浅拷贝。

这个方法参考自 structured clone algorithm 以及支持 arrays、array buffers、 booleans、 date objects、maps、 numbers， Object 对象, regexes, sets, strings, symbols, 以及 typed arrays。 arguments对象的可枚举属性会拷贝为普通对象。 一些不可拷贝的对象，例如error objects、functions, DOM nodes, 以及 WeakMaps 会返回空对象。

#### 参数

<font color='#c7254e'>value(*)</font>: 要拷贝的值

#### 返回

<font color='#c7254e'>(*)</font>: 返回拷贝后的值。

#### 例子

```js
var objects = [{ 'a': 1 }, { 'b': 2 }];
 
var shallow = _.clone(objects);
console.log(shallow[0] === objects[0]);
// => true
```

### `_.cloneDeep(value)`

#### 作用

这个方法类似 _.clone，除了它会递归拷贝 value。（也叫深拷贝）。

#### 参数

<font color='#c7254e'>value(*)</font>: 要深拷贝的值。

#### 返回

<font color='#c7254e'>(*)</font>: 返回拷贝后的值。

#### 例子

```js
var objects = [{ 'a': 1 }, { 'b': 2 }];
 
var deep = _.cloneDeep(objects);
console.log(deep[0] === objects[0]);
// => false
```

### `_.cloneDeepWith(value, [customizer])`

#### 作用

这个方法类似 _.cloneWith，除了它会递归克隆 value。

#### 参数

<font color='#c7254e'>value(*)</font>: 用来递归克隆的值。

<font color='#c7254e'>[customizer] (Function)</font>: 用来自定义克隆的函数。

#### 返回

<font color='#c7254e'>(*)</font>: 返回深度克隆后的值。

#### 例子

```js
function customizer(value) {
  if (_.isElement(value)) {
    return value.cloneNode(true);
  }
}
 
var el = _.cloneDeepWith(document.body, customizer);
 
console.log(el === document.body);
// => false
console.log(el.nodeName);
// => 'BODY'
console.log(el.childNodes.length);
// => 20
```

### `_.isArray(value)`

#### 作用

检查 value 是否是 Array 类对象。

#### 参数

<font color='#c7254e'>value(*)</font>: 要检查的值。

#### 返回

<font color='#c7254e'>(boolean)</font>: 如果value是一个数组返回 true，否则返回 false。

#### 例子

```js
_.isArray([1, 2, 3]);
// => true
 
_.isArray(document.body.children);
// => false
 
_.isArray('abc');
// => false
 
_.isArray(_.noop);
// => false
```

### `_.isEmpty(value)`

#### 作用

检查 value 是否为一个空对象，集合，映射或者set。 判断的依据是除非是有枚举属性的对象，length 大于 0 的 arguments object, array, string 或类jquery选择器。

对象如果被认为为空，那么他们没有自己的可枚举属性的对象。

类数组值，比如 arguments对象，array，buffer，string或者类jQuery集合的length 为 0，被认为是空。类似的，map（映射）和set 的size 为 0，被认为是空。

#### 参数

<font color='#c7254e'>value(*)</font>: 要检查的值。

#### 返回

<font color='#c7254e'>(boolean)</font>: 如果 value 为空，那么返回 true，否则返回 false。

#### 例子

```js
_.isEmpty(null);
// => true
 
_.isEmpty(true);
// => true
 
_.isEmpty(1);
// => true
 
_.isEmpty([1, 2, 3]);
// => false
 
_.isEmpty({ 'a': 1 });
// => false
```

### `_.isEqual(value, other)`

#### 作用

执行深比较来确定两者的值是否相等。

**注意: **这个方法支持比较 arrays, array buffers, booleans, date objects, error objects, maps, numbers, Object objects, regexes, sets, strings, symbols, 以及 typed arrays. Object 对象值比较自身的属性，不包括继承的和可枚举的属性。 不支持函数和DOM节点比较。

#### 参数

<font color='#c7254e'>value(*)</font>: 用来比较的值。

<font color='#c7254e'>other(*)</font>: 另一个用来比较的值。

#### 返回

<font color='#c7254e'>(boolean)</font>: 如果 两个值完全相同，那么返回 true，否则返回 false。

#### 例子

```js
var object = { 'a': 1 };
var other = { 'a': 1 };
 
_.isEqual(object, other);
// => true
 
object === other;
// => false
```

### `_.isObject(value)`

#### 作用

检查 value 是否为 Object 的 language type。 (例如： arrays, functions, objects, regexes,new Number(0), 以及 new String(''))

#### 参数

<font color='#c7254e'>value(*)</font>: 要检查的值。

#### 返回

<font color='#c7254e'>(boolean)</font>: 如果 value 为一个对象，那么返回 true，否则返回 false。

#### 例子

```js
_.isObject({});
// => true
 
_.isObject([1, 2, 3]);
// => true
 
_.isObject(_.noop);
// => true
 
_.isObject(null);
// => false
```

### `_.toArray(value)`

#### 作用

转换 value 为一个数组。

#### 参数

<font color='#c7254e'>value(*)</font>: 要转换的值。

#### 返回

<font color='#c7254e'>(Array)</font>: 返回转换后的数组。

#### 例子

```js
_.toArray({ 'a': 1, 'b': 2 });
// => [1, 2]
 
_.toArray('abc');
// => ['a', 'b', 'c']
 
_.toArray(1);
// => []
 
_.toArray(null);
// => []
```

### `_.toNumber(value)`

#### 作用

转换 value 为一个数字。

#### 参数

<font color='#c7254e'>value(*)</font>: 要处理的值。

#### 返回

<font color='#c7254e'>(number)</font>: 返回数字。

#### 例子

```js
_.toNumber(3.2);
// => 3.2
 
_.toNumber(Number.MIN_VALUE);
// => 5e-324
 
_.toNumber(Infinity);
// => Infinity
 
_.toNumber('3.2');
// => 3.2
```

### `_.findKey(object, [predicate=_.identity])`

#### 作用

这个方法类似 _.find 。 除了它返回最先被 predicate 判断为真值的元素 key，而不是元素本身。

#### 参数

<font color='#c7254e'>object (Object)</font>: 需要检索的对象。

<font color='#c7254e'>[predicate=_.identity] (Function)</font>: 每次迭代时调用的函数。

#### 返回

<font color='#c7254e'>(*)</font>: 返回匹配的 key，否则返回 undefined。

#### 例子

```js
var users = {
  'barney':  { 'age': 36, 'active': true },
  'fred':    { 'age': 40, 'active': false },
  'pebbles': { 'age': 1,  'active': true }
};
 
_.findKey(users, function(o) { return o.age < 40; });
// => 'barney' (iteration order is not guaranteed)
 
// The `_.matches` iteratee shorthand.
_.findKey(users, { 'age': 1, 'active': true });
// => 'pebbles'
 
// The `_.matchesProperty` iteratee shorthand.
_.findKey(users, ['active', false]);
// => 'fred'
 
// The `_.property` iteratee shorthand.
_.findKey(users, 'active');
// => 'barney'
```

### `_.pick(object, [props])`

#### 作用

这个方法类似 _.find 。 除了它返回最先被 predicate 判断为真值的元素 key，而不是元素本身。

#### 参数

<font color='#c7254e'>object (Object)</font>: 来源对象。

<font color='#c7254e'>[props] (...(string|string[]))</font>: 要被忽略的属性。（单独指定或指定在数组中。）

#### 返回

<font color='#c7254e'>(Object)</font>: 返回新对象。

#### 例子

```js
var object = { 'a': 1, 'b': '2', 'c': 3 };
 
_.pick(object, ['a', 'c']);
// => { 'a': 1, 'c': 3 }
```

### `_.pickBy(object, [predicate=_.identity])`

#### 作用

创建一个对象，这个对象组成为从 object 中经 predicate 判断为真值的属性。 predicate调用2个参数：(value, key)。

#### 参数

<font color='#c7254e'>object (Object)</font>: 来源对象。

<font color='#c7254e'>[predicate=_.identity] (Function)</font>: 调用每一个属性的函数。

#### 返回

<font color='#c7254e'>(Object)</font>: 返回新对象。

#### 例子

```js
var object = { 'a': 1, 'b': '2', 'c': 3 };
 
_.pickBy(object, _.isNumber);
// => { 'a': 1, 'c': 3 }
```

### `_.attempt(func, [args])`

#### 作用

尝试调用func，返回结果 或者 捕捉错误对象。任何附加的参数都会在调用时传给func。

#### 参数

<font color='#c7254e'>func (Function)</font>: 要尝试调用的函数。

<font color='#c7254e'>[args] (...*)</font>: 调用func时，传递的参数。

#### 返回

<font color='#c7254e'>(*)</font>: 返回func结果或者错误对象。

#### 例子

```js
// Avoid throwing errors for invalid selectors.
var elements = _.attempt(function(selector) {
  return document.querySelectorAll(selector);
}, '>_>');
 
if (_.isError(elements)) {
  elements = [];
}
```

### `_.flow([funcs])`

#### 作用

创建一个函数。 返回的结果是调用提供函数的结果，this 会绑定到创建函数。 每一个连续调用，传入的参数都是前一个函数返回的结果。

#### 参数

<font color='#c7254e'>[funcs] (...(Function|Function[]))</font>: 要调用的函数。

#### 返回

<font color='#c7254e'>(Function)</font>: 返回新的函数。

#### 例子

```js
function square(n) {
  return n * n;
}
 
var addSquare = _.flow([_.add, square]);
addSquare(1, 2);
// => 9
```


