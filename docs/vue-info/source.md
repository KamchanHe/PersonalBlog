# Vue原理剖析

## 源码目录剖析

- comipler 模板解析的相关文件
- core 核心代码
- platforms 对应的两个平台
- server服务端渲染相关
- sfc 解析vue文件变成一个对象
- shared 定义的工具方法

## 从入口文件剖析

引入代码时会优先采用module 如果找不到则会加载main对应文件

- package.json

  - "main": "dist/vue.runtime.common.js",
  - "module": "dist/vue.runtime.esm.js"

- 查看npm run build的结果

  - "build": "node scripts/build.js"

- 查看build.js,build中会基于config文件来实现打包

  - 'web-runtime-cjs-dev' 只包含runtime
  - 'web-runtime-cjs-prod'
  - 'web-full-cjs-dev' 包含runtime+compiler
  - 'web-full-cjs-prod'
  - 'web-runtime-esm' 只包含runtime (es6 module)
  - 'web-full-esm' 包含runtime+compiler(es6 module)
  - .......

  >找到打包前的文件 web/entry-runtime-with-compiler

- entry-runtime-with-compiler

  - 找到对应platforms下的web下的entry-runtime-with-compiler文件
  - './runtime/index' Vue在runtime/index中定义

- ./runtime/index

  - 引入了 'core/index'中的Vue

- core/index

  - './instance/index' 引入了Vue
  - initGlobalAPI() 初始化全局API

- instance/index

>最终我们找到了Vue的构造函数

## entry-runtime-with-compiler

在此文件中包装了$mount方法，如果有template会将template转化成render函数

- compileToFunctions
  - 词法分析
  - 语法分析
  - 生成代码
  - new Function，转化成render函数

>如果有render会先调用render，没有render会找模板是不是 #号方式引入.如果不是就找外部模板

## runtime/index.js

- Vue.prototype.patch 提供了__patach__方法
- $mount方法通用的$mount方法，会调用挂载组件的方法

## core/index.js

- initGlobalApi 初始化全局api方法

## initGlobalAPI

- Vue.util 初始化vue的工具方法
- Vue.set 响应式变化的方法
- Vue.delete
- Vue.nextTick
- Vue.component
- Vue.directive
- Vue.filter

>增加了keep-alive组件

```js
Vue.nextTick // 浏览器事件环
initUse(Vue) // 初始化Vue.use 默认会调用当前插件的install方法
initMixin(Vue) //初始化Vue.mixin   混合 将传入的属性混合到this.options中
initExtend(Vue) // 初始化Vue.extend 会创建个子类 继承于父类
```

## 分析入口做了哪些事？

- instance/index vue的构造函数中默认会调用`this._init`方法

```js
// 初始化vue生命周期流程以及响应式流程启动
initMixin(Vue) // _init
// 初始实例属性和方法 $set\$delete\$watch 挂载与实例相关的方法
stateMixin(Vue)
// vue实例中事件相关的方法 $on\$once\$once\$off\$emit
eventsMixin(Vue)
// 生命周期相关方法  $forceUpdate $destroy
lifecycleMixin(Vue)
// 渲染函数 提供_render方法
renderMixin(Vue)
```

>生命周期图

## initMixin

```js
initLifecycle(vm) // 初始化家族关系
initEvents(vm)    // 给实例增加events属性
initRender(vm)    // 在实例上增加createElement方法
callHook(vm, 'beforeCreate') // 调用beforeCreated方法
initInjections(vm) // 初始化inject方法
initState(vm)      // 初始化 props,method,data,watch
initProvide(vm)    // 初始化话provide方法
callHook(vm, 'created') // 调用created生命周期
vm.$mount(vm.$options.el) // 挂载元素
```

## initState

初始化实例上的内容

```js
initProps(vm, opts.props) // 初始化属性
initMethods(vm, opts.methods) // 初始化方法
initData(vm)  // 初始化数据
initComputed(vm, opts.computed) // 初始化计算属性
initWatch(vm, opts.watch) // 初始化watch
```

## iniProps

- 将所有的属性放到_props上
- 通过vm代理_props上的属性
- 如果是跟节点将属性变成响应式的属性

## initMethods

- 在实例上增加对应的方法

## initData

响应式原理

- observe(data, true /* asRootData */)
- this.walk(value) // 循环遍历
- defineReactive(obj, keys[i]); // 定义响应式数据变化
- get方法中dep.depend()依赖收集
- set方法中dep.notify()通知更新

## initComputed

- 通过watcher实现计算属性
- 如果watcher是脏的就获取最新结果

## initWatch

- 借用Watcher绑定$watch,初始化$watch方法

## $mount

将模板编译成函数

```js
compileToFunctions(template, {
    outputSourceRange: process.env.NODE_ENV !== 'production',
    shouldDecodeNewlines,
    shouldDecodeNewlinesForHref,
    delimiters: options.delimiters,
    comments: options.comments
}, this);
// 将解析出来的方法放到this上，调用上层mount方法
// mountComponent();
updateComponent = () => { // 增加更新组件方法
    vm._update(vm._render(), hydrating)
}
// 监听数据变化 执行beforeUpdate方法
new Watcher(vm, updateComponent, noop, {
    before () {
        if (vm._isMounted && !vm._isDestroyed) {
            callHook(vm, 'beforeUpdate')
        }
    }
}, true /* isRenderWatcher */)
callHook(vm, 'mounted') // 组件挂载完成
```

## lifecycleMixin

调用_update方法

- Vue.prototype._update
  - vm.**patch**() 渲染出真实的dom元素

## `__patch__方法`

dom-diff原理

- createPatchFunction

## renderMixin

- `Vue.prototype._render` 获取虚拟dom元素
- `vm._update`会更新页面

![newVue](@public/newVue.png)

![diff](@public/diff.jpg)




































































