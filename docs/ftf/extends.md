---
title: Extends
date: 2021-01-18
categories: article
author: Kamchan
tags:
- Javascript
- Extends
- Prototype
- 原形链
- 继承
---

## 继承

面向对象编程思想是根据需求分析对象，找到对象有什么特征和行为，然后通过代码的方式来实现需求。要想实现这个需求，就要创建对象，要想创建对象，就应该有构造函数，然后通过构造函数来创建对象，通过对象调用属性和方法来实现相应的功能及需求。

因为面向对象的思想适合于人的想法，编程起来会更加的方便，后期维护的时候也要会更加容易，所以我们才要学习面向对象编程。但JS不是一门面向对象的语言，而是一门基于对象的语言。JS不像JAVA,C#等面向对象的编程语言中有类(class)的概念(也是一种特殊的数据类型),JS中没有类(class),但是JS可以模拟面向对象的思想编程,在JS可以通过构造函数来模拟类的概念(class)。在ES6中，class (类)作为对象的模板被引入，可以通过 class 关键字定义类，但是它的的本质还是 function。

## 什么是继承

继承是一种类(class)与类之间的关系,JS中没有类,但是可以通过构造函数模拟类,然后通过原型来实现继承，继承是为了实现数据共享，js中的继承当然也是为了实现数据共享。

继承是子类继承父类的特征和行为，使得子类对象（实例）具有父类的属性和方法，或子类从父类继承方法，使得子类具有父类相同的行为。继承可以使得子类具有父类的各种属性和方法，而不需要再次编写相同的代码。

例如：

`人有 姓名, 性别, 年龄 ,吃饭, 睡觉等属性和行为。`

`学生有: 姓名, 性别, 年龄 ,吃饭, 睡觉 学习等属性和行为。`

`老师有: 姓名, 性别, 年龄 ,吃饭, 睡觉 ,教学等属性和行为。`

先定义一个人类，人有姓名, 性别, 年龄等属性，有,吃饭, 睡觉等行为。由人这个类派生出学生和老师两个类，为学生添加学习行为，为老师添加教学行为。

## 继承的方式

### 通过原型实现继承

#### 原型链继承
```js
function Person(name,age,sex) {
  this.name = name
  this.age = age
  this.sex = sex
  this.sayHi = function(){
    console.log('你好啊，我是'+this.name)
  }
} 

Person.prototype.eat = function () {
  console.log(this.name + '吃饭')
}

Person.prototype.sleep = function () {
  console.log(this.name + '睡觉')
}

function Student(score) {
  this.score = score
}
Student.prototype = new Person('张三', 18, '男')
Student.prototype.study = function () {
  console.log('学生' + this.name + '学习中')
}

let stu = new Student(99)

console.log(stu)
```
#### 打印结果
![原型链继承结果](https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/ftf/Archetypalchaininheritance.png)

#### 实例
```js
// 动物的构造函数
function Animal(name, weight) {
 this.name = name;
 this.weight = weight;
}
//动物的原型的方法
Animal.prototype.eat = function() {
 console.log("弟兄们冲啊，赶快吃吃吃!!!");
};
//狗的构造函数
function Dog(color) {
 this.color = color;
}
Dog.prototype = new Animal("小三", "30kg");
Dog.prototype.bitePerson = function() {
 console.log("~汪汪汪~,快让开,我要咬人了!!!");
};
//哈士奇构造函数
function Husky(age) {
 this.age = age;
}
Husky.prototype = new Dog("黑白色");
Husky.prototype.playYou = function() {
 console.log("咬坏充电器,咬坏耳机,拆家...哈哈，好玩不!!!");
};
var husky = new Husky(3);
console.log(husky.name, husky.weight, husky.color);
husky.eat();
husky.bitePerson();
husky.playYou();
```

#### 图解
![原型链图解](https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/ftf/prototype.png)

#### 缺点

为了数据共享,改变了原型指向,做到了继承，即通过改变原型指向实现了继承。这导致了一个问题，因为我们改变原型指向的同时,直接初始化了属性，这样继承过来的属性的值都是一样的了。这是个问题，如果我们想要改变继承过来的值，只能重新调用对象的属性进行重新赋值，这又导致我们上边的初始化失去了意义。

```js
function Person(name,age,sex) {
  this.name = name
  this.age = age
  this.sex = sex
  this.sayHi = function(){
    console.log('你好啊，我是'+this.name)
  }
} 

Person.prototype.eat = function () {
  console.log(this.name + '吃饭')
}

Person.prototype.sleep = function () {
  console.log(this.name + '睡觉')
}

function Student(score) {
  this.score = score
}
Student.prototype = new Person('张三', 18, '男')
Student.prototype.study = function () {
  console.log('学生' + this.name + '学习中')
}

let stu1 = new Student(99)
let stu2 = new Student(59)
let stu3 = new Student(66)

console.log(stu1.name,stu1.age,stu1.sex,stu1.score)
console.log(stu2.name,stu2.age,stu2.sex,stu2.score)
console.log(stu3.name,stu3.age,stu3.sex,stu3.score)
```

![原型链继承缺点](https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/ftf/ArchetypalchaininheritanceQuestion.png)

:::warning
重新调用对象的属性进行重新赋值，非常的麻烦，而且使我们上边的new Person("张三", 18, "男");初始化失去了意义。
:::

### 借用构造函数实现继承

如何解决上边的问题呢？答案是借用构造函数实现继承。

继承的时候,不改变原型的指向,直接调用父级的构造函数来为属性赋值，即把要继承的父级的构造函数拿过来,借用一下为属性赋值，这叫做借用构造函数。借用构造函数需要使用<font color="#c7254e">call ()</font>这个方法

#### 构造函数继承

```js
function Person(name,age,sex) {
  this.name = name
  this.age = age
  this.sex = sex
  this.sayHi = function(){
    console.log('你好啊，我是'+this.name)
  }
} 

Person.prototype.eat = function () {
  console.log(this.name + '吃饭')
}

Person.prototype.sleep = function () {
  console.log(this.name + '睡觉')
}

function Student(name,age,sex,score) {
  Person.call(this,name,age,sex)
  this.score = score
}

Student.prototype.study = function () {
  console.log('学生' + this.name + '学习中')
}

let stu1 = new Student('张三', 18, '女',99)
let stu2 = new Student('李四', 31, '男',99)
let stu3 = new Student('王五', 23, '男',99)

console.log(stu1.name,stu1.age,stu1.sex,stu1.score)
console.log(stu2.name,stu2.age,stu2.sex,stu2.score)
console.log(stu3.name,stu3.age,stu3.sex,stu3.score)
```

#### 打印结果
![构造函数继承](https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/ftf/Constructorinheritance.png)

#### 缺点
借用构造函数继承,解决了继承的时候属性重复的问题。但是这又导致一个问题即父类中的原型方法不能被继承。

```js
function Person(name,age,sex) {
  this.name = name
  this.age = age
  this.sex = sex
  this.sayHi = function(){
    console.log('你好啊，我是'+this.name)
  }
} 

Person.prototype.eat = function () {
  console.log(this.name + '吃饭')
}

Person.prototype.sleep = function () {
  console.log(this.name + '睡觉')
}

function Student(name,age,sex,score) {
  Person.call(this,name,age,sex)
  this.score = score
}

Student.prototype.study = function () {
  console.log('学生' + this.name + '学习中')
}

let stu = new Student('张三', 18, '女',99)

console.log(stu.name,stu.age,stu.sex,stu.score)
stu.study()
stu.eat()
stu.sleep()
```

![构造函数继承缺点](https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/ftf/ConstructorinheritanceQuestion.png)

:::tip
无论是单独使用原型链继承，还是单独使用借用构造函数继承，都有很大的缺点，最好的办法是，将两者结合一起使用，发挥各自的优势，这就是我们下面要讲的组合继承。
:::

### 通过组合继承的方式

原型继承和借用构造函数继承都存在各自的缺点，我们可以将这二者结合到一起，从而发挥二者之长。

即在继承过程中，既可以保证每个实例都有它自己的属性，又能做到对一些属性和方法的复用。

这时组合继承应运而生，组合继承=原型继承+借用构造函数继承。

#### 组合继承

`组合继承是最常用的继承方式`

```js
function Person(name,age,sex) {
  this.name = name
  this.age = age
  this.sex = sex
  this.sayHi = function(){
    console.log('你好啊，我是'+this.name)
  }
} 

Person.prototype.eat = function () {
  console.log(this.name + '吃饭')
}

Person.prototype.sleep = function () {
  console.log(this.name + '睡觉')
}

function Student(name,age,sex,score) {
  Person.call(this,name,age,sex)
  this.score = score
}

Student.prototype = new Person()
Student.prototype.study = function () {
  console.log('学生' + this.name + '学习中')
}

let stu1 = new Student('张三', 18, '女',99)
let stu2 = new Student('李四', 23, '男',66)

console.log(stu1.name,stu1.age,stu1.sex,stu1.score)
stu1.study()
stu1.eat()
stu1.sleep()
console.log(stu2.name,stu2.age,stu2.sex,stu2.score)
stu2.study()
stu2.eat()
stu2.sleep()
```

#### 打印结果

![组合继承](https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/ftf/Combinationofinheritance.png)

以上继承的方式核心是在子类的构造函数中通过 <font color="#c7254e">Parent.call(this)</font> 继承父类的属性

然后改变子类的原型为 <font color="#c7254e">new Parent() </font>来继承父类的函数。

#### 缺点
这种继承方式优点在于构造函数可以传参，不会与父类引用属性共享，可以复用父类的函数，但是也存在一个缺点就是在继承父类函数的时候调用了父类构造函数，导致子类的原型上多了不需要的父类属性，存在内存上的浪费。

```js
function Person(name,age,sex) {
  this.name = name
  this.age = age
  this.sex = sex
  this.sayHi = function(){
    console.log('你好啊，我是'+this.name)
  }
} 

Person.prototype.eat = function () {
  console.log(this.name + '吃饭')
}

Person.prototype.sleep = function () {
  console.log(this.name + '睡觉')
}

function Student(name,age,sex,score) {
  Person.call(this,name,age,sex)
  this.score = score
}

Student.prototype = new Person()
Student.prototype.study = function () {
  console.log('学生' + this.name + '学习中')
}

let stu = new Student('张三', 18, '女',99)

console.log(stu)
```

![组合继承缺点](https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/ftf/CombinationofinheritanceQuestion.png)

### 通过寄生组合继承的方式

这种继承方式对组合继承进行了优化，组合继承缺点在于继承父类函数时调用了构造函数，我们只需要优化掉这点就行了。

#### 寄生组合继承

```js
function Person(name,age,sex) {
  this.name = name
  this.age = age
  this.sex = sex
  this.sayHi = function(){
    console.log('你好啊，我是'+this.name)
  }
} 

Person.prototype.eat = function () {
  console.log(this.name + '吃饭')
}

Person.prototype.sleep = function () {
  console.log(this.name + '睡觉')
}

function Student(name,age,sex,score) {
  Person.call(this,name,age,sex)
  this.score = score
}

Student.prototype = Object.create(Person.prototype)

Student.prototype.study = function () {
  console.log('学生' + this.name + '学习中')
}

let stu = new Student('张三', 18, '男',99)

console.log(stu.name,stu.age,stu.sex,stu.score)
stu.eat()
stu.sleep()
stu.study()
console.log(stu)
```

#### 打印结果
![寄生组合继承](https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/ftf/Parasiticcombinatorialinheritance.png)

以上继承实现的核心就是将父类的原型赋值给了子类，并且将构造函数设置为子类，这样既解决了无用的父类属性问题，还能正确的找到子类的构造函数。

### 通过ES6的Class实现继承

前面几种继承方式都是通过原型去解决的

在 ES6 中，我们可以使用 class 去实现继承，并且实现起来很简单

#### Class继承

```js
class Person{
  constructor(name,age,sex){
    this.name = name
    this.age = age
    this.sex = sex
  }
  eat(){
    console.log(this.name + '吃饭')
  }
  sleep(){
    console.log(this.name + '睡觉')
  }
}

class Student extends Person{
  constructor(name,age,sex,score){
    super(name,age,sex)
    this.score = score
  }
  study(){
    console.log('学生' + this.name + '学习中')
  }
}

let stu = new Student('张三', 18, '男',99)
console.log(stu)
stu.eat()
stu.sleep()
stu.study()
```

#### 打印结果

![class继承](https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/ftf/classExtends.png)

<font color="#c7254e">class</font> 实现继承的核心在于使用 <font color="#c7254e">extends</font> 表明继承自哪个父类

并且在子类构造函数中必须调用 <font color="#c7254e">super</font>

因为这段代码可以看成 <font color="#c7254e">Parent.call(this, name,age,sex)</font>

当然了，之前也说了在 <font color="#c7254e">JS</font> 中并不存在类，<font color="#c7254e">class</font> 的本质就是函数。

## 总结
原型链是一种关系,是实例对象和原型对象之间的关系,这种关系是通过原型(proto)来联系的。

继承是类与类之间的关系，js不是面向对象的语言，没有类但可以通过函数模拟类，模拟面向对象中的继承。模拟继承是为了实现数据共享，节省内存空间。