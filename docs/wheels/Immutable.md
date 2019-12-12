---
title: Immutable.js
date: 2019-12-03
categories: article
author: Kamchan
tags:
  - Javascript
  - Npm
  - Immutable
  - Utils
---

## Immutable 是什么？

关于 Immutable 的定义，官方文档是这样说的：

:::tip
Immutable data encourages pure functions (data-in, data-out) and lends itself to much simpler

application development and enabling techniques from functional programming such as lazy evaluation.
:::

简而言之，Immutable 数据就是一旦创建，就不能更改的数据。每当对 Immutable 对象进行修改的时候，就会返回一个新的 Immutable 对象，以此来保证数据的不可变。对于 Immutable 的好处及介绍，可以参考[Immutable 详解及 React 中实践](https://github.com/camsong/blog/issues/3)，这篇文章介绍的很清楚。

因为 Immutable 的官方文档有点晦涩难懂，本文只是用来整理 Immutable 常用的 API 的使用，便于使用与查询，想了解更详细的内容，[请戳这里~](https://immutable-js.github.io/immutable-js/)

## Immutable 的几种数据类型

- <font color='#c7254e'>List</font>: 有序索引集，类似 JavaScript 中的 Array。
- <font color='#c7254e'>Map</font>: 无序索引集，类似 JavaScript 中的 Object。
- <font color='#c7254e'>OrderedMap</font>: 有序的 Map，根据数据的 set()进行排序。
- <font color='#c7254e'>Set</font>: 没有重复值的集合。
- <font color='#c7254e'>OrderedSet</font>: 有序的 Set，根据数据的 add 进行排序。
- <font color='#c7254e'>Stack</font>: 有序集合，支持使用 unshift（）和 shift（）添加和删除。
- <font color='#c7254e'>Range()</font>: 返回一个 Seq.Indexed 类型的集合，这个方法有三个参数，start 表示开始值，默认值为 0，end 表示结束值，默认为无穷大，step 代表每次增大的数值，默认为 1.如果 start = end,则返回空集合。
- <font color='#c7254e'>Repeat()</font>: 返回一个 vSeq.Indexe 类型的集合，这个方法有两个参数，value 代表需要重复的值，times 代表要重复的次数，默认为无穷大。
- <font color='#c7254e'>Record</font>: 一个用于生成 Record 实例的类。类似于 JavaScript 的 Object，但是只接收特定字符串为 key，具有默认值。
- <font color='#c7254e'>Seq</font>: 序列，但是可能不能由具体的数据结构支持。
- <font color='#c7254e'>Collection</font>: 是构建所有数据结构的基类，不可以直接构建。

用的最多就是 List 和 Map，所以在这里主要介绍这两种数据类型的 API。

## API 的使用

### fromJS()

#### 作用：

将一个 js 数据转换为 Immutable 类型的数据。

#### 用法

<font color='#c7254e'>fromJS(value, converter)</font>

#### 简介：

value 是要转变的数据，converter 是要做的操作。第二个参数可不填，默认情况会将数组准换为 List 类型，将对象转换为 Map 类型，其余不做操作。

#### 代码实现：

```js
const obj = Immutable.fromJS({a:'123',b:'234'},function (key, value, path) {
  console.log(key, value, path)
  return isIndexed(value) ? value.toList() : value.toOrderedMap())
})
```

### toJS()

#### 作用：

将一个Immutable数据转换为JS类型的数据。

#### 用法

<font color='#c7254e'>value.toJS()</font>

#### 简介：

#### 代码实现：

### is()

#### 作用：

对两个对象进行比较。

#### 用法

<font color='#c7254e'>is(map1,map2)</font>

#### 简介：

和js中对象的比较不同，在js中比较两个对象比较的是地址，但是在Immutable中比较的是这个对象hashCode和valueOf，只要两个对象的hashCode相等，值就是相同的，避免了深度遍历，提高了性能。

#### 代码实现：

```js
import { Map, is } from 'immutable'
const map1 = Map({ a: 1, b: 1, c: 1 })
const map2 = Map({ a: 1, b: 1, c: 1 })
map1 === map2   //false
Object.is(map1, map2) // false
is(map1, map2) // true
```

### List 和 Map

#### 创建

List() 和 Map()

#### 作用：

用来创建一个新的List/Map对象

#### 用法

```js
//List

List(): List<any>
List<T>(): List<T>

//Map

Map(): Map<any>
Map<T>(): Map<T>
```

### List.of() 和 Map.of()

:::tip
List.of() 和 Map.of()
:::

#### 作用：

创建一个新的包含value的List/Map对象

#### 用法

```js
List.of<T>(...values: Array<T>): List<T>

Map.of<T>(...values: Object<T>): Map<T>
```

### List.isList() 和 Map.isMap()

#### 作用：

判断一个数据结构是不是List/Map类型

#### 用法

```js
List.isList(maybeList: any): boolean

Map.isMap(maybeMap: any): boolean
```

### size

#### 作用：

获取List/Map的长度

### get()和getIn()

#### 作用：

获取数据结构中的数据

### has()和hasIn()

#### 作用：

判断是否存在某一个key

#### 用法：

```js
Immutable.fromJS([1,2,3,{a:4,b:5}]).has('0'); //true
Immutable.fromJS([1,2,3,{a:4,b:5}]).has('0'); //true
Immutable.fromJS([1,2,3,{a:4,b:5}]).hasIn([3,'b']) //true
```

### includes()

#### 作用：

判断是否存在某一个key

#### 用法：

```js
Immutable.fromJS([1,2,3,{a:4,b:5}]).has('0'); //true
Immutable.fromJS([1,2,3,{a:4,b:5}]).has('0'); //true
Immutable.fromJS([1,2,3,{a:4,b:5}]).hasIn([3,'b']) //true
```

### first()和last()

#### 作用：

用来获取第一个元素或者最后一个元素，若没有则返回undefined

#### 用法：

```js
Immutable.fromJS([1,2,3,{a:4,b:5}]).first()//1
Immutable.fromJS([1,2,3,{a:4,b:5}]).last()//{a:4,b:5}

Immutable.fromJS({a:1,b:2,c:{d:3,e:4}}).first() //1
Immutable.fromJS({a:1,b:2,c:{d:3,e:4}}).first() //{d:3,e:4}
```

### 数据修改

:::tip 注：
这里对于数据的修改，是对原数据进行操作后的值赋值给一个新的数据，并不会对原数据进行修改，因为Immutable是不可变的数据类型。
:::

### 设置 set()

#### 作用：

设置第一层key、index的值

#### 用法：

```js
set(index: number, value: T): List<T>
set(key: K, value: V): this
```

List在使用的时候，将index为number值设置为value。Map在使用的时候，将key的值设置为value。

在List中使用时，若传入的number为负数，则将index为size+index的值设置为value，例，若传入-1，则将size-1的值设为value。若传入的number的值超过了List的长度，则将List自动补全为传入的number的值，将number设置为value，其余用undefined补全。注：跟js中不同，List中不存在空位，[,,,],List中若没有值，则为undefined。

#### 代码实现

```js
//////List
const originalList = List([ 0 ]);
// List [ 0 ]
originalList.set(1, 1);
// List [ 0, 1 ]
originalList.set(0, 'overwritten');
// List [ "overwritten" ]
originalList.set(2, 2);
// List [ 0, undefined, 2 ]

List().set(50000, 'value').size;
// 50001

//////Map
const { Map } = require('immutable')
const originalMap = Map()
const newerMap = originalMap.set('key', 'value')
const newestMap = newerMap.set('key', 'newer value')

originalMap
// Map {}
newerMap
// Map { "key": "value" }
newestMap
// Map { "key": "newer value" }
```

### setIn()

#### 作用：

设置深层结构中某属性的值

#### 用法：

```js
setIn(keyPath: Iterable<any>, value: any): this
```

### 删除 delete

#### 作用：

用法与set()一样，只是第一个参数是一个数组，代表要设置的属性所在的位置

用来删除第一层结构中的属性

#### 用法：

```js
// List
List([ 0, 1, 2, 3, 4 ]).delete(0);
// List [ 1, 2, 3, 4 ]

// Map
const originalMap = Map({
  key: 'value',
  otherKey: 'other value'
})
// Map { "key": "value", "otherKey": "other value" }
originalMap.delete('otherKey')
// Map { "key": "value" }
```

### 更新 update()

#### 作用：

对对象中的某个属性进行更新，可对原数据进行相关操作

#### 用法：

```js
////List
const list = List([ 'a', 'b', 'c' ])
const result = list.update(2, val => val.toUpperCase())

///Map
const aMap = Map({ key: 'value' })
const newMap = aMap.update('key', value => value + value)
```

### 清除 clear()

#### 作用：

清除所有数据

#### 用法：

```js
Map({ key: 'value' }).clear()  //Map
List([ 1, 2, 3, 4 ]).clear()   // List
//List中的各种删除与插入
//List对应的数据结构是js中的数组，所以数组的一些方法在Immutable中也是通用的，比如push，pop,shift，
//unshift，insert。
```

### push() pop() unshift() shift() insert()

#### 作用：

push()
在List末尾插入一个元素

pop()
在List末尾删除一个元素

unshift
在List首部插入一个元素

shift
在List首部删除一个元素

insert
在List的index处插入元素

#### 用法：

```js
List([ 0, 1, 2, 3, 4 ]).insert(6, 5) 
//List [ 0, 1, 2, 3, 4, 5 ]
List([ 1, 2, 3, 4 ]).push(5)
// List [ 1, 2, 3, 4, 5 ]
List([ 1, 2, 3, 4 ]).pop()
// List[ 1, 2, 3 ]
List([ 2, 3, 4]).unshift(1);
// List [ 1, 2, 3, 4 ]
List([ 0, 1, 2, 3, 4 ]).shift();
// List [ 1, 2, 3, 4 ]
```

List中还有一个特有的方法用法设置List的长度，setSize()

```js
List([]).setSize(2).toJS() //[undefined,undefined]
```

### merge mergrWith mergeIn mergeDeep mergeDeepIn mergrDeepWith

#### 作用：

merge
作用：浅合并，新数据与旧数据对比，旧数据中不存在的属性直接添加，就数据中已存在的属性用新数据中的覆盖

mergrWith
作用：自定义浅合并，可自行设置某些属性的值

mergeIn
作用：对深层数据进行浅合并

mergeDeep
作用：深合并，新旧数据中同时存在的的属性为新旧数据合并之后的数据

mergeDeepIn
作用：对深层数据进行深合并

mergrDeepWith
作用：自定义深合并，可自行设置某些属性的值

#### 用法：

```js
 const Map1 = Immutable.fromJS({a:111,b:222,c:{d:333,e:444}});
 const Map2 = Immutable.fromJS({a:111,b:222,c:{e:444,f:555}});

 const Map3 = Map1.merge(Map2);
  //Map {a:111,b:222,c:{e:444,f:555}}
 const Map4 = Map1.mergeDeep(Map2);
  //Map {a:111,b:222,c:{d:333,e:444,f:555}}
 const Map5 = Map1.mergeWith((oldData,newData,key)=>{
      if(key === 'a'){
        return 666;
      }else{
        return newData
      }
    },Map2);
  //Map {a:666,b:222,c:{e:444,f:555}}
```

### concat()

#### 作用：

对象的拼接，用法与js数组中的concat()相同，返回一个新的对象。

#### 用法：

```js
const List = list1.concat(list2)
```

### map()

#### 作用：

遍历整个对象，对Map/List元素进行操作，返回一个新的对象。

#### 用法：

```js
Map({a:1,b:2}).map(val=>10*val)
//Map{a:10,b:20}
```

### Map特有的mapKey()

#### 作用：

遍历整个对象，对Map元素的key进行操作，返回一个新的对象。

#### 用法：

```js
Map({a:1,b:2}).mapKey(val=>val+'l')
//Map{al:10,bl:20}
```

### 过滤 filter

#### 作用：

返回一个新的对象，包括所有满足过滤条件的元素

#### 用法：

```js
Map({a:1,b:2}).filter((key,val)=>{
  return val == 2
})
//Map{b:2}
```

### 反转 reverse

#### 作用：

将数据的结构进行反转

#### 用法：

```js
Immutable.fromJS([1, 2, 3, 4, 5]).reverse();
// List [5,4,3,2,1]
Immutable.fromJS({a:1,b:{c:2,d:3},e:4}).recerse();
//Map {e:4,b:{c:2,d:3},a:1}
```

### 排序 sort & sortBy

#### 作用：

对数据结构进行排序

#### 用法：

```js
///List
Immutable.fromJS([4,3,5,2,6,1]).sort()
// List [1,2,3,4,5,6]
Immutable.fromJS([4,3,5,2,6,1]).sort((a,b)=>{
  if (a < b) { return -1; }
  if (a > b) { return 1; }
  if (a === b) { return 0; }
})
// List [1,2,3,4,5,6]
Immutable.fromJS([{a:3},{a:2},{a:4},{a:1}]).sortBy((val,index,obj)=>{
  return val.get('a')
},(a,b)=>{
  if (a < b) { return -1; }
  if (a > b) { return 1; }
  if (a === b) { return 0; }
})
//List  [ {a:3}, {a:2}, {a:4}, {a:1} ]

//Map

Immutable.fromJS( {b:1, a: 3, c: 2, d:5} ).sort()
//Map {b: 1, c: 2, a: 3, d: 5}
Immutable.fromJS( {b:1, a: 3, c: 2, d:5} ).sort((a,b)=>{
  if (a < b) { return -1; }
  if (a > b) { return 1; }
  if (a === b) { return 0; }
})
//Map {b: 1, c: 2, a: 3, d: 5}
Immutable.fromJS( {b:1, a: 3, c: 2, d:5} ).sortBy((value, key, obj)=> {
  return value
})
//Map {b: 1, c: 2, a: 3, d: 5}
```

### 分组 groupBy

#### 作用：

对数据进行分组

#### 用法：

```js
const listOfMaps = List([
  Map({ v: 0 }),
  Map({ v: 1 }),
  Map({ v: 1 }),
  Map({ v: 0 }),
  Map({ v: 2 })
])
const groupsOfMaps = listOfMaps.groupBy(x => x.get('v'))
// Map {
//   0: List [ Map{ "v": 0 }, Map { "v": 0 } ],
//   1: List [ Map{ "v": 1 }, Map { "v": 1 } ],
//   2: List [ Map{ "v": 2 } ],
// }
```

### max() 、 maxBy()

#### 作用：

查找最大值

#### 用法：

```js
Immutable.fromJS([1, 2, 3, 4]).max() //4

Immutable.fromJS([{a;1},{a:2},{a: 3},{a:4}]).maxBy((value,index,array)=>{
  return value.get('a')
})  //{a:4}
```

### min() 、 minBy()

#### 作用：

查找最小值

#### 用法：

```js
Immutable.fromJS([1, 2, 3, 4]).min() //1

Immutable.fromJS([{a;1},{a:2},{a: 3},{a:4}]).minBy((value,index,array)=>{
  return value.get('a')
})  //{a:1}
```

### reduce()

#### 作用：

和js中数组中的reduce相同,按索引升序的顺序处理元素

#### 用法：

```js
Immutable.fromJS([1,2,3,4]).reduce((pre,next,index,arr)=>{
  console.log(pre+next)
  return pre+next; 
})
// 3 6 10
```

### every()

#### 作用：

判断整个对象总中所有的元素是不是都满足某一个条件，都满足返回true，反之返回false。

#### 用法：

```js
Immutable.fromJS([1,2,3,4]).every((value,index,arr)=>{
  return value > 2
}) // false
```

### some()

#### 作用：

判断整个对象总中所有的元素是不是存在满足某一个条件的元素，若存在返回true，反之返回false。

#### 用法：

```js
Immutable.fromJS([1,2,3,4]).some((value,index,arr)=>{
  return value > 2
}) // true
```

### join()

#### 作用：

同js中数组的join方法。把准换为字符串

#### 用法：

```js
Immutable.fromJS([1,2,3,4]).join(',') //1,2,3,4
```

### isEmpty()

#### 作用：

判断是否为空

#### 用法：

```js
Immutable.fromJS([]).isEmpty(); // true
Immutable.fromJS({}).isEmpty(); // true
```























