---
title: 组件通信
date: 2019-08-26
categories: article
author: Random
tags:
- Vue
- Webpack
---

## 父组件到子组件

- 方式：通过子组件<font color="#c7254e">props</font>属性来传递数据 props是一个数组
- 注意：属性的值必须在组件中通过<font color="#c7254e">props</font>属性显示指定，否则，不会生效
- 说明：传递过来的<font color="#c7254e">props</font>属性的用法与<font color="#c7254e">data</font>属性的用法相同

```html
<div id="app">
  <!-- 如果需要往子组件总传递父组件data中的数据 需要加v-bind="数据名称" -->
  <hello v-bind:msg="info"></hello>
  <!-- 如果传递的是字面量 那么直接写-->
  <hello my-msg="abc"></hello>
</div>

<!-- js -->
<script>
  new Vue({
    el: "#app",
    data : {
      info : 15
    },
    components: {
      hello: {
        // 创建props及其传递过来的属性
        props: ['msg', 'myMsg'],
        template: '<h1>这是 hello 组件，这是消息：{{msg}} --- {{myMsg}}</h1>'
      }
    }
  })
</script>
```

## 子组件到父组件

- 方式：父组件给子组件传递一个函数，由子组件调用这个函数
  - 说明：借助<font color="#c7254e">vue</font>中的自定义事件<font color="#c7254e">（v-on:cunstomFn="fn"）</font>

- 步骤:
  - 1、在父组件中定义方法 <font color="#c7254e">parentFn</font>
  - 2、在子组件 组件引入标签 中绑定自定义事件 <font color="#c7254e">v-on:自定义事件名="父组件中的方法" ==> @pfn="parentFn"</font>
  - 3、子组件中通过<font color="#c7254e">$emit()</font>触发自定义事件事件 <tfont color="#c7254e">his.$emit(pfn,参数列表。。。)</tfont>

```js
<hello @pfn="parentFn"></hello>

<script>
  Vue.component('hello', {
    template: '<button @click="fn">按钮</button>',
    methods: {
      // 子组件：通过$emit调用
      fn() {
        this.$emit('pfn', '这是子组件传递给父组件的数据')
      }
    }
  })
  new Vue({
    methods: {
      // 父组件：提供方法
      parentFn(data) {
        console.log('父组件：', data)
      }
    }
  })
</script>
```

## 非父子组件通讯

:::tip
在简单的场景下，可以使用一个空的 Vue 实例作为事件总线
:::

- <font color="#c7254e">$on()</font>：绑定自定义事件

```js
var bus = new Vue()

// 在组件 B 绑定自定义事件
bus.$on('id-selected', function (id) {
  // ...
})
// 触发组件 A 中的事件
bus.$emit('id-selected', 1)
```

- 示例：组件A ---> 组件B

```js
<!-- 组件A： -->
<com-a></com-a>
<!-- 组件B： -->
<com-b></com-b>

<script>
  // 中间组件
  var bus = new Vue()
  // 通信组件
  var vm = new Vue({
    el: '#app',
    components: {
      comB: {
        template: '<p>组件A告诉我：{{msg}}</p>',
        data() {
          return {
            msg: ''
          }
        },
        created() {
          // 给中间组件绑定自定义事件 注意:如果用到this 需要用箭头函数
          bus.$on('tellComB', (msg) => {
            this.msg = msg
          })
        }
      },
      comA: {
        template: '<button @click="emitFn">告诉B</button>',
        methods: {
          emitFn() {
            // 触发中间组件中的自定义事件
            bus.$emit('tellComB', '土豆土豆我是南瓜')
          }
        }
      }
    }
  })
</script>
```

## 内容分发

- 通过`<slot></slot>` 标签指定内容展示区域

案例：

```html
<!-- html代码 -->
<div id="app">
  <hello>
    <!-- 如果只有一个slot插槽 那么不需要指定名称 -->
    <p slot="插槽名称">我是额外的内容</p>
  </hello>
</div>
```
```js
// js代码
new vue({
  el : "#app",
  components : {
    hello : {
      template : `
          <div>
            <p>我是子组件中的内容</p>
            <slot name="名称"></slot>
          </div>
        `
    }
  }
})
```

## 获取组件（或元素） - refs

- 说明：<font color="#c7254e">vm.$refs</font> 一个对象，持有已注册过 ref 的所有子组件（或HTML元素）
- 使用：在 HTML元素 中，添加<font color="#c7254e">ref</font>属性，然后在JS中通过<font color="#c7254e">vm.$refs.属性</font>来获取
- 注意：如果获取的是一个<font color="#c7254e">子组件</font>，那么通过<font color="#c7254e">ref</font>就能获取到子组件中的<font color="#c7254e">data</font>和<font color="#c7254e">methods</font>

```js
<div id="app">
  <div ref="dv"></div>
  <my res="my"></my>
</div>

<!-- js -->
<script>
  new Vue({
    el : "#app",
    mounted() {
      this.$refs.dv //获取到元素
      this.$refs.my //获取到组件
    },
    components : {
      my : {
        template: `<a>sss</a>`
      }
    }
  })
</script>
```

## SPA -单页应用程序

### SPA： Single Page Application

:::tip
单页Web应用（single page application，SPA），就是只有一个Web页面的应用，
是加载单个HTML页面，并在用户与应用程序交互时动态更新该页面的Web应用程序。
:::

- 单页面应用程序：
  - 只有第一次会加载页面, 以后的每次请求, 仅仅是获取必要的数据.然后, 由页面中js解析获取的数据, 展示在页面中

- 传统多页面应用程序：
  - 对于传统的多页面应用程序来说, 每次请求服务器返回的都是一个完整的页面

优势
- 1 减少了请求体积，加快页面响应速度，降低了对服务器的压力
- 2 更好的用户体验，让用户在web app感受native app的流畅

实现思路和技术点
- 1、<font color="#c7254e">ajax</font>
- 2、锚点的使用<font color="#c7254e">（window.location.hash #）</font>
- 3、<font color="#c7254e">hashchange</font> 事件 <font color="#c7254e">window.addEventListener("hashchange",function () {})</font>
- 4、监听锚点值变化的事件，根据不同的锚点值，请求相应的数据
- 5、原本用作页面内部进行跳转，定位并展示相应的内容

## 路由

- 路由即：浏览器中的哈希值<font color="#c7254e">（# hash）</font>与展示视图内容<font color="#c7254e">（template）</font>之间的对应规则
- <font color="#c7254e">vue</font>中的路由是：<font color="#c7254e">hash</font> 和 <font color="#c7254e">component</font>的对应关系
在 <font color="#c7254e">Web app</font> 中，通过一个页面来展示和管理整个应用的功能。
<font color="#c7254e">SPA</font>往往是功能复杂的应用，为了有效管理所有视图内容，前端路由 应运而生！
简单来说，路由就是一套映射规则（一对一的对应规则），由开发人员制定规则。
当<font color="#c7254e">URL</font>中的哈希值<font color="#c7254e">（# hash）</font>发生改变后，路由会根据制定好的规则，展示对应的视图内容

### 基本使用

- 安装：<font color="#c7254e">npm i -S vue-router</font>

```html
<div id="app">
      <!-- 5 路由入口 指定跳转到只定入口 -->
      <router-link to="/home">首页</router-link>
      <router-link to="/login">登录</router-link>
    
      <!-- 7 路由出口：用来展示匹配路由视图内容 -->
      <router-view></router-view>
    </div>
```
```js
    <!-- 1 导入 vue.js -->
    <script src="./vue.js"></script>
    <!-- 2 导入 路由文件 -->
    <script src="./node_modules/vue-router/dist/vue-router.js"></script>
    <script>
      // 3 创建两个组件
      const Home = Vue.component('home', {
        template: '<h1>这是 Home 组件</h1>'
      })
      const Login = Vue.component('login', {
        template: '<h1>这是 Login 组件</h1>'
      })
    
      // 4 创建路由对象
      const router = new VueRouter({
        routes: [
          // 路径和组件一一对应
          { path: '/home', component: Home },
          { path: '/login', component: Login }
        ]
      })
    
      var vm = new Vue({
        el: '#app',
        // 6 将路由实例挂载到vue实例
        router
      })
    </script>
```

### 重定向

```js
//  将path 重定向到 redirect
{ path: '/', redirect: '/home' }
```

### 路由其他配置

- 路由导航高亮
  -说明：当前匹配的导航链接，会自动添加<font color="#c7254e">router-link-exact-active</font>、<font color="#c7254e">router-link-active</font>类
  -配置：<font color="#c7254e">linkActiveClass</font>

- 匹配路由模式
  -配置：<font color="#c7254e">mode</font>

```js
new Router({
  routers:[],
  mode: "hash", //默认hash | history 可以达到隐藏地址栏hash值 | abstract，如果发现没有浏览器的 API 则强制进入
  linkActiveClass : "now" //当前匹配的导航链接将被自动添加now类
})
```

### 路由参数

- 说明：我们经常需要把某种模式匹配到的所有路由，全都映射到同一个组件，此时，可以通过路由参数来处理
- 语法：<font color="#c7254e">/user/:id</font>
- 使用：当匹配到一个路由时，参数值会被设置到 <font color="#c7254e">this.$route.params</font>
- 其他：可以通过 <font color="#c7254e">$route.query</font> 获取到 <font color="#c7254e">URL</font> 中的查询参数 等

```js
// 方式一
    <router-link to="/user/1001">如果你需要在模版中使用路由参数 可以这样 {{$router.params.id}}</router-link>
    // 方式二
    <router-link :to="{path:'/user',query:{name:'jack',age:18}}">用户 Rose</router-link>


    <script>
    // 路由
    var router = new Router({
      routers : [
        // 方式一 注意 只有/user/1001这种形式能被匹配 /user | /user/ | /user/1001/ 都不能被匹配
        // 将来通过$router.params获取参数返回 {id:1001}
        { path: '/user/:id', component: User },
        // 方式二
        { path: "user" , component: User}
      ]
    })

    // User组件：
    const User = {
      template: `<div>User {{ $route.params.id }}</div>`
    }
    //如果要子啊vue实例中获取路由参数 则使用this.$router.params 获取路由参数对象
    //{{$router.query}} 获取路由中的查询字符串 返回对象
    </script>
```

### 嵌套路由 - 子路由

- 路由是可以嵌套的，即：路由中又包含子路由
- 规则：父组件中包含 <font color="#c7254e">router-view</font>，在路由规则中使用 <font color="#c7254e">children</font> 配置

```js
 // 父组件：
    const User = Vue.component('user', {
      template: `
        <div class="user">
          <h2>User Center</h2>
          <router-link to="/user/profile">个人资料</router-link>
          <router-link to="/user/posts">岗位</router-link>
          <!-- 子路由展示在此处 -->
          <router-view></router-view>
        </div>
        `
    })

    // 子组件[简写]
    const UserProfile = {
      template: '<h3>个人资料：张三</h3>'
    }
    const UserPosts = {
      template: '<h3>岗位：FE</h3>'
    }

    // 路由
    var router =new Router({
      routers : [

        { path: '/user', component: User,
          // 子路由配置：
          children: [
            {
              // 当 /user/profile 匹配成功，
              // UserProfile 会被渲染在 User 的 <router-view> 中
              path: 'profile',
              component: UserProfile
            },
            {
              // 当 /user/posts 匹配成功
              // UserPosts 会被渲染在 User 的 <router-view> 中
              path: 'posts',
              component: UserPosts
            }
          ]
        }
      ]
    })
```











































































































































